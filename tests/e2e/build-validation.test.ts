import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, statSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

describe('E2E Build Validation', () => {
  const buildDir = join(process.cwd(), 'build');
  const docsDir = join(process.cwd(), 'docs');

  beforeAll(() => {
    // Clean build directory if exists
    if (existsSync(buildDir)) {
      execSync('rm -rf build', { cwd: process.cwd() });
    }

    // Run build
    try {
      execSync('npm run build', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf-8'
      });
    } catch (error: any) {
      throw new Error(`Build failed: ${error.message}\n${error.stdout}\n${error.stderr}`);
    }
  }, 300000); // 5 minute timeout for build

  it('should complete build successfully with exit code 0', () => {
    expect(existsSync(buildDir)).toBe(true);
  });

  it('should create build directory with index.html', () => {
    const indexPath = join(buildDir, 'index.html');
    expect(existsSync(indexPath)).toBe(true);

    const indexContent = readFileSync(indexPath, 'utf-8');
    // Docusaurus may use lowercase <!doctype html>
    expect(indexContent.toLowerCase()).toContain('<!doctype html>');
    expect(indexContent).toContain('<html');
  });

  it('should generate HTML pages for all 12 categories', () => {
    const categories = [
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

    const docsOutputDir = join(buildDir, 'docs');
    expect(existsSync(docsOutputDir)).toBe(true);

    categories.forEach(category => {
      const categoryPath = join(docsOutputDir, category);
      const categoryExists = existsSync(categoryPath);

      if (!categoryExists) {
        // Some categories might be flattened, check if any HTML files exist for this category
        const allHtmlFiles = getAllHtmlFiles(docsOutputDir);
        const categoryFiles = allHtmlFiles.filter(f => f.includes(category));
        expect(categoryFiles.length).toBeGreaterThan(0, `No HTML files found for category ${category}`);
      } else {
        const htmlFiles = getAllHtmlFiles(categoryPath);
        expect(htmlFiles.length).toBeGreaterThan(0, `Category ${category} has no HTML files`);
      }
    });
  });

  it('should generate at least 76 total HTML pages (one per MDX article)', () => {
    const allHtmlFiles = getAllHtmlFiles(buildDir);
    const docPages = allHtmlFiles.filter(f => f.includes('/docs/'));

    expect(docPages.length).toBeGreaterThanOrEqual(76);
  });

  it('should generate sitemap.xml', () => {
    const sitemapPath = join(buildDir, 'sitemap.xml');
    expect(existsSync(sitemapPath)).toBe(true);

    const sitemapContent = readFileSync(sitemapPath, 'utf-8');
    expect(sitemapContent).toContain('<?xml version="1.0"');
    expect(sitemapContent).toContain('<urlset');
    expect(sitemapContent).toContain('<url>');
  });

  it('should have reasonable build output size (< 50MB)', () => {
    const buildSize = getDirSize(buildDir);
    const buildSizeMB = buildSize / (1024 * 1024);

    expect(buildSizeMB).toBeLessThan(50);
    expect(buildSizeMB).toBeGreaterThan(0.1); // Sanity check: not empty
  });

  it('should not have content-related build warnings', () => {
    let buildOutput = '';

    try {
      buildOutput = execSync('npm run build', {
        cwd: process.cwd(),
        stdio: 'pipe',
        encoding: 'utf-8'
      });
    } catch (error: any) {
      buildOutput = error.stdout || error.stderr || '';
    }

    // Filter out known deprecation warnings from dependencies
    const lines = buildOutput.split('\n');
    const contentWarnings = lines.filter(line => {
      const lowerLine = line.toLowerCase();
      return (
        lowerLine.includes('warning') &&
        !lowerLine.includes('deprecated') &&
        !lowerLine.includes('punycode') &&
        !lowerLine.includes('domexception') &&
        (
          lowerLine.includes('broken link') ||
          lowerLine.includes('missing') ||
          lowerLine.includes('invalid') ||
          lowerLine.includes('mdx')
        )
      );
    });

    expect(contentWarnings).toHaveLength(0);
  });

  it('should include all essential static assets', () => {
    // Check for CSS
    const cssFiles = getAllFiles(buildDir).filter(f => f.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);

    // Check for JS bundles
    const jsFiles = getAllFiles(buildDir).filter(f => f.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);
  });
});

// Helper functions
function getAllHtmlFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    if (!existsSync(currentDir)) return;

    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function getAllFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    if (!existsSync(currentDir)) return;

    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function getDirSize(dir: string): number {
  let size = 0;

  function traverse(currentDir: string) {
    if (!existsSync(currentDir)) return;

    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else {
        const stats = statSync(fullPath);
        size += stats.size;
      }
    }
  }

  traverse(dir);
  return size;
}
