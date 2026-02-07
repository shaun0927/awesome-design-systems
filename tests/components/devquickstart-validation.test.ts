import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');

interface DevQuickStartMatch {
  file: string;
  props: {
    what?: string;
    learn?: string;
    able?: string;
  };
  lineNumber: number;
}

function getAllMdxFiles(): string[] {
  const files: string[] = [];

  function traverse(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  traverse(DOCS_DIR);
  return files;
}

function extractDevQuickStarts(filePath: string): DevQuickStartMatch[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches: DevQuickStartMatch[] = [];

  // Match DevQuickStart component with props (including multiline)
  const devQuickStartRegex = /<DevQuickStart\s+([\s\S]*?)\/>/g;
  let match;

  while ((match = devQuickStartRegex.exec(content)) !== null) {
    const propsStr = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Extract individual props - handle double quotes (most common)
    // Match pattern: prop="value" where value can contain escaped quotes or apostrophes
    const whatMatch = propsStr.match(/what="([^"]*(?:(?:\\'|')[^"]*)*)"/s) || propsStr.match(/what=\{`([^`]*?)`\}/s);
    const learnMatch = propsStr.match(/learn="([^"]*(?:(?:\\'|')[^"]*)*)"/s) || propsStr.match(/learn=\{`([^`]*?)`\}/s);
    const ableMatch = propsStr.match(/able="([^"]*(?:(?:\\'|')[^"]*)*)"/s) || propsStr.match(/able=\{`([^`]*?)`\}/s);

    matches.push({
      file: filePath,
      props: {
        what: whatMatch ? whatMatch[1].trim() : undefined,
        learn: learnMatch ? learnMatch[1].trim() : undefined,
        able: ableMatch ? ableMatch[1].trim() : undefined,
      },
      lineNumber,
    });
  }

  return matches;
}

describe('DevQuickStart Component Validation', () => {
  const allFiles = getAllMdxFiles();

  it('should find at least some MDX files', () => {
    expect(allFiles.length).toBeGreaterThan(0);
    expect(allFiles.length).toBe(76);
  });

  describe('DevQuickStart Usage Validation', () => {
    const allDevQuickStarts: DevQuickStartMatch[] = [];

    allFiles.forEach((file) => {
      const devQuickStarts = extractDevQuickStarts(file);
      allDevQuickStarts.push(...devQuickStarts);
    });

    it('should find DevQuickStart components in the codebase', () => {
      expect(allDevQuickStarts.length).toBeGreaterThan(0);
    });

    describe('Required Props Validation', () => {
      allDevQuickStarts.forEach((dqs) => {
        const fileName = path.relative(process.cwd(), dqs.file);

        it(`${fileName}:${dqs.lineNumber} - should have all three required props`, () => {
          expect(dqs.props.what, `Missing 'what' prop in ${fileName}:${dqs.lineNumber}`).toBeDefined();
          expect(dqs.props.learn, `Missing 'learn' prop in ${fileName}:${dqs.lineNumber}`).toBeDefined();
          expect(dqs.props.able, `Missing 'able' prop in ${fileName}:${dqs.lineNumber}`).toBeDefined();
        });

        it(`${fileName}:${dqs.lineNumber} - props should not be empty strings`, () => {
          if (dqs.props.what !== undefined) {
            expect(dqs.props.what.trim().length, `'what' prop is empty in ${fileName}:${dqs.lineNumber}`).toBeGreaterThan(0);
          }
          if (dqs.props.learn !== undefined) {
            expect(dqs.props.learn.trim().length, `'learn' prop is empty in ${fileName}:${dqs.lineNumber}`).toBeGreaterThan(0);
          }
          if (dqs.props.able !== undefined) {
            expect(dqs.props.able.trim().length, `'able' prop is empty in ${fileName}:${dqs.lineNumber}`).toBeGreaterThan(0);
          }
        });
      });
    });

    describe('Content Quality Validation', () => {
      allDevQuickStarts.forEach((dqs) => {
        const fileName = path.relative(process.cwd(), dqs.file);

        it(`${fileName}:${dqs.lineNumber} - 'what' prop should be concise (under 250 chars)`, () => {
          if (dqs.props.what) {
            expect(dqs.props.what.length, `'what' prop too long (${dqs.props.what.length} chars) in ${fileName}:${dqs.lineNumber}`).toBeLessThanOrEqual(250);
          }
        });

        it(`${fileName}:${dqs.lineNumber} - 'learn' should describe specific learnable items`, () => {
          if (dqs.props.learn) {
            // Should be reasonably detailed (at least 15 chars)
            expect(dqs.props.learn.length, `'learn' prop too short in ${fileName}:${dqs.lineNumber}`).toBeGreaterThanOrEqual(15);

            // Should not be just placeholder text
            const placeholders = ['todo', 'tbd', 'coming soon', 'placeholder'];
            const hasPlaceholder = placeholders.some(p => dqs.props.learn!.toLowerCase().includes(p));
            expect(hasPlaceholder, `'learn' prop contains placeholder text in ${fileName}:${dqs.lineNumber}`).toBe(false);
          }
        });

        it(`${fileName}:${dqs.lineNumber} - 'able' should describe a concrete outcome`, () => {
          if (dqs.props.able) {
            // Should be reasonably detailed (at least 15 chars)
            expect(dqs.props.able.length, `'able' prop too short in ${fileName}:${dqs.lineNumber}`).toBeGreaterThanOrEqual(15);

            // Should not be just placeholder text
            const placeholders = ['todo', 'tbd', 'coming soon', 'placeholder'];
            const hasPlaceholder = placeholders.some(p => dqs.props.able!.toLowerCase().includes(p));
            expect(hasPlaceholder, `'able' prop contains placeholder text in ${fileName}:${dqs.lineNumber}`).toBe(false);
          }
        });
      });
    });

    describe('Edge Cases', () => {
      it('should detect DevQuickStart with missing props', () => {
        const missingProps = allDevQuickStarts.filter(dqs =>
          !dqs.props.what || !dqs.props.learn || !dqs.props.able
        );

        if (missingProps.length > 0) {
          console.warn(`Found ${missingProps.length} DevQuickStart components with missing props`);
          missingProps.forEach(dqs => {
            const fileName = path.relative(process.cwd(), dqs.file);
            console.warn(`  - ${fileName}:${dqs.lineNumber}`);
          });
        }

        // All should have required props
        expect(missingProps.length).toBe(0);
      });

      it('should detect suspiciously short content', () => {
        allDevQuickStarts.forEach((dqs) => {
          const fileName = path.relative(process.cwd(), dqs.file);

          if (dqs.props.what && dqs.props.what.length < 30) {
            console.warn(`Suspiciously short 'what' prop in ${fileName}:${dqs.lineNumber}: "${dqs.props.what}"`);
          }
          if (dqs.props.learn && dqs.props.learn.length < 20) {
            console.warn(`Suspiciously short 'learn' prop in ${fileName}:${dqs.lineNumber}: "${dqs.props.learn}"`);
          }
          if (dqs.props.able && dqs.props.able.length < 20) {
            console.warn(`Suspiciously short 'able' prop in ${fileName}:${dqs.lineNumber}: "${dqs.props.able}"`);
          }
        });
      });

      it('should detect props with HTML entities or special characters', () => {
        allDevQuickStarts.forEach((dqs) => {
          const fileName = path.relative(process.cwd(), dqs.file);

          ['what', 'learn', 'able'].forEach((propName) => {
            const propValue = dqs.props[propName as keyof typeof dqs.props];
            if (propValue) {
              // Check for unescaped HTML entities
              const hasHtmlEntities = /&[a-z]+;/i.test(propValue);
              if (hasHtmlEntities) {
                console.warn(`HTML entities found in '${propName}' prop in ${fileName}:${dqs.lineNumber}`);
              }

              // Check for unescaped quotes that might break the component
              const hasUnescapedQuotes = /(?<!\\)["']/.test(propValue);
              if (hasUnescapedQuotes && !propValue.includes('\\')) {
                // Only warn if it's not a template literal
                console.warn(`Unescaped quotes in '${propName}' prop in ${fileName}:${dqs.lineNumber}`);
              }
            }
          });
        });
      });
    });
  });

  describe('Import Statement Validation', () => {
    allFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasDevQuickStart = content.includes('<DevQuickStart');
      const hasImport = content.match(/import\s+DevQuickStart\s+from\s+['"]@site\/src\/components\/DevQuickStart['"]/);

      if (hasDevQuickStart || hasImport) {
        const fileName = path.relative(process.cwd(), file);

        it(`${fileName} - should import DevQuickStart if used`, () => {
          if (hasDevQuickStart) {
            expect(hasImport, `DevQuickStart used but not imported in ${fileName}`).toBeTruthy();
          }
        });

        it(`${fileName} - should use DevQuickStart if imported`, () => {
          if (hasImport) {
            expect(hasDevQuickStart, `DevQuickStart imported but not used in ${fileName}`).toBeTruthy();
          }
        });

        it(`${fileName} - should use correct import path`, () => {
          if (hasImport) {
            const importPath = hasImport[0];
            expect(importPath).toContain('@site/src/components/DevQuickStart');
          }
        });
      }
    });
  });

  describe('Placement Validation', () => {
    allFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const devQuickStarts = extractDevQuickStarts(file);

      if (devQuickStarts.length > 0) {
        const fileName = path.relative(process.cwd(), file);

        it(`${fileName} - should have only one DevQuickStart per file`, () => {
          expect(devQuickStarts.length, `Multiple DevQuickStart components in ${fileName}`).toBeLessThanOrEqual(1);
        });

        it(`${fileName} - DevQuickStart should appear near the top of the content`, () => {
          const firstDevQuickStart = devQuickStarts[0];
          // Should appear within the first 30 lines (after frontmatter and imports)
          expect(firstDevQuickStart.lineNumber, `DevQuickStart appears too late in ${fileName} (line ${firstDevQuickStart.lineNumber})`).toBeLessThanOrEqual(30);
        });
      }
    });
  });
});
