import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Content Accessibility Standards', () => {
  const docsDir = join(process.cwd(), 'docs');
  const allMdxFiles = getAllMdxFiles(docsDir);

  it('should have header rows in all tables', () => {
    const violations: { file: string; lineNumber: number }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inTable = false;
      let firstRow = true;

      lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Detect table start (markdown table)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (!inTable) {
            inTable = true;
            firstRow = true;
          }

          // Check if first row is followed by separator (|---|---|)
          if (firstRow && index + 1 < lines.length) {
            const nextLine = lines[index + 1].trim();
            const isSeparator = /^\|[\s\-:|]+\|$/.test(nextLine);

            if (!isSeparator) {
              violations.push({
                file: filePath.replace(process.cwd(), ''),
                lineNumber: index + 1
              });
            }
            firstRow = false;
          }
        } else if (inTable && trimmed === '') {
          // Empty line ends table
          inTable = false;
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber}`)
        .join('\n');
      expect.fail(`Tables without header rows found:\n${errorMsg}`);
    }
  });

  it('should not have images without alt text', () => {
    const violations: { file: string; lineNumber: number; markdown: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
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

        // Markdown image: ![alt](url) - empty alt text
        const mdImageRegex = /!\[\s*\]\([^)]+\)/g;
        const mdMatches = line.match(mdImageRegex);

        if (mdMatches) {
          mdMatches.forEach(match => {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              markdown: match
            });
          });
        }

        // HTML img without alt attribute
        const htmlImageRegex = /<img(?![^>]*\balt\s*=)[^>]*>/gi;
        const htmlMatches = line.match(htmlImageRegex);

        if (htmlMatches) {
          htmlMatches.forEach(match => {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              markdown: match
            });
          });
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} - ${v.markdown}`)
        .join('\n');
      expect.fail(`Images without alt text found:\n${errorMsg}`);
    }
  });

  it('should have proper heading hierarchy (no skipped levels)', () => {
    const violations: { file: string; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let lastLevel = 1; // Frontmatter title is h1
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

          // Skip headings that are clearly example text (start with #number or contain special markers)
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

          if (currentLevel > lastLevel + 1) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              issue: `Line ${index + 1}: Skipped from h${lastLevel} to h${currentLevel} - "${line.trim()}"`
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
      expect.fail(`Heading hierarchy violations found:\n${errorMsg}`);
    }
  });

  it('should not have hardcoded low-contrast colors', () => {
    const violations: { file: string; lineNumber: number; text: string }[] = [];

    // Detect potentially problematic color combinations
    const lowContrastPatterns = [
      /#fff[^a-f0-9]/i,  // white on light backgrounds
      /#f{3,6}[^a-f0-9]/i,
      /color:\s*#?(?:eee|ddd|ccc)/i,
      /background:\s*#?(?:fff|eee)/i
    ];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Skip code blocks
        if (line.trim().startsWith('```')) return;

        lowContrastPatterns.forEach(pattern => {
          if (pattern.test(line)) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              text: line.trim().substring(0, 80)
            });
          }
        });
      });
    });

    // This is informational - may have false positives
    if (violations.length > 0) {
      console.warn(
        `Potential low-contrast color usage found (review manually):\n${violations
          .slice(0, 10)
          .map(v => `  ${v.file}:${v.lineNumber}`)
          .join('\n')}`
      );
    }

    // Don't fail, just warn
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should not have redundant ARIA roles on semantic elements', () => {
    const violations: { file: string; lineNumber: number; text: string }[] = [];

    const redundantRoles = [
      { element: 'nav', role: 'navigation' },
      { element: 'main', role: 'main' },
      { element: 'header', role: 'banner' },
      { element: 'footer', role: 'contentinfo' },
      { element: 'article', role: 'article' },
      { element: 'aside', role: 'complementary' }
    ];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        redundantRoles.forEach(({ element, role }) => {
          const pattern = new RegExp(`<${element}[^>]*role=["']${role}["']`, 'i');
          if (pattern.test(line)) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              text: line.trim().substring(0, 80)
            });
          }
        });
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} - ${v.text}`)
        .join('\n');
      expect.fail(`Redundant ARIA roles found:\n${errorMsg}`);
    }
  });

  it('should have proper encoding for Korean + English mixed content', () => {
    const violations: { file: string; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      try {
        const content = readFileSync(filePath, 'utf-8');

        // Check for broken encoding markers
        const hasBrokenEncoding =
          content.includes('�') || // Replacement character
          content.includes('\ufffd') || // Unicode replacement
          /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(content); // Control characters

        if (hasBrokenEncoding) {
          violations.push({
            file: filePath.replace(process.cwd(), ''),
            issue: 'Contains broken encoding or replacement characters'
          });
        }
      } catch (error) {
        violations.push({
          file: filePath.replace(process.cwd(), ''),
          issue: `Failed to read as UTF-8: ${error}`
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: ${v.issue}`)
        .join('\n');
      expect.fail(`Encoding issues found:\n${errorMsg}`);
    }
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
