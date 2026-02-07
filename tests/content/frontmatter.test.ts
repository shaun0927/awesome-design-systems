import { describe, it, expect } from 'vitest';
import { getAllMDXFiles } from '../utils/mdx-parser';

describe('Frontmatter Validation', () => {
  it('should have valid frontmatter in all MDX files', async () => {
    const files = await getAllMDXFiles();
    expect(files.length).toBeGreaterThan(0);

    const errors: string[] = [];

    for (const file of files) {
      const { frontmatter, relativePath } = file;

      // Check required fields
      if (!frontmatter.title) {
        errors.push(`${relativePath}: Missing 'title' field`);
      }

      if (!frontmatter.sidebar_label) {
        errors.push(`${relativePath}: Missing 'sidebar_label' field`);
      }

      if (!frontmatter.tags) {
        errors.push(`${relativePath}: Missing 'tags' field`);
      }

      // Validate field types
      if (frontmatter.title && typeof frontmatter.title !== 'string') {
        errors.push(`${relativePath}: 'title' must be a string`);
      }

      if (frontmatter.title && frontmatter.title.trim() === '') {
        errors.push(`${relativePath}: 'title' cannot be empty`);
      }

      if (frontmatter.tags && !Array.isArray(frontmatter.tags)) {
        errors.push(`${relativePath}: 'tags' must be an array, got ${typeof frontmatter.tags}`);
      }

      if (frontmatter.tags && Array.isArray(frontmatter.tags) && frontmatter.tags.length === 0) {
        errors.push(`${relativePath}: 'tags' array must have at least 1 item`);
      }

      if (frontmatter.sidebar_position !== undefined && typeof frontmatter.sidebar_position !== 'number') {
        errors.push(`${relativePath}: 'sidebar_position' must be a number if present`);
      }
    }

    if (errors.length > 0) {
      console.error('Frontmatter validation errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have duplicate titles within the same category', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    // Group files by category
    const categorized = files.reduce((acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file);
      return acc;
    }, {} as Record<string, typeof files>);

    // Check for duplicates within each category
    for (const [category, categoryFiles] of Object.entries(categorized)) {
      const titles = new Map<string, string[]>();

      for (const file of categoryFiles) {
        const title = file.frontmatter.title;
        if (!title) continue;

        const normalizedTitle = title.toLowerCase().trim();
        if (!titles.has(normalizedTitle)) {
          titles.set(normalizedTitle, []);
        }
        titles.get(normalizedTitle)!.push(file.relativePath);
      }

      // Report duplicates
      for (const [title, paths] of titles.entries()) {
        if (paths.length > 1) {
          errors.push(`Category '${category}' has duplicate title '${title}' in files: ${paths.join(', ')}`);
        }
      }
    }

    if (errors.length > 0) {
      console.error('Duplicate title errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have consistent tag formatting', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const { frontmatter, relativePath } = file;

      if (!frontmatter.tags || !Array.isArray(frontmatter.tags)) continue;

      for (const tag of frontmatter.tags) {
        if (typeof tag !== 'string') {
          errors.push(`${relativePath}: Tag must be a string, got ${typeof tag}`);
        }

        if (typeof tag === 'string' && tag.trim() === '') {
          errors.push(`${relativePath}: Tag cannot be empty string`);
        }
      }
    }

    if (errors.length > 0) {
      console.error('Tag formatting errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have sidebar_label that is not empty', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const { frontmatter, relativePath } = file;

      if (frontmatter.sidebar_label && typeof frontmatter.sidebar_label === 'string') {
        if (frontmatter.sidebar_label.trim() === '') {
          errors.push(`${relativePath}: 'sidebar_label' cannot be empty`);
        }
      }
    }

    if (errors.length > 0) {
      console.error('Sidebar label errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });
});
