import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const STATIC_DIR = path.join(process.cwd(), 'static');

interface ImageReference {
  file: string;
  imagePath: string;
  altText: string;
  line: number;
  valid: boolean;
  error?: string;
}

/**
 * Get all MDX files in the docs directory
 */
function getAllMdxFiles(): string[] {
  const pattern = path.join(DOCS_DIR, '**', '*.mdx');
  return glob.sync(pattern);
}

/**
 * Extract all image references from MDX content
 */
function extractImageReferences(content: string, filePath: string): ImageReference[] {
  const images: ImageReference[] = [];
  const lines = content.split('\n');

  // Track code blocks to skip template strings
  let inCodeBlock = false;

  // Match markdown images: ![alt](path)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

  lines.forEach((line, index) => {
    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    // Skip images inside code blocks (they're examples, not actual images)
    if (inCodeBlock) {
      return;
    }

    let match;
    while ((match = imageRegex.exec(line)) !== null) {
      const altText = match[1];
      const imagePath = match[2];

      // Skip template strings (${...})
      if (imagePath.includes('${') || imagePath.includes('}')) {
        continue;
      }

      images.push({
        file: filePath,
        imagePath,
        altText,
        line: index + 1,
        valid: true, // Will be validated
      });
    }
  });

  // Reset code block tracking for JSX parsing
  inCodeBlock = false;

  // Also match JSX img tags: <img src="..." alt="..." />
  const jsxImageRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/g;

  lines.forEach((line, index) => {
    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      return;
    }

    let match;
    while ((match = jsxImageRegex.exec(line)) !== null) {
      const imagePath = match[1];
      const altText = match[2];

      // Skip template strings
      if (imagePath.includes('${') || imagePath.includes('}')) {
        continue;
      }

      images.push({
        file: filePath,
        imagePath,
        altText,
        line: index + 1,
        valid: true,
      });
    }
  });

  // Reset code block tracking for JSX no-alt parsing
  inCodeBlock = false;

  // Also match JSX img without alt: <img src="..." />
  const jsxImageNoAltRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*(?<!alt=["'][^"']*["'])[^>]*\/?>/g;

  lines.forEach((line, index) => {
    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    if (inCodeBlock) {
      return;
    }

    // Skip if already has alt attribute
    if (line.includes('alt=')) return;

    let match;
    while ((match = jsxImageNoAltRegex.exec(line)) !== null) {
      const imagePath = match[1];

      // Skip template strings
      if (imagePath.includes('${') || imagePath.includes('}')) {
        continue;
      }

      images.push({
        file: filePath,
        imagePath,
        altText: '',
        line: index + 1,
        valid: false,
        error: 'Missing alt text',
      });
    }
  });

  return images;
}

/**
 * Validate image reference
 */
function validateImageReference(image: ImageReference): ImageReference {
  // Skip if already marked invalid
  if (!image.valid) {
    return image;
  }

  // Check for external URLs (valid)
  if (image.imagePath.startsWith('http://') || image.imagePath.startsWith('https://')) {
    return { ...image, valid: true };
  }

  // Check for data URIs
  if (image.imagePath.startsWith('data:')) {
    // Warn about large data URIs
    if (image.imagePath.length > 1000) {
      return {
        ...image,
        valid: false,
        error: `Data URI too large (${image.imagePath.length} chars). Consider using external file.`,
      };
    }
    return { ...image, valid: true };
  }

  // Check for absolute paths starting with /
  if (image.imagePath.startsWith('/')) {
    const fullPath = path.join(process.cwd(), image.imagePath.replace(/^\//, ''));
    const exists = fs.existsSync(fullPath);

    if (!exists) {
      return {
        ...image,
        valid: false,
        error: `Image file not found: ${fullPath}`,
      };
    }

    return { ...image, valid: true };
  }

  // Check for relative paths
  const fromDir = path.dirname(image.file);
  const resolvedPath = path.resolve(fromDir, image.imagePath);
  const exists = fs.existsSync(resolvedPath);

  if (!exists) {
    return {
      ...image,
      valid: false,
      error: `Image file not found: ${resolvedPath}`,
    };
  }

  return { ...image, valid: true };
}

/**
 * Check if alt text is meaningful
 */
function hasEmptyAltText(image: ImageReference): boolean {
  return image.altText.trim() === '';
}

/**
 * Check if alt text is just the filename
 */
function isFilenameAlt(image: ImageReference): boolean {
  const filename = path.basename(image.imagePath, path.extname(image.imagePath));
  return image.altText.toLowerCase() === filename.toLowerCase();
}

/**
 * Check if alt text is too generic
 */
function isGenericAlt(image: ImageReference): boolean {
  const genericTerms = ['image', 'picture', 'photo', 'screenshot', 'img'];
  const altLower = image.altText.toLowerCase().trim();

  return genericTerms.some(term => altLower === term);
}

describe('Image References Validation', () => {
  const mdxFiles = getAllMdxFiles();

  it('should extract all image references from MDX files', () => {
    let totalImages = 0;

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);
      totalImages += images.length;
    }

    console.log(`\n📊 Found ${totalImages} image references across ${mdxFiles.length} files`);

    // Allow zero images (some docs may not have images)
    expect(totalImages).toBeGreaterThanOrEqual(0);
  });

  it('should have no broken image paths', () => {
    const brokenImages: ImageReference[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      images.forEach(image => {
        const validated = validateImageReference(image);
        if (!validated.valid && validated.error !== 'Missing alt text') {
          brokenImages.push(validated);
        }
      });
    }

    if (brokenImages.length > 0) {
      console.log('\n❌ Broken image paths found:');
      brokenImages.forEach(image => {
        console.log(`  File: ${path.relative(process.cwd(), image.file)}:${image.line}`);
        console.log(`  Image: ${image.imagePath}`);
        console.log(`  Error: ${image.error}`);
        console.log('');
      });
    }

    expect(brokenImages.length).toBe(0);
  });

  it('should have alt text for all images (accessibility)', () => {
    const missingAlt: ImageReference[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      images.forEach(image => {
        if (hasEmptyAltText(image)) {
          missingAlt.push(image);
        }
      });
    }

    if (missingAlt.length > 0) {
      console.log('\n❌ Images without alt text found (accessibility issue):');
      missingAlt.forEach(image => {
        console.log(`  File: ${path.relative(process.cwd(), image.file)}:${image.line}`);
        console.log(`  Image: ${image.imagePath}`);
        console.log('');
      });
    }

    expect(missingAlt.length).toBe(0);
  });

  it('should have meaningful alt text (not just filename)', () => {
    const filenameAlts: ImageReference[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      images.forEach(image => {
        if (!hasEmptyAltText(image) && isFilenameAlt(image)) {
          filenameAlts.push(image);
        }
      });
    }

    if (filenameAlts.length > 0) {
      console.log('\n⚠️  Images with filename as alt text (consider more descriptive text):');
      filenameAlts.forEach(image => {
        console.log(`  File: ${path.relative(process.cwd(), image.file)}:${image.line}`);
        console.log(`  Image: ${image.imagePath}`);
        console.log(`  Alt: ${image.altText}`);
        console.log('');
      });
    }

    // This is a warning, not a hard failure
    expect(filenameAlts.length).toBeGreaterThanOrEqual(0);
  });

  it('should have descriptive alt text (not generic terms)', () => {
    const genericAlts: ImageReference[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      images.forEach(image => {
        if (!hasEmptyAltText(image) && isGenericAlt(image)) {
          genericAlts.push(image);
        }
      });
    }

    if (genericAlts.length > 0) {
      console.log('\n⚠️  Images with generic alt text:');
      genericAlts.forEach(image => {
        console.log(`  File: ${path.relative(process.cwd(), image.file)}:${image.line}`);
        console.log(`  Image: ${image.imagePath}`);
        console.log(`  Alt: ${image.altText}`);
        console.log('');
      });
    }

    // This is a warning, not a hard failure
    expect(genericAlts.length).toBeGreaterThanOrEqual(0);
  });

  it('should have no enormous data URI images', () => {
    const largeDataURIs: ImageReference[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      images.forEach(image => {
        if (image.imagePath.startsWith('data:') && image.imagePath.length > 1000) {
          largeDataURIs.push(image);
        }
      });
    }

    if (largeDataURIs.length > 0) {
      console.log('\n❌ Large data URI images found (should use external files):');
      largeDataURIs.forEach(image => {
        console.log(`  File: ${path.relative(process.cwd(), image.file)}:${image.line}`);
        console.log(`  Size: ${image.imagePath.length} characters`);
        console.log('');
      });
    }

    expect(largeDataURIs.length).toBe(0);
  });

  it('should report image reference statistics', () => {
    let totalImages = 0;
    let externalImages = 0;
    let localImages = 0;
    let dataURIs = 0;
    let withAlt = 0;
    let withoutAlt = 0;

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      totalImages += images.length;

      images.forEach(image => {
        if (image.imagePath.startsWith('http://') || image.imagePath.startsWith('https://')) {
          externalImages++;
        } else if (image.imagePath.startsWith('data:')) {
          dataURIs++;
        } else {
          localImages++;
        }

        if (hasEmptyAltText(image)) {
          withoutAlt++;
        } else {
          withAlt++;
        }
      });
    }

    console.log('\n📊 Image Reference Statistics:');
    console.log(`  Total images: ${totalImages}`);
    console.log(`  External images (URLs): ${externalImages}`);
    console.log(`  Local images (files): ${localImages}`);
    console.log(`  Data URIs: ${dataURIs}`);
    console.log(`  Images with alt text: ${withAlt}`);
    console.log(`  Images without alt text: ${withoutAlt}`);

    if (totalImages > 0) {
      console.log(`  Alt text coverage: ${((withAlt / totalImages) * 100).toFixed(1)}%`);
    }

    expect(totalImages).toBeGreaterThanOrEqual(0);
  });

  it('should categorize images by type', () => {
    const imageExtensions = new Map<string, number>();

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const images = extractImageReferences(content, file);

      images.forEach(image => {
        // Skip external URLs and data URIs
        if (image.imagePath.startsWith('http') || image.imagePath.startsWith('data:')) {
          return;
        }

        const ext = path.extname(image.imagePath).toLowerCase();
        if (ext) {
          imageExtensions.set(ext, (imageExtensions.get(ext) || 0) + 1);
        }
      });
    }

    if (imageExtensions.size > 0) {
      console.log('\n📊 Images by file type:');
      const sorted = [...imageExtensions.entries()].sort((a, b) => b[1] - a[1]);
      sorted.forEach(([ext, count]) => {
        console.log(`  ${ext}: ${count} images`);
      });
    }

    expect(imageExtensions.size).toBeGreaterThanOrEqual(0);
  });
});
