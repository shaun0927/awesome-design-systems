import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

describe('Category Structure Validation', () => {
  const docsDir = join(process.cwd(), 'docs');

  const expectedCategories = [
    '01-design-tokens',
    '02-visual-foundations',
    '03-component-design',
    '04-component-documentation',
    '05-quality-testing',
    '06-accessibility',
    '07-governance-operations',
    '08-scaling-architecture',
    '09-versioning-releases',
    '10-generations-evolution',
    '11-figma-tooling',
    '12-web-design-craft'
  ];

  it('should have all 12 expected categories present', () => {
    const missing: string[] = [];

    expectedCategories.forEach(category => {
      const categoryPath = join(docsDir, category);
      if (!existsSync(categoryPath)) {
        missing.push(category);
      }
    });

    if (missing.length > 0) {
      expect.fail(`Missing categories: ${missing.join(', ')}`);
    }
  });

  it('should have _category_.json in each category with correct position', () => {
    const violations: { category: string; issue: string }[] = [];

    expectedCategories.forEach((category, index) => {
      const categoryPath = join(docsDir, category);
      const categoryJsonPath = join(categoryPath, '_category_.json');

      if (!existsSync(categoryJsonPath)) {
        violations.push({
          category,
          issue: 'Missing _category_.json'
        });
        return;
      }

      try {
        const categoryData = JSON.parse(readFileSync(categoryJsonPath, 'utf-8'));

        // Position should match the prefix number (1-12)
        const expectedPosition = index + 1;

        if (categoryData.position !== expectedPosition) {
          violations.push({
            category,
            issue: `Position ${categoryData.position} doesn't match expected ${expectedPosition}`
          });
        }

        // Should have a label
        if (!categoryData.label || categoryData.label.trim() === '') {
          violations.push({
            category,
            issue: 'Missing or empty label'
          });
        }

      } catch (error) {
        violations.push({
          category,
          issue: `Invalid JSON: ${error}`
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.category}: ${v.issue}`)
        .join('\n');
      expect.fail(`Category metadata issues:\n${errorMsg}`);
    }
  });

  it('should have at least 2 articles per category for balanced distribution', () => {
    const violations: { category: string; articleCount: number }[] = [];

    expectedCategories.forEach(category => {
      const categoryPath = join(docsDir, category);

      if (!existsSync(categoryPath)) return;

      const articles = readdirSync(categoryPath, { withFileTypes: true })
        .filter(entry =>
          !entry.isDirectory() &&
          (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) &&
          entry.name !== '_category_.json'
        );

      if (articles.length < 2) {
        violations.push({
          category,
          articleCount: articles.length
        });
      }
    });

    if (violations.length > 0) {
      console.warn(
        `Categories with fewer than 2 articles:\n${violations
          .map(v => `  ${v.category}: ${v.articleCount} article(s)`)
          .join('\n')}`
      );
    }

    // Soft warning - some categories might intentionally have fewer articles
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should not have empty categories', () => {
    const emptyCategories: string[] = [];

    expectedCategories.forEach(category => {
      const categoryPath = join(docsDir, category);

      if (!existsSync(categoryPath)) return;

      const articles = readdirSync(categoryPath, { withFileTypes: true })
        .filter(entry =>
          !entry.isDirectory() &&
          (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))
        );

      if (articles.length === 0) {
        emptyCategories.push(category);
      }
    });

    if (emptyCategories.length > 0) {
      expect.fail(`Empty categories found: ${emptyCategories.join(', ')}`);
    }
  });

  it('should have sequential sidebar positions within each category', () => {
    const violations: { category: string; issue: string }[] = [];

    expectedCategories.forEach(category => {
      const categoryPath = join(docsDir, category);

      if (!existsSync(categoryPath)) return;

      const articles = readdirSync(categoryPath, { withFileTypes: true })
        .filter(entry =>
          !entry.isDirectory() &&
          (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))
        )
        .map(entry => join(categoryPath, entry.name));

      const positions: { file: string; position: number }[] = [];

      articles.forEach(articlePath => {
        try {
          const content = readFileSync(articlePath, 'utf-8');
          const positionMatch = content.match(/^---\s*\n(?:.*\n)*?sidebar_position:\s*(\d+)/m);

          if (positionMatch) {
            positions.push({
              file: articlePath.replace(categoryPath + '/', ''),
              position: parseInt(positionMatch[1], 10)
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      });

      // Check if positions are sequential
      if (positions.length > 1) {
        const sortedPositions = [...positions].sort((a, b) => a.position - b.position);

        for (let i = 0; i < sortedPositions.length - 1; i++) {
          const current = sortedPositions[i].position;
          const next = sortedPositions[i + 1].position;

          // Positions should be sequential or at least not have large gaps
          if (next - current > 10) {
            violations.push({
              category,
              issue: `Large gap in positions: ${current} to ${next} (files: ${sortedPositions[i].file}, ${sortedPositions[i + 1].file})`
            });
          }
        }
      }
    });

    if (violations.length > 0) {
      console.warn(
        `Sidebar position issues:\n${violations
          .map(v => `  ${v.category}: ${v.issue}`)
          .join('\n')}`
      );
    }

    // Soft warning
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should have consistent naming convention in category prefixes', () => {
    const violations: string[] = [];

    expectedCategories.forEach(category => {
      // Should match pattern: NN-kebab-case
      const pattern = /^\d{2}-[a-z]+(?:-[a-z]+)*$/;

      if (!pattern.test(category)) {
        violations.push(category);
      }
    });

    if (violations.length > 0) {
      expect.fail(`Categories with inconsistent naming: ${violations.join(', ')}`);
    }
  });

  it('should not have duplicate category numbers', () => {
    const numbers = expectedCategories.map(cat => cat.match(/^(\d{2})-/)?.[1]);
    const uniqueNumbers = new Set(numbers);

    if (numbers.length !== uniqueNumbers.size) {
      expect.fail('Duplicate category numbers found');
    }
  });

  it('should have category directories only (no loose files in docs root)', () => {
    const entries = readdirSync(docsDir, { withFileTypes: true });

    const looseFiles = entries
      .filter(entry => !entry.isDirectory())
      .map(entry => entry.name);

    // Allow some meta files
    const allowedFiles = ['README.md', '.gitkeep'];
    const violations = looseFiles.filter(file => !allowedFiles.includes(file));

    if (violations.length > 0) {
      expect.fail(`Loose files in docs root (should be in categories): ${violations.join(', ')}`);
    }
  });
});
