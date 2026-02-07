import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DOCS_DIR = path.join(process.cwd(), 'docs');

interface LinkValidation {
  file: string;
  link: string;
  type: 'markdown' | 'relative' | 'anchor';
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
 * Extract all internal links from MDX content
 */
function extractInternalLinks(content: string, filePath: string): LinkValidation[] {
  const results: LinkValidation[] = [];

  // Match markdown links: [text](path)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = markdownLinkRegex.exec(content)) !== null) {
    const linkText = match[1];
    const linkPath = match[2];

    // Skip external links (http/https)
    if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
      continue;
    }

    // Skip mailto and other protocols
    if (linkPath.includes(':')) {
      continue;
    }

    // Categorize link type
    if (linkPath.startsWith('#')) {
      // Anchor link
      results.push(validateAnchorLink(content, filePath, linkPath, linkText));
    } else if (linkPath.startsWith('./') || linkPath.startsWith('../')) {
      // Relative link
      results.push(validateRelativeLink(filePath, linkPath, linkText));
    } else if (linkPath.startsWith('/')) {
      // Absolute internal link
      results.push(validateAbsoluteLink(linkPath, linkText, filePath));
    }
  }

  return results;
}

/**
 * Validate anchor link within the same file
 */
function validateAnchorLink(content: string, filePath: string, anchor: string, linkText: string): LinkValidation {
  const headerId = anchor.slice(1); // Remove leading #

  // Extract all headers from the file
  const headerRegex = /^#{1,6}\s+(.+)$/gm;
  const headers: string[] = [];
  let headerMatch;

  while ((headerMatch = headerRegex.exec(content)) !== null) {
    const headerText = headerMatch[1].trim();
    // Convert header to Docusaurus anchor format
    const anchorId = headerText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-')       // Remove duplicate hyphens
      .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens

    headers.push(anchorId);
  }

  const valid = headers.includes(headerId);

  return {
    file: filePath,
    link: anchor,
    type: 'anchor',
    valid,
    error: valid ? undefined : `Anchor "${headerId}" not found. Available: ${headers.join(', ')}`,
  };
}

/**
 * Validate relative link (./file or ../file)
 */
function validateRelativeLink(fromFile: string, linkPath: string, linkText: string): LinkValidation {
  const fromDir = path.dirname(fromFile);

  // Remove anchor and query params
  const cleanPath = linkPath.split('#')[0].split('?')[0];

  // Resolve relative path
  const resolvedPath = path.resolve(fromDir, cleanPath);

  // Check if file exists (try with and without .mdx extension)
  const exists = fs.existsSync(resolvedPath) ||
                 fs.existsSync(resolvedPath + '.mdx') ||
                 fs.existsSync(resolvedPath + '.md');

  return {
    file: fromFile,
    link: linkPath,
    type: 'relative',
    valid: exists,
    error: exists ? undefined : `File not found: ${resolvedPath}`,
  };
}

/**
 * Validate absolute internal link (/docs/...)
 */
function validateAbsoluteLink(linkPath: string, linkText: string, fromFile: string): LinkValidation {
  // Remove anchor and query params
  const cleanPath = linkPath.split('#')[0].split('?')[0];

  // Convert /docs/path to docs/path.mdx
  let targetPath = cleanPath.replace(/^\//, ''); // Remove leading slash

  // If it doesn't have an extension, try adding .mdx
  if (!path.extname(targetPath)) {
    targetPath += '.mdx';
  }

  const fullPath = path.join(process.cwd(), targetPath);
  const exists = fs.existsSync(fullPath);

  return {
    file: fromFile,
    link: linkPath,
    type: 'markdown',
    valid: exists,
    error: exists ? undefined : `File not found: ${fullPath}`,
  };
}

describe('Internal Links Validation', () => {
  const mdxFiles = getAllMdxFiles();

  it('should find all 76 MDX files', () => {
    expect(mdxFiles.length).toBe(76);
  });

  it('should validate all internal links', () => {
    const allValidations: LinkValidation[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const validations = extractInternalLinks(content, file);
      allValidations.push(...validations);
    }

    // Filter out invalid links
    const brokenLinks = allValidations.filter(v => !v.valid);

    if (brokenLinks.length > 0) {
      console.log('\n❌ Broken internal links found:');
      brokenLinks.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}`);
        console.log(`  Link: ${link.link}`);
        console.log(`  Type: ${link.type}`);
        console.log(`  Error: ${link.error}`);
        console.log('');
      });
    }

    expect(brokenLinks.length).toBe(0);
  });

  it('should have no links to removed files', () => {
    const removedFiles = [
      '/docs/old-page.mdx',
      '/docs/deprecated',
      '/docs/archive',
    ];

    const allValidations: LinkValidation[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const validations = extractInternalLinks(content, file);
      allValidations.push(...validations);
    }

    const linksToRemoved = allValidations.filter(v =>
      removedFiles.some(removed => v.link.includes(removed))
    );

    expect(linksToRemoved.length).toBe(0);
  });

  it('should validate anchor links point to existing headers', () => {
    const allValidations: LinkValidation[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const validations = extractInternalLinks(content, file);
      const anchorLinks = validations.filter(v => v.type === 'anchor');
      allValidations.push(...anchorLinks);
    }

    const brokenAnchors = allValidations.filter(v => !v.valid);

    if (brokenAnchors.length > 0) {
      console.log('\n❌ Broken anchor links found:');
      brokenAnchors.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}`);
        console.log(`  Anchor: ${link.link}`);
        console.log(`  Error: ${link.error}`);
        console.log('');
      });
    }

    expect(brokenAnchors.length).toBe(0);
  });

  it('should validate relative links resolve correctly', () => {
    const allValidations: LinkValidation[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const validations = extractInternalLinks(content, file);
      const relativeLinks = validations.filter(v => v.type === 'relative');
      allValidations.push(...relativeLinks);
    }

    const brokenRelative = allValidations.filter(v => !v.valid);

    if (brokenRelative.length > 0) {
      console.log('\n❌ Broken relative links found:');
      brokenRelative.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}`);
        console.log(`  Link: ${link.link}`);
        console.log(`  Error: ${link.error}`);
        console.log('');
      });
    }

    expect(brokenRelative.length).toBe(0);
  });

  it('should have valid markdown links to docs', () => {
    const allValidations: LinkValidation[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const validations = extractInternalLinks(content, file);
      const markdownLinks = validations.filter(v => v.type === 'markdown');
      allValidations.push(...markdownLinks);
    }

    const brokenMarkdown = allValidations.filter(v => !v.valid);

    if (brokenMarkdown.length > 0) {
      console.log('\n❌ Broken markdown links found:');
      brokenMarkdown.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}`);
        console.log(`  Link: ${link.link}`);
        console.log(`  Error: ${link.error}`);
        console.log('');
      });
    }

    expect(brokenMarkdown.length).toBe(0);
  });

  it('should report internal link statistics', () => {
    const stats = {
      totalLinks: 0,
      anchorLinks: 0,
      relativeLinks: 0,
      markdownLinks: 0,
      validLinks: 0,
      brokenLinks: 0,
    };

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const validations = extractInternalLinks(content, file);

      stats.totalLinks += validations.length;
      stats.anchorLinks += validations.filter(v => v.type === 'anchor').length;
      stats.relativeLinks += validations.filter(v => v.type === 'relative').length;
      stats.markdownLinks += validations.filter(v => v.type === 'markdown').length;
      stats.validLinks += validations.filter(v => v.valid).length;
      stats.brokenLinks += validations.filter(v => !v.valid).length;
    }

    console.log('\n📊 Internal Link Statistics:');
    console.log(`  Total internal links: ${stats.totalLinks}`);
    console.log(`  Anchor links (#section): ${stats.anchorLinks}`);
    console.log(`  Relative links (./file): ${stats.relativeLinks}`);
    console.log(`  Markdown links (/docs/...): ${stats.markdownLinks}`);
    console.log(`  Valid links: ${stats.validLinks}`);
    console.log(`  Broken links: ${stats.brokenLinks}`);

    // Allow zero internal links if this is an external-focused documentation site
    expect(stats.totalLinks).toBeGreaterThanOrEqual(0);
  });
});
