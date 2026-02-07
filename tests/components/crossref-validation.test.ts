import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = path.join(process.cwd(), 'docs');

interface RelatedArticle {
  path: string;
  label: string;
}

interface CrossRefMatch {
  file: string;
  related: RelatedArticle[];
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

function extractCrossRefs(filePath: string): CrossRefMatch[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches: CrossRefMatch[] = [];

  // Match CrossRef component with related array
  const crossRefRegex = /<CrossRef\s+related=\{(\[[^\]]+\])\}\s*\/>/gs;
  let match;

  while ((match = crossRefRegex.exec(content)) !== null) {
    const relatedStr = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    try {
      // Parse the array (assuming it's valid JS object literal syntax)
      const related = eval(`(${relatedStr})`);
      matches.push({
        file: filePath,
        related,
        lineNumber,
      });
    } catch (e) {
      // Invalid syntax - will be caught by tests
      matches.push({
        file: filePath,
        related: [],
        lineNumber,
      });
    }
  }

  return matches;
}

function getDocPath(filePath: string): string {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const withoutExt = relativePath.replace(/\.mdx?$/, '');
  return `/docs/${withoutExt.replace(/\\/g, '/')}`;
}

function fileExistsForPath(docPath: string): boolean {
  // Convert /docs/category/slug to docs/XX-category/YY-slug.mdx
  // The path might be /docs/visual-foundations/color-system
  // But the file is docs/02-visual-foundations/01-color-system.mdx

  const relativePath = docPath.replace(/^\/docs\//, '');
  const pathParts = relativePath.split('/');

  // Try direct path first (exact match)
  const directMdx = path.join(DOCS_DIR, `${relativePath}.mdx`);
  const directMd = path.join(DOCS_DIR, `${relativePath}.md`);

  if (fs.existsSync(directMdx) || fs.existsSync(directMd)) {
    return true;
  }

  // Try to find file with number prefix (e.g., 01-color-system.mdx)
  // by searching in all subdirectories
  try {
    function findFileInDocs(dir: string, targetPath: string[]): boolean {
      if (targetPath.length === 0) return false;

      const entries = fs.readdirSync(dir, { withFileTypes: true });

      if (targetPath.length === 1) {
        // Looking for the file
        const targetFile = targetPath[0];
        return entries.some(entry => {
          if (entry.isFile()) {
            // Match files like "01-slug.mdx" for slug "slug"
            const nameWithoutExt = entry.name.replace(/\.(mdx|md)$/, '');
            const nameWithoutNumber = nameWithoutExt.replace(/^\d+-/, '');
            return nameWithoutNumber === targetFile || nameWithoutExt === targetFile;
          }
          return false;
        });
      } else {
        // Looking for a directory
        const targetDir = targetPath[0];
        const matchingDir = entries.find(entry => {
          if (entry.isDirectory()) {
            const nameWithoutNumber = entry.name.replace(/^\d+-/, '');
            return nameWithoutNumber === targetDir || entry.name === targetDir;
          }
          return false;
        });

        if (matchingDir) {
          return findFileInDocs(
            path.join(dir, matchingDir.name),
            targetPath.slice(1)
          );
        }
      }

      return false;
    }

    return findFileInDocs(DOCS_DIR, pathParts);
  } catch {
    return false;
  }
}

describe('CrossRef Component Validation', () => {
  const allFiles = getAllMdxFiles();

  it('should find at least some MDX files', () => {
    expect(allFiles.length).toBeGreaterThan(0);
    expect(allFiles.length).toBe(76);
  });

  describe('CrossRef Usage Validation', () => {
    const allCrossRefs: CrossRefMatch[] = [];

    allFiles.forEach((file) => {
      const crossRefs = extractCrossRefs(file);
      allCrossRefs.push(...crossRefs);
    });

    it('should find CrossRef components in the codebase', () => {
      expect(allCrossRefs.length).toBeGreaterThan(0);
    });

    describe('Path Validation', () => {
      allCrossRefs.forEach((crossRef) => {
        const fileName = path.relative(process.cwd(), crossRef.file);

        it(`${fileName}:${crossRef.lineNumber} - all paths should point to valid files`, () => {
          crossRef.related.forEach((article) => {
            const exists = fileExistsForPath(article.path);

            // Allow category pages (they're valid Docusaurus routes even if no file exists)
            const isCategoryPage = article.path.includes('/category/');

            if (!isCategoryPage) {
              expect(exists, `Path "${article.path}" does not exist (referenced in ${fileName}:${crossRef.lineNumber})`).toBe(true);
            } else if (!exists) {
              console.warn(`Category page link in ${fileName}:${crossRef.lineNumber}: "${article.path}" (no physical file, relies on Docusaurus auto-generation)`);
            }
          });
        });

        it(`${fileName}:${crossRef.lineNumber} - paths should use /docs/ prefix`, () => {
          crossRef.related.forEach((article) => {
            expect(article.path, `Path should start with /docs/ in ${fileName}:${crossRef.lineNumber}`).toMatch(/^\/docs\//);
          });
        });

        it(`${fileName}:${crossRef.lineNumber} - should have no duplicate paths`, () => {
          const paths = crossRef.related.map((a) => a.path);
          const uniquePaths = new Set(paths);
          expect(paths.length, `Duplicate paths found in ${fileName}:${crossRef.lineNumber}`).toBe(uniquePaths.size);
        });

        it(`${fileName}:${crossRef.lineNumber} - should have at least 2 related articles`, () => {
          expect(crossRef.related.length, `CrossRef should have at least 2 related articles in ${fileName}:${crossRef.lineNumber}`).toBeGreaterThanOrEqual(2);
        });

        it(`${fileName}:${crossRef.lineNumber} - should not self-reference`, () => {
          const currentDocPath = getDocPath(crossRef.file);
          const selfReferencing = crossRef.related.some((a) => a.path === currentDocPath);
          expect(selfReferencing, `Article self-referencing detected in ${fileName}:${crossRef.lineNumber}`).toBe(false);
        });

        it(`${fileName}:${crossRef.lineNumber} - labels should not be empty`, () => {
          crossRef.related.forEach((article) => {
            expect(article.label.trim().length, `Empty label found for path ${article.path} in ${fileName}:${crossRef.lineNumber}`).toBeGreaterThan(0);
          });
        });
      });
    });

    describe('Bidirectional Linking', () => {
      it('should have bidirectional links where possible', () => {
        const linkMap = new Map<string, Set<string>>();

        // Build link map
        allCrossRefs.forEach((crossRef) => {
          const fromPath = getDocPath(crossRef.file);
          if (!linkMap.has(fromPath)) {
            linkMap.set(fromPath, new Set());
          }
          crossRef.related.forEach((article) => {
            linkMap.get(fromPath)!.add(article.path);
          });
        });

        // Check bidirectionality
        const unidirectionalLinks: string[] = [];

        linkMap.forEach((targets, source) => {
          targets.forEach((target) => {
            const reverseLinks = linkMap.get(target);
            if (reverseLinks && !reverseLinks.has(source)) {
              unidirectionalLinks.push(`${source} → ${target} (no reverse link)`);
            }
          });
        });

        // This is a soft warning - not all links need to be bidirectional
        // but it's good practice for discoverability
        if (unidirectionalLinks.length > 0) {
          console.warn('Unidirectional links detected (consider adding reverse links):');
          console.warn(unidirectionalLinks.slice(0, 10).join('\n'));
        }
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty related arrays gracefully', () => {
        allCrossRefs.forEach((crossRef) => {
          if (crossRef.related.length === 0) {
            const fileName = path.relative(process.cwd(), crossRef.file);
            console.warn(`Empty CrossRef found in ${fileName}:${crossRef.lineNumber}`);
          }
        });
      });

      it('should detect malformed path formats', () => {
        allCrossRefs.forEach((crossRef) => {
          const fileName = path.relative(process.cwd(), crossRef.file);

          crossRef.related.forEach((article) => {
            // Should not have file extensions
            expect(article.path, `Path should not have file extension in ${fileName}`).not.toMatch(/\.(mdx|md)$/);

            // Should not have trailing slash
            expect(article.path, `Path should not have trailing slash in ${fileName}`).not.toMatch(/\/$/);

            // Should not have double slashes
            expect(article.path, `Path should not have double slashes in ${fileName}`).not.toMatch(/\/\//);
          });
        });
      });

      it('should detect objects with missing required fields', () => {
        allCrossRefs.forEach((crossRef) => {
          const fileName = path.relative(process.cwd(), crossRef.file);

          crossRef.related.forEach((article, idx) => {
            expect(article, `Article ${idx} missing 'path' field in ${fileName}:${crossRef.lineNumber}`).toHaveProperty('path');
            expect(article, `Article ${idx} missing 'label' field in ${fileName}:${crossRef.lineNumber}`).toHaveProperty('label');
          });
        });
      });
    });
  });

  describe('Import Statement Validation', () => {
    allFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasCrossRef = content.includes('<CrossRef');
      const hasImport = content.match(/import\s+CrossRef\s+from\s+['"]@site\/src\/components\/CrossRef['"]/);

      if (hasCrossRef || hasImport) {
        const fileName = path.relative(process.cwd(), file);

        it(`${fileName} - should import CrossRef if used`, () => {
          if (hasCrossRef) {
            expect(hasImport, `CrossRef used but not imported in ${fileName}`).toBeTruthy();
          }
        });

        it(`${fileName} - should use CrossRef if imported`, () => {
          if (hasImport) {
            expect(hasCrossRef, `CrossRef imported but not used in ${fileName}`).toBeTruthy();
          }
        });

        it(`${fileName} - should use correct import path`, () => {
          if (hasImport) {
            const importPath = hasImport[0];
            expect(importPath).toContain('@site/src/components/CrossRef');
          }
        });
      }
    });
  });
});
