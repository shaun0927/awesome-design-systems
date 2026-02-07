import { describe, it, expect } from 'vitest';
import { getAllMDXFiles, hasSection, hasComponent, getFirstNLines } from '../utils/mdx-parser';

describe('Required Sections Validation', () => {
  it('should have "참고 자료" section in all MDX files', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (!hasSection(file.content, '참고 자료')) {
        errors.push(`${file.relativePath}: Missing "## 참고 자료" section`);
      }
    }

    if (errors.length > 0) {
      console.error('Missing 참고 자료 section:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have CrossRef component import and usage in all MDX files', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const hasCrossRef = hasComponent(file.content, 'CrossRef');

      if (!hasCrossRef) {
        errors.push(`${file.relativePath}: Missing CrossRef component import or usage`);
      }
    }

    if (errors.length > 0) {
      console.error('Missing CrossRef component:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have DevQuickStart component in first 20 lines of all MDX files', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const firstLines = getFirstNLines(file.content, 20);
      const hasDevQuickStart = hasComponent(firstLines, 'DevQuickStart');

      if (!hasDevQuickStart) {
        errors.push(`${file.relativePath}: Missing DevQuickStart component in first 20 lines`);
      }
    }

    if (errors.length > 0) {
      console.error('Missing DevQuickStart component:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have valid component imports with @site prefix', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const importLines = file.content.split('\n').filter(line =>
        line.trim().startsWith('import') &&
        (line.includes('CrossRef') || line.includes('DevQuickStart'))
      );

      for (const line of importLines) {
        if (!line.includes('@site/')) {
          errors.push(`${file.relativePath}: Import should use @site/ prefix: ${line.trim()}`);
        }
      }
    }

    if (errors.length > 0) {
      console.error('Invalid import paths:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have at least one heading section besides frontmatter', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const headings = file.content.match(/^##\s+.+/gm);

      if (!headings || headings.length === 0) {
        errors.push(`${file.relativePath}: No heading sections found (## headings)`);
      }
    }

    if (errors.length > 0) {
      console.error('Missing heading sections:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });
});
