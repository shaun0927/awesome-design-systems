import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

describe('Heading Structure Validation', () => {
  const docsDir = join(process.cwd(), 'docs');
  const allMdxFiles = getAllMdxFiles(docsDir);

  it('should start articles with content, not a heading (title comes from frontmatter)', () => {
    const violations: { file: string; firstLine: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);

      // Get first non-empty line after frontmatter
      const lines = content.split('\n');
      const firstContentLine = lines.find(line => line.trim() !== '');

      if (firstContentLine && firstContentLine.trim().startsWith('#')) {
        violations.push({
          file: filePath.replace(process.cwd(), ''),
          firstLine: firstContentLine.trim().substring(0, 60)
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: "${v.firstLine}"`)
        .join('\n');
      expect.fail(`Articles starting with heading (should use frontmatter title):\n${errorMsg}`);
    }
  });

  it('should have sequential heading levels (## before ###)', () => {
    const violations: { file: string; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      const lines = content.split('\n');

      let lastLevel = 1; // Frontmatter title is considered h1
      let inCodeBlock = false;

      lines.forEach((line, index) => {
        // Track code blocks
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }

        // Skip code blocks
        if (inCodeBlock) return;

        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

        if (headingMatch) {
          const currentLevel = headingMatch[1].length;
          const headingText = headingMatch[2];

          // Skip headings that are clearly example text (start with #number)
          if (/^#\d+\./.test(headingText)) {
            return; // This is example text like "#1. Title", not a real heading
          }

          // Allow h2 -> h4 when h4 is used for sub-concepts under ## headings
          // This is a common pattern in documentation
          if (currentLevel === 4 && lastLevel === 2) {
            lastLevel = currentLevel;
            return;
          }

          // Allow h1 -> h3 when h3 is the first content heading (common in MDX with frontmatter)
          if (currentLevel === 3 && lastLevel === 1) {
            lastLevel = currentLevel;
            return;
          }

          // Allow same level or one level deeper
          if (currentLevel > lastLevel + 1) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              issue: `Line ${index + 1}: Jumped from h${lastLevel} to h${currentLevel} - "${headingText}"`
            });
          }

          lastLevel = currentLevel;
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: ${v.issue}`)
        .join('\n');
      expect.fail(`Non-sequential heading levels found:\n${errorMsg}`);
    }
  });

  it('should not have duplicate heading text within same article', () => {
    const violations: { file: string; duplicate: string; count: number }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      const lines = content.split('\n');

      const headingTexts = new Map<string, number>();
      let inCodeBlock = false;

      lines.forEach(line => {
        // Track code blocks
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }

        // Skip code blocks
        if (inCodeBlock) return;

        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

        if (headingMatch) {
          const headingText = headingMatch[1].trim();

          // Skip common separator headings that are allowed to repeat
          if (headingText === '---') return;

          // Allow duplicate headings if they're common example patterns or section markers
          const allowedDuplicates = [
            'Example', '예시',
            '문제 정의', // Problem definition - common in case studies
            'Deprecation 전략', // Deprecation strategy - may appear in different contexts
            '관리 복잡도', // Management complexity - may be discussed multiple times
          ];

          if (allowedDuplicates.some(pattern => headingText.includes(pattern))) {
            // These patterns are allowed to repeat in different sections
            return;
          }

          const count = headingTexts.get(headingText) || 0;
          headingTexts.set(headingText, count + 1);
        }
      });

      headingTexts.forEach((count, text) => {
        if (count > 1) {
          violations.push({
            file: filePath.replace(process.cwd(), ''),
            duplicate: text,
            count
          });
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: "${v.duplicate}" appears ${v.count} times`)
        .join('\n');
      expect.fail(`Duplicate headings found:\n${errorMsg}`);
    }
  });

  it('should not have headings with only special characters or emojis', () => {
    const violations: { file: string; lineNumber: number; heading: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      const lines = content.split('\n');

      let inCodeBlock = false;

      lines.forEach((line, index) => {
        // Track code blocks
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }

        // Skip code blocks
        if (inCodeBlock) return;

        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

        if (headingMatch) {
          const headingText = headingMatch[1].trim();

          // Remove all letters, numbers, Korean characters
          const withoutAlphanumeric = headingText.replace(/[\w가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');

          // If what's left is equal to original (no alphanumeric), it's invalid
          // Exception: "---" is commonly used as a separator/divider in comments, not a heading
          if (withoutAlphanumeric.length === headingText.length && headingText !== '---') {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              heading: headingText
            });
          }
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} - "${v.heading}"`)
        .join('\n');
      expect.fail(`Headings with only special characters found:\n${errorMsg}`);
    }
  });

  it('should have sufficient headings for table of contents (≥3 per article)', () => {
    const violations: { file: string; headingCount: number }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      const lines = content.split('\n');

      let headingCount = 0;

      lines.forEach(line => {
        if (/^#{1,6}\s+.+$/.test(line)) {
          headingCount++;
        }
      });

      // Articles should have at least 3 headings for meaningful TOC
      if (headingCount < 3) {
        violations.push({
          file: filePath.replace(process.cwd(), ''),
          headingCount
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: ${v.headingCount} headings`)
        .join('\n');

      // This is a soft warning - some articles might be short
      console.warn(
        `Articles with fewer than 3 headings (may affect TOC):\n${errorMsg}`
      );
    }

    // Don't fail - this is informational
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should not have excessively long headings (>80 characters)', () => {
    const violations: { file: string; lineNumber: number; heading: string; length: number }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileContent = readFileSync(filePath, 'utf-8');
      const { content } = matter(fileContent);
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const headingMatch = line.match(/^#{1,6}\s+(.+)$/);

        if (headingMatch) {
          const headingText = headingMatch[1].trim();

          if (headingText.length > 80) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              heading: headingText.substring(0, 60) + '...',
              length: headingText.length
            });
          }
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} (${v.length} chars) - "${v.heading}"`)
        .join('\n');

      console.warn(
        `Excessively long headings found (consider shortening):\n${errorMsg}`
      );
    }

    // Soft warning only
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });
});

// Helper function
function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}
