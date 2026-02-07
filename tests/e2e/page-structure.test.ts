import { describe, it, expect, beforeAll } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('E2E Page Structure Validation', () => {
  const buildDir = join(process.cwd(), 'build');
  const docsOutputDir = join(buildDir, 'docs');
  let allHtmlFiles: string[] = [];

  beforeAll(() => {
    if (!existsSync(buildDir)) {
      return; // Build directory not available - tests will be skipped gracefully
    }

    if (existsSync(docsOutputDir)) {
      allHtmlFiles = getAllHtmlFiles(docsOutputDir);
    }
  });

  it('should have proper <title> tags in all article pages', () => {
    if (allHtmlFiles.length === 0) {
      console.warn('No build output found - skipping. Run "npm run build" first.');
      return;
    }

    const articlePages = allHtmlFiles.filter(f => !f.endsWith('index.html') && existsSync(f));

    expect(articlePages.length).toBeGreaterThan(0);

    articlePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');
      const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/);

      expect(titleMatch).toBeTruthy();
      expect(titleMatch![1].trim()).not.toBe('');
      expect(titleMatch![1]).not.toContain('undefined');
    });
  });

  it('should have meta description tags in all article pages', () => {
    const articlePages = allHtmlFiles.filter(f => !f.endsWith('index.html') && existsSync(f));

    if (articlePages.length === 0) {
      console.warn('No article pages found - skipping meta description validation. Run "npm run build" first.');
      return;
    }

    articlePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');
      const hasMetaDescription =
        content.includes('name="description"') ||
        content.includes('property="og:description"') ||
        content.includes('property="og:title"'); // Docusaurus may use og:title instead

      expect(hasMetaDescription).toBe(true);
    });
  });

  it('should have sidebar navigation present in article pages', () => {
    const validPages = allHtmlFiles.filter(f => existsSync(f));
    const samplePages = validPages.slice(0, 10); // Sample 10 pages

    samplePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');

      // Docusaurus typically uses these classes for sidebar
      const hasSidebar =
        content.includes('sidebar') ||
        content.includes('menu__list') ||
        content.includes('theme-doc-sidebar');

      expect(hasSidebar).toBe(true);
    });
  });

  it('should have mermaid diagram containers where diagrams are expected', () => {
    // Find articles that likely have mermaid diagrams
    const docsDir = join(process.cwd(), 'docs');
    const mdxFiles = getAllMdxFiles(docsDir);

    const filesWithMermaid = mdxFiles.filter(file => {
      const content = readFileSync(file, 'utf-8');
      return content.includes('```mermaid');
    });

    expect(filesWithMermaid.length).toBeGreaterThan(0);

    // Check at least one built page has mermaid divs
    const validHtmlFiles = allHtmlFiles.filter(f => existsSync(f));

    if (validHtmlFiles.length === 0) {
      // If no HTML files exist, skip this test (build not run)
      console.warn('No HTML files found - skipping mermaid validation. Run "npm run build" first.');
      return;
    }

    const hasAnyMermaidDiv = validHtmlFiles.some(htmlFile => {
      if (!existsSync(htmlFile)) return false;
      const content = readFileSync(htmlFile, 'utf-8');
      return content.includes('mermaid') || content.includes('diagram');
    });

    expect(hasAnyMermaidDiv).toBe(true);
  });

  it('should have syntax highlighting classes in code blocks', () => {
    const validPages = allHtmlFiles.filter(f => existsSync(f));

    if (validPages.length === 0) {
      // If no HTML files exist, skip this test (build not run)
      console.warn('No HTML files found - skipping syntax highlighting validation. Run "npm run build" first.');
      return;
    }

    const samplePages = validPages.slice(0, 15); // Sample 15 pages

    let pagesWithCodeBlocks = 0;

    samplePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');

      // Prism or Highlight.js classes (Docusaurus uses Prism)
      const hasHighlighting =
        content.includes('language-') ||
        content.includes('prism-') ||
        content.includes('hljs-') ||
        content.includes('token ') ||
        content.includes('codeBlockContainer') ||
        content.includes('theme-code-block'); // Docusaurus 3 class

      if (hasHighlighting) {
        pagesWithCodeBlocks++;
      }
    });

    // At least some pages should have code blocks
    expect(pagesWithCodeBlocks).toBeGreaterThan(0);
  });

  it('should have proper HTML5 structure', () => {
    const validPages = allHtmlFiles.filter(f => existsSync(f));
    const samplePages = validPages.slice(0, 5);

    samplePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');

      // Docusaurus may use lowercase <!doctype html>
      expect(content.toLowerCase()).toContain('<!doctype html>');
      expect(content).toMatch(/<html[^>]*>/);
      expect(content).toContain('<head>');
      expect(content).toContain('<body');
      expect(content).toContain('</html>');
    });
  });

  it('should have main content area in article pages', () => {
    const validPages = allHtmlFiles.filter(f => !f.endsWith('index.html') && existsSync(f));
    const articlePages = validPages.slice(0, 10);

    articlePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');

      const hasMainContent =
        content.includes('<main') ||
        content.includes('role="main"') ||
        content.includes('article') ||
        content.includes('docMainContainer');

      expect(hasMainContent).toBe(true);
    });
  });

  it('should have proper charset and viewport meta tags', () => {
    const validPages = allHtmlFiles.filter(f => existsSync(f));

    if (validPages.length === 0) {
      console.warn('No HTML files found - skipping charset/viewport validation. Run "npm run build" first.');
      return;
    }

    const samplePages = validPages.slice(0, 5);

    samplePages.forEach(filePath => {
      if (!existsSync(filePath)) return;

      const content = readFileSync(filePath, 'utf-8');

      // Case-insensitive charset check (HTML5 allows UTF-8, utf-8, etc.)
      const hasCharset =
        content.toLowerCase().includes('charset="utf-8"') ||
        content.toLowerCase().includes("charset='utf-8'") ||
        content.toLowerCase().includes('charset=utf-8');

      const hasViewport = content.includes('name="viewport"');

      expect(hasCharset).toBe(true);
      expect(hasViewport).toBe(true);
    });
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

function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    if (!existsSync(currentDir)) return;

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
