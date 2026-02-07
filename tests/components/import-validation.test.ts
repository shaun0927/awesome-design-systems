import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const COMPONENTS_DIR = path.join(process.cwd(), 'src/components');

const AVAILABLE_COMPONENTS = [
  'CrossRef',
  'DevQuickStart',
  'AudienceBadge',
  'ArticleMeta',
  'CategoryCard',
  'BeforeAfter',
  'BrowserSupport',
  'GlossaryTerm',
];

interface ImportMatch {
  file: string;
  componentName: string;
  importPath: string;
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

function extractImports(filePath: string): ImportMatch[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports: ImportMatch[] = [];

  // Match component imports
  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const componentName = match[1];
    const importPath = match[2];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    // Only track imports from @site/src/components
    if (importPath.startsWith('@site/src/components')) {
      imports.push({
        file: filePath,
        componentName,
        importPath,
        lineNumber,
      });
    }
  }

  return imports;
}

function isComponentUsed(content: string, componentName: string): boolean {
  // Check for JSX usage: <ComponentName
  const jsxRegex = new RegExp(`<${componentName}[\\s/>]`, 'g');
  return jsxRegex.test(content);
}

function componentFileExists(componentName: string): boolean {
  const tsxPath = path.join(COMPONENTS_DIR, `${componentName}.tsx`);
  const tsPath = path.join(COMPONENTS_DIR, `${componentName}.ts`);
  const jsxPath = path.join(COMPONENTS_DIR, `${componentName}.jsx`);
  const jsPath = path.join(COMPONENTS_DIR, `${componentName}.js`);

  return fs.existsSync(tsxPath) || fs.existsSync(tsPath) ||
         fs.existsSync(jsxPath) || fs.existsSync(jsPath);
}

describe('Component Import Validation', () => {
  const allFiles = getAllMdxFiles();

  it('should find at least some MDX files', () => {
    expect(allFiles.length).toBeGreaterThan(0);
    expect(allFiles.length).toBe(76);
  });

  describe('Import Statement Validation', () => {
    allFiles.forEach((file) => {
      const fileName = path.relative(process.cwd(), file);
      const content = fs.readFileSync(file, 'utf-8');
      const imports = extractImports(file);

      if (imports.length > 0) {
        describe(`${fileName}`, () => {
          it('should use all imported components', () => {
            imports.forEach((imp) => {
              const isUsed = isComponentUsed(content, imp.componentName);
              expect(isUsed, `Component "${imp.componentName}" imported but not used at line ${imp.lineNumber}`).toBe(true);
            });
          });

          it('should use correct import path (@site/src/components/)', () => {
            imports.forEach((imp) => {
              expect(imp.importPath, `Incorrect import path at line ${imp.lineNumber}`).toMatch(/^@site\/src\/components\//);
            });
          });

          it('should import from existing component files', () => {
            imports.forEach((imp) => {
              const exists = componentFileExists(imp.componentName);
              expect(exists, `Component file for "${imp.componentName}" does not exist (imported at line ${imp.lineNumber})`).toBe(true);
            });
          });

          it('should have component name matching the file name', () => {
            imports.forEach((imp) => {
              // Extract component name from path: @site/src/components/ComponentName
              const pathParts = imp.importPath.split('/');
              const fileNameFromPath = pathParts[pathParts.length - 1];

              expect(imp.componentName, `Component name "${imp.componentName}" doesn't match import path "${imp.importPath}" at line ${imp.lineNumber}`).toBe(fileNameFromPath);
            });
          });
        });
      }
    });
  });

  describe('Component Usage Without Import', () => {
    const violations: Array<{ file: string; component: string }> = [];

    allFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const imports = extractImports(file);
      const importedComponents = new Set(imports.map(imp => imp.componentName));

      AVAILABLE_COMPONENTS.forEach((componentName) => {
        if (isComponentUsed(content, componentName) && !importedComponents.has(componentName)) {
          violations.push({ file, component: componentName });
        }
      });
    });

    if (violations.length === 0) {
      it('should not use components without importing them', () => {
        expect(violations.length).toBe(0);
      });
    } else {
      violations.forEach(({ file, component }) => {
        const fileName = path.relative(process.cwd(), file);
        it(`${fileName} - should import ${component} before using it`, () => {
          expect(false, `Component "${component}" used but not imported`).toBe(true);
        });
      });
    }
  });

  describe('Import Path Consistency', () => {
    const allImports: ImportMatch[] = [];

    allFiles.forEach((file) => {
      const imports = extractImports(file);
      allImports.push(...imports);
    });

    it('should use consistent import paths for the same component', () => {
      const pathsByComponent = new Map<string, Set<string>>();

      allImports.forEach((imp) => {
        if (!pathsByComponent.has(imp.componentName)) {
          pathsByComponent.set(imp.componentName, new Set());
        }
        pathsByComponent.get(imp.componentName)!.add(imp.importPath);
      });

      pathsByComponent.forEach((paths, componentName) => {
        if (paths.size > 1) {
          console.warn(`Inconsistent import paths for ${componentName}:`);
          paths.forEach(p => console.warn(`  - ${p}`));
        }
        expect(paths.size, `Multiple import paths found for ${componentName}`).toBe(1);
      });
    });

    it('should not use relative paths for component imports', () => {
      allImports.forEach((imp) => {
        const fileName = path.relative(process.cwd(), imp.file);
        const isRelative = imp.importPath.startsWith('./') || imp.importPath.startsWith('../');
        expect(isRelative, `Relative import path used in ${fileName}:${imp.lineNumber}`).toBe(false);
      });
    });

    it('should not have trailing slashes in import paths', () => {
      allImports.forEach((imp) => {
        const fileName = path.relative(process.cwd(), imp.file);
        expect(imp.importPath.endsWith('/'), `Trailing slash in import path in ${fileName}:${imp.lineNumber}`).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    const allImports: ImportMatch[] = [];

    // Collect all imports first
    allFiles.forEach((file) => {
      const imports = extractImports(file);
      allImports.push(...imports);
    });

    it('should detect duplicate imports of the same component', () => {
      allFiles.forEach((file) => {
        const fileName = path.relative(process.cwd(), file);
        const imports = extractImports(file);
        const componentNames = imports.map(imp => imp.componentName);
        const uniqueNames = new Set(componentNames);

        if (componentNames.length !== uniqueNames.size) {
          const duplicates = componentNames.filter((name, index) => componentNames.indexOf(name) !== index);
          console.warn(`Duplicate imports in ${fileName}: ${duplicates.join(', ')}`);
        }

        expect(componentNames.length, `Duplicate imports found in ${fileName}`).toBe(uniqueNames.size);
      });
    });

    it('should detect case sensitivity issues in component names', () => {
      allImports.forEach((imp) => {
        const fileName = path.relative(process.cwd(), imp.file);
        const hasLowerCase = imp.componentName !== imp.componentName[0].toUpperCase() + imp.componentName.slice(1);

        if (hasLowerCase) {
          console.warn(`Component name should start with uppercase in ${fileName}:${imp.lineNumber}: "${imp.componentName}"`);
        }

        expect(hasLowerCase, `Component name should use PascalCase in ${fileName}:${imp.lineNumber}`).toBe(false);
      });
    });

    it('should detect imports from wrong directories', () => {
      allFiles.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        const fileName = path.relative(process.cwd(), file);

        // Check for imports that might be trying to import components from wrong locations
        const wrongImports = [
          /import\s+\w+\s+from\s+['"]\.\.\//,  // Parent directory
          /import\s+\w+\s+from\s+['"]src\/components\//,  // Without @site alias
          /import\s+\w+\s+from\s+['"]@\/components\//,  // Wrong alias
        ];

        wrongImports.forEach((regex) => {
          const matches = content.match(regex);
          if (matches) {
            console.warn(`Potential incorrect import path in ${fileName}: ${matches[0]}`);
          }
        });
      });
    });
  });

  describe('Component Availability Check', () => {
    it('should verify all documented components exist in src/components/', () => {
      AVAILABLE_COMPONENTS.forEach((componentName) => {
        const exists = componentFileExists(componentName);
        expect(exists, `Component ${componentName} listed but file doesn't exist`).toBe(true);
      });
    });

    it('should detect undocumented components in src/components/', () => {
      const componentFiles = fs.readdirSync(COMPONENTS_DIR)
        .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
        .filter(file => !file.startsWith('__') && !file.startsWith('index'))
        .map(file => file.replace(/\.(tsx|ts)$/, ''));

      const undocumented = componentFiles.filter(name => !AVAILABLE_COMPONENTS.includes(name));

      if (undocumented.length > 0) {
        console.log('Undocumented components found:');
        undocumented.forEach(name => console.log(`  - ${name}`));
      }
    });
  });

  describe('Import Statistics', () => {
    it('should show component usage statistics', () => {
      const usageCount: Record<string, number> = {};

      allFiles.forEach((file) => {
        const imports = extractImports(file);
        imports.forEach((imp) => {
          usageCount[imp.componentName] = (usageCount[imp.componentName] || 0) + 1;
        });
      });

      console.log('\nComponent Usage Statistics:');
      Object.entries(usageCount)
        .sort(([, a], [, b]) => b - a)
        .forEach(([component, count]) => {
          console.log(`  ${component}: ${count} files`);
        });
    });
  });
});
