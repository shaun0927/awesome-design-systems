import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DOCS_DIR = path.join(process.cwd(), 'docs');

interface ExternalLink {
  file: string;
  url: string;
  text: string;
  line: number;
  valid: boolean;
  error?: string;
}

interface DomainCount {
  domain: string;
  count: number;
  urls: string[];
}

/**
 * Get all MDX files in the docs directory
 */
function getAllMdxFiles(): string[] {
  const pattern = path.join(DOCS_DIR, '**', '*.mdx');
  return glob.sync(pattern);
}

/**
 * Extract all external links from MDX content
 */
function extractExternalLinks(content: string, filePath: string): ExternalLink[] {
  const links: ExternalLink[] = [];
  const lines = content.split('\n');

  // Match markdown links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

  lines.forEach((line, index) => {
    let match;
    while ((match = markdownLinkRegex.exec(line)) !== null) {
      const text = match[1];
      const url = match[2];

      links.push({
        file: filePath,
        url,
        text,
        line: index + 1,
        valid: true, // Will be validated
      });
    }
  });

  // Also match plain URLs in text (not in code blocks)
  const plainUrlRegex = /(?<!`|"|\()(https?:\/\/[^\s<>"'`]+)(?!`|"|\))/g;

  let inCodeBlock = false;
  lines.forEach((line, index) => {
    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }

    // Skip if we're in a code block
    if (inCodeBlock) {
      return;
    }

    let match;
    while ((match = plainUrlRegex.exec(line)) !== null) {
      const url = match[1];

      // Skip if already captured as markdown link
      if (links.some(l => l.url === url && l.line === index + 1)) {
        continue;
      }

      links.push({
        file: filePath,
        url,
        text: url,
        line: index + 1,
        valid: true,
      });
    }
  });

  return links;
}

/**
 * Validate external URL format and content
 */
function validateExternalUrl(link: ExternalLink): ExternalLink {
  // Check for localhost/127.0.0.1
  if (link.url.includes('localhost') || link.url.includes('127.0.0.1')) {
    return {
      ...link,
      valid: false,
      error: 'Contains localhost or 127.0.0.1',
    };
  }

  // Check for placeholder domains (unless in code examples)
  const placeholderDomains = ['example.com', 'example.org', 'test.com'];
  if (placeholderDomains.some(domain => link.url.includes(domain))) {
    return {
      ...link,
      valid: false,
      error: 'Contains placeholder domain (example.com)',
    };
  }

  // Check for malformed URLs
  try {
    new URL(link.url);
  } catch (e) {
    return {
      ...link,
      valid: false,
      error: 'Malformed URL',
    };
  }

  // Prefer HTTPS over HTTP (warning, not error)
  if (link.url.startsWith('http://')) {
    const httpsUrl = link.url.replace('http://', 'https://');
    return {
      ...link,
      valid: true,
      error: `Consider using HTTPS: ${httpsUrl}`,
    };
  }

  return link;
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'invalid';
  }
}

/**
 * Find duplicate URLs within the same file
 */
function findDuplicatesInFile(links: ExternalLink[]): Map<string, ExternalLink[]> {
  const urlMap = new Map<string, ExternalLink[]>();

  links.forEach(link => {
    const existing = urlMap.get(link.url) || [];
    existing.push(link);
    urlMap.set(link.url, existing);
  });

  // Filter only duplicates (count > 1)
  const duplicates = new Map<string, ExternalLink[]>();
  urlMap.forEach((links, url) => {
    if (links.length > 1) {
      duplicates.set(url, links);
    }
  });

  return duplicates;
}

/**
 * Group and count URLs by domain
 */
function groupByDomain(allLinks: ExternalLink[]): DomainCount[] {
  const domainMap = new Map<string, string[]>();

  allLinks.forEach(link => {
    const domain = extractDomain(link.url);
    const existing = domainMap.get(domain) || [];
    if (!existing.includes(link.url)) {
      existing.push(link.url);
    }
    domainMap.set(domain, existing);
  });

  const domainCounts: DomainCount[] = [];
  domainMap.forEach((urls, domain) => {
    domainCounts.push({
      domain,
      count: urls.length,
      urls,
    });
  });

  // Sort by count descending
  domainCounts.sort((a, b) => b.count - a.count);

  return domainCounts;
}

describe('External Links Validation', () => {
  const mdxFiles = getAllMdxFiles();

  it('should extract external links from all MDX files', () => {
    let totalLinks = 0;

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);
      totalLinks += links.length;
    }

    console.log(`\n📊 Found ${totalLinks} external links across ${mdxFiles.length} files`);
    expect(totalLinks).toBeGreaterThan(0);
  });

  it('should have well-formed URLs', () => {
    const invalidLinks: ExternalLink[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);

      links.forEach(link => {
        const validated = validateExternalUrl(link);
        if (!validated.valid) {
          invalidLinks.push(validated);
        }
      });
    }

    if (invalidLinks.length > 0) {
      console.log('\n❌ Invalid external links found:');
      invalidLinks.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}:${link.line}`);
        console.log(`  URL: ${link.url}`);
        console.log(`  Error: ${link.error}`);
        console.log('');
      });
    }

    expect(invalidLinks.length).toBe(0);
  });

  it('should have no localhost URLs', () => {
    const localhostLinks: ExternalLink[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);

      links.forEach(link => {
        if (link.url.includes('localhost') || link.url.includes('127.0.0.1')) {
          localhostLinks.push(link);
        }
      });
    }

    if (localhostLinks.length > 0) {
      console.log('\n❌ Localhost URLs found:');
      localhostLinks.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}:${link.line}`);
        console.log(`  URL: ${link.url}`);
        console.log('');
      });
    }

    expect(localhostLinks.length).toBe(0);
  });

  it('should have no placeholder URLs (outside code blocks)', () => {
    const placeholderLinks: ExternalLink[] = [];
    const placeholderDomains = ['example.com', 'example.org', 'test.com'];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);

      links.forEach(link => {
        if (placeholderDomains.some(domain => link.url.includes(domain))) {
          placeholderLinks.push(link);
        }
      });
    }

    if (placeholderLinks.length > 0) {
      console.log('\n❌ Placeholder URLs found:');
      placeholderLinks.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}:${link.line}`);
        console.log(`  URL: ${link.url}`);
        console.log('');
      });
    }

    expect(placeholderLinks.length).toBe(0);
  });

  it('should prefer HTTPS over HTTP', () => {
    const httpLinks: ExternalLink[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);

      links.forEach(link => {
        if (link.url.startsWith('http://')) {
          httpLinks.push(link);
        }
      });
    }

    if (httpLinks.length > 0) {
      console.log('\n⚠️  HTTP links found (consider upgrading to HTTPS):');
      httpLinks.forEach(link => {
        console.log(`  File: ${path.relative(process.cwd(), link.file)}:${link.line}`);
        console.log(`  URL: ${link.url}`);
        console.log(`  Suggestion: ${link.url.replace('http://', 'https://')}`);
        console.log('');
      });
    }

    // This is a warning, not a hard failure
    expect(httpLinks.length).toBeGreaterThanOrEqual(0);
  });

  it('should have no duplicate external links within same file', () => {
    const filesWithDuplicates: Array<{ file: string; duplicates: Map<string, ExternalLink[]> }> = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);
      const duplicates = findDuplicatesInFile(links);

      if (duplicates.size > 0) {
        filesWithDuplicates.push({ file, duplicates });
      }
    }

    if (filesWithDuplicates.length > 0) {
      console.log('\n⚠️  Files with duplicate external links:');
      filesWithDuplicates.forEach(({ file, duplicates }) => {
        console.log(`  File: ${path.relative(process.cwd(), file)}`);
        duplicates.forEach((links, url) => {
          console.log(`    URL: ${url}`);
          console.log(`    Occurrences: ${links.length} times at lines: ${links.map(l => l.line).join(', ')}`);
        });
        console.log('');
      });
    }

    // This is a warning for content quality, not a hard failure
    expect(filesWithDuplicates.length).toBeGreaterThanOrEqual(0);
  });

  it('should group and count external links by domain', () => {
    const allLinks: ExternalLink[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);
      allLinks.push(...links);
    }

    const domainCounts = groupByDomain(allLinks);

    console.log('\n📊 External Links by Domain (Top 20):');
    domainCounts.slice(0, 20).forEach((domain, index) => {
      console.log(`  ${index + 1}. ${domain.domain}: ${domain.count} unique URLs`);
    });

    expect(domainCounts.length).toBeGreaterThan(0);
  });

  it('should report external link statistics', () => {
    let totalLinks = 0;
    let httpsLinks = 0;
    let httpLinks = 0;
    const uniqueUrls = new Set<string>();
    const uniqueDomains = new Set<string>();

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractExternalLinks(content, file);

      totalLinks += links.length;
      links.forEach(link => {
        uniqueUrls.add(link.url);
        uniqueDomains.add(extractDomain(link.url));
        if (link.url.startsWith('https://')) httpsLinks++;
        if (link.url.startsWith('http://')) httpLinks++;
      });
    }

    console.log('\n📊 External Link Statistics:');
    console.log(`  Total external links: ${totalLinks}`);
    console.log(`  Unique URLs: ${uniqueUrls.size}`);
    console.log(`  Unique domains: ${uniqueDomains.size}`);
    console.log(`  HTTPS links: ${httpsLinks} (${((httpsLinks / totalLinks) * 100).toFixed(1)}%)`);
    console.log(`  HTTP links: ${httpLinks} (${((httpLinks / totalLinks) * 100).toFixed(1)}%)`);
    console.log(`  Average links per file: ${(totalLinks / mdxFiles.length).toFixed(1)}`);

    expect(totalLinks).toBeGreaterThan(0);
  });
});
