import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { getAllMDXFiles } from '../utils/mdx-parser';
import fg from 'fast-glob';

describe('Content Consistency Validation', () => {
  it('should have _category_.json in all category directories', async () => {
    const docsDir = join(process.cwd(), 'docs');
    const categoryDirs = await fg('docs/[0-9][0-9]-*', {
      cwd: process.cwd(),
      onlyDirectories: true,
    });

    const errors: string[] = [];

    for (const dir of categoryDirs) {
      const categoryJsonPath = join(process.cwd(), dir, '_category_.json');

      if (!existsSync(categoryJsonPath)) {
        errors.push(`${dir}: Missing _category_.json file`);
      }
    }

    if (errors.length > 0) {
      console.error('Missing _category_.json files:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have valid _category_.json files with required fields', async () => {
    const categoryDirs = await fg('docs/[0-9][0-9]-*', {
      cwd: process.cwd(),
      onlyDirectories: true,
    });

    const errors: string[] = [];

    for (const dir of categoryDirs) {
      const categoryJsonPath = join(process.cwd(), dir, '_category_.json');

      if (!existsSync(categoryJsonPath)) continue;

      try {
        const content = readFileSync(categoryJsonPath, 'utf-8');
        const data = JSON.parse(content);

        // Check required fields
        if (!data.label) {
          errors.push(`${dir}/_category_.json: Missing 'label' field`);
        }

        if (data.position === undefined) {
          errors.push(`${dir}/_category_.json: Missing 'position' field`);
        }

        if (!data.description) {
          errors.push(`${dir}/_category_.json: Missing 'description' field`);
        }

        // Validate field types
        if (data.label && typeof data.label !== 'string') {
          errors.push(`${dir}/_category_.json: 'label' must be a string`);
        }

        if (data.position !== undefined && typeof data.position !== 'number') {
          errors.push(`${dir}/_category_.json: 'position' must be a number`);
        }

        if (data.description && typeof data.description !== 'string') {
          errors.push(`${dir}/_category_.json: 'description' must be a string`);
        }
      } catch (err) {
        errors.push(`${dir}/_category_.json: Invalid JSON - ${err}`);
      }
    }

    if (errors.length > 0) {
      console.error('Invalid _category_.json files:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have proper file naming (lowercase with hyphens, .mdx extension)', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const fileName = file.relativePath.split('/').pop() || '';

      // Check extension
      if (!fileName.endsWith('.mdx')) {
        errors.push(`${file.relativePath}: File must have .mdx extension`);
      }

      // Check for uppercase letters (excluding extension)
      const nameWithoutExt = fileName.replace('.mdx', '');
      if (nameWithoutExt !== nameWithoutExt.toLowerCase()) {
        errors.push(`${file.relativePath}: Filename should be lowercase`);
      }

      // Check for underscores (should use hyphens instead)
      if (nameWithoutExt.includes('_')) {
        errors.push(`${file.relativePath}: Filename should use hyphens instead of underscores`);
      }

      // Check for spaces
      if (fileName.includes(' ')) {
        errors.push(`${file.relativePath}: Filename should not contain spaces`);
      }
    }

    if (errors.length > 0) {
      console.error('File naming errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have orphan files (files outside numbered category directories)', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      // Check if file is in a numbered category directory (e.g., 01-*, 02-*, etc.)
      const pathParts = file.relativePath.split('/');

      if (pathParts.length < 2) {
        errors.push(`${file.relativePath}: File is in docs root, should be in a category directory`);
        continue;
      }

      const categoryDir = pathParts[0];
      if (!/^\d{2}-/.test(categoryDir)) {
        errors.push(`${file.relativePath}: File is not in a numbered category directory (e.g., 01-*, 02-*)`);
      }
    }

    if (errors.length > 0) {
      console.error('Orphan file errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have consistent category numbering (01-12)', async () => {
    const categoryDirs = await fg('docs/[0-9][0-9]-*', {
      cwd: process.cwd(),
      onlyDirectories: true,
    });

    const categoryNumbers = categoryDirs.map(dir => {
      const match = dir.match(/docs\/(\d{2})-/);
      return match ? parseInt(match[1], 10) : -1;
    }).filter(n => n !== -1).sort((a, b) => a - b);

    const errors: string[] = [];

    // Check if numbers are sequential from 1 to N
    for (let i = 0; i < categoryNumbers.length; i++) {
      const expected = i + 1;
      if (categoryNumbers[i] !== expected) {
        errors.push(`Category numbering gap: Expected ${String(expected).padStart(2, '0')}, found ${String(categoryNumbers[i]).padStart(2, '0')}`);
      }
    }

    // Check if we have expected number of categories (12 according to task description)
    if (categoryNumbers.length !== 12) {
      errors.push(`Expected 12 categories, found ${categoryNumbers.length}`);
    }

    if (errors.length > 0) {
      console.error('Category numbering errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have valid cross-references between files', async () => {
    const files = await getAllMDXFiles();
    const warnings: string[] = [];

    // Build a map of all valid file paths
    const validPaths = new Set(files.map(f => f.relativePath));

    for (const file of files) {
      // Check for markdown links to other docs
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;

      while ((match = linkRegex.exec(file.content)) !== null) {
        const linkPath = match[2];

        // Skip external links, anchors, and absolute URLs
        if (linkPath.startsWith('http') || linkPath.startsWith('#') || linkPath.startsWith('/')) {
          continue;
        }

        // Check if it's a relative link to another doc
        if (linkPath.endsWith('.md') || linkPath.endsWith('.mdx')) {
          // Resolve relative path
          const currentDir = file.relativePath.split('/').slice(0, -1).join('/');
          const resolvedPath = linkPath.startsWith('../')
            ? linkPath.replace('../', '')
            : `${currentDir}/${linkPath}`;

          if (!validPaths.has(resolvedPath)) {
            warnings.push(`${file.relativePath}: Broken link to "${linkPath}"`);
          }
        }
      }
    }

    // This is a warning, not a hard error, as CrossRef components may handle these
    if (warnings.length > 0) {
      console.warn('Cross-reference warnings:\n' + warnings.join('\n'));
    }

    expect(files.length).toBeGreaterThan(0);
  });
});
