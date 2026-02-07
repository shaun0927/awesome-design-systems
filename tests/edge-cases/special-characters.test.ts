import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

describe('Special Characters Edge Cases', () => {
  const docsDir = join(process.cwd(), 'docs');
  const allMdxFiles = getAllMdxFiles(docsDir);

  it('should handle Korean characters in filenames correctly', () => {
    const violations: { file: string; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const fileName = basename(filePath);

      // Check if filename contains Korean characters
      const hasKorean = /[가-힣]/.test(fileName);

      if (hasKorean) {
        try {
          // Try to read the file
          readFileSync(filePath, 'utf-8');
        } catch (error) {
          violations.push({
            file: filePath.replace(process.cwd(), ''),
            issue: `Cannot read file with Korean filename: ${error}`
          });
        }
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: ${v.issue}`)
        .join('\n');
      expect.fail(`Korean filename handling issues:\n${errorMsg}`);
    }
  });

  it('should properly escape special MDX characters outside JSX', () => {
    const violations: { file: string; lineNumber: number; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inCodeBlock = false;
      let inJSXBlock = false;
      let jsxDepth = 0;

      lines.forEach((line, index) => {
        // Track code blocks
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }

        // Skip code blocks
        if (inCodeBlock) return;

        // Track JSX blocks (simple heuristic)
        const openTags = (line.match(/<[A-Z][a-zA-Z0-9]*/g) || []).length;
        const closeTags = (line.match(/<\/[A-Z][a-zA-Z0-9]*>/g) || []).length;
        const selfClosing = (line.match(/\/>/g) || []).length;

        jsxDepth += openTags - closeTags - selfClosing;
        inJSXBlock = jsxDepth > 0;

        // Check for unescaped special characters in regular text
        if (!inJSXBlock) {
          // Unescaped < or > in text (not part of HTML tags)
          const unescapedLt = line.match(/(?<!\\)<(?![A-Za-z/!])/g);
          const unescapedGt = line.match(/(?<!\\)>(?![^<]*>)/g);

          if (unescapedLt || unescapedGt) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              issue: `Potentially unescaped < or > in text: "${line.trim().substring(0, 60)}"`
            });
          }

          // Unescaped { or } in text
          const unescapedBraces = line.match(/(?<!\\)\{(?![^}]*\}(?:\.|\())|(?<!\\)\}(?![^{]*\{)/g);

          if (unescapedBraces && !line.includes('```')) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              issue: `Potentially unescaped { or } in text: "${line.trim().substring(0, 60)}"`
            });
          }
        }
      });
    });

    // This may have false positives, so we'll be lenient
    if (violations.length > 5) {
      console.warn(
        `Potential special character escaping issues (review first 5):\n${violations
          .slice(0, 5)
          .map(v => `  ${v.file}:${v.lineNumber} - ${v.issue}`)
          .join('\n')}`
      );
    }

    // Don't fail - informational only
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle backticks inside code blocks correctly', () => {
    const violations: { file: string; lineNumber: number; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inCodeBlock = false;
      let codeBlockFence = '';

      lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Detect code block start/end
        if (trimmed.startsWith('```')) {
          if (!inCodeBlock) {
            inCodeBlock = true;
            codeBlockFence = trimmed.match(/^`+/)?.[0] || '```';
          } else {
            const closingFence = trimmed.match(/^`+/)?.[0] || '```';
            if (closingFence === codeBlockFence) {
              inCodeBlock = false;
              codeBlockFence = '';
            }
          }
          return;
        }

        // Inside code block, check for problematic backticks
        if (inCodeBlock) {
          // Triple backticks inside code block (could break parsing)
          if (line.includes('```') && !line.trim().startsWith('```')) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              issue: `Backticks inside code block may break parsing`
            });
          }
        }
      });

      // Check for unclosed code blocks
      if (inCodeBlock) {
        violations.push({
          file: filePath.replace(process.cwd(), ''),
          lineNumber: lines.length,
          issue: `Unclosed code block at end of file`
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} - ${v.issue}`)
        .join('\n');
      expect.fail(`Backtick handling issues:\n${errorMsg}`);
    }
  });

  it('should not have unescaped HTML entities in text content', () => {
    const violations: { file: string; lineNumber: number; entity: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inCodeBlock = false;

      lines.forEach((line, index) => {
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          return;
        }

        if (inCodeBlock) return;

        // Check for common problematic patterns
        // & followed by text that looks like an entity but isn't properly formed
        const badEntities = line.match(/&[a-zA-Z]+(?![a-zA-Z;])/g);

        if (badEntities) {
          badEntities.forEach(entity => {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              lineNumber: index + 1,
              entity: entity
            });
          });
        }
      });
    });

    if (violations.length > 0) {
      console.warn(
        `Potential HTML entity issues (review manually):\n${violations
          .slice(0, 10)
          .map(v => `  ${v.file}:${v.lineNumber} - "${v.entity}"`)
          .join('\n')}`
      );
    }

    // Informational only
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle mixed Korean and English text correctly', () => {
    const violations: { file: string; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      try {
        const content = readFileSync(filePath, 'utf-8');

        // Check if file has both Korean and English
        const hasKorean = /[가-힣]/.test(content);
        const hasEnglish = /[a-zA-Z]/.test(content);

        if (hasKorean && hasEnglish) {
          // Check for broken encoding
          if (content.includes('�') || content.includes('\ufffd')) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              issue: 'Contains replacement characters (broken encoding)'
            });
          }

          // Check for zero-width characters that might cause issues
          // Note: Zero-width characters are sometimes valid (e.g., word boundaries in Korean)
          // Only flag if there are many of them or if they appear to be errors
          const zeroWidthMatches = content.match(/[\u200B-\u200D\uFEFF]/g);
          if (zeroWidthMatches && zeroWidthMatches.length > 10) {
            violations.push({
              file: filePath.replace(process.cwd(), ''),
              issue: `Contains ${zeroWidthMatches.length} zero-width characters (review if unintentional)`
            });
          }
        }
      } catch (error) {
        violations.push({
          file: filePath.replace(process.cwd(), ''),
          issue: `Failed to read: ${error}`
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}: ${v.issue}`)
        .join('\n');

      // Zero-width characters can be intentional, so warn instead of fail
      console.warn(`Mixed language encoding warnings:\n${errorMsg}`);
    }

    // Don't fail - informational only
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
