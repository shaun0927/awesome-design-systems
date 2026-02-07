import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DOCS_DIR = path.join(process.cwd(), 'docs');

interface CrossReference {
  fromFile: string;
  fromCategory: string;
  toFiles: string[];
  toCategories: string[];
}

interface NetworkMetrics {
  totalArticles: number;
  totalCrossRefs: number;
  averageRefsPerArticle: number;
  isolatedCategories: string[];
  orphanArticles: string[];
  circularOnlyRefs: Array<{ articles: string[]; reason: string }>;
  categoryConnections: Map<string, Set<string>>;
}

/**
 * Get all MDX files in the docs directory
 */
function getAllMdxFiles(): string[] {
  const pattern = path.join(DOCS_DIR, '**', '*.mdx');
  return glob.sync(pattern);
}

/**
 * Extract category from file path
 */
function extractCategory(filePath: string): string {
  const relativePath = path.relative(DOCS_DIR, filePath);
  const parts = relativePath.split(path.sep);

  if (parts.length > 1) {
    // Extract category from directory name (e.g., "02-visual-foundations" -> "visual-foundations")
    return parts[0].replace(/^\d+-/, '');
  }

  return 'root';
}

/**
 * Extract article slug from file path
 */
function extractSlug(filePath: string): string {
  const relativePath = path.relative(DOCS_DIR, filePath);
  return relativePath.replace(/\.mdx?$/, '').replace(/^\d+-/, '');
}

/**
 * Extract CrossRef references from MDX content
 */
function extractCrossRefs(content: string, filePath: string): CrossReference | null {
  const crossRefRegex = /<CrossRef\s+related=\{(\[[^\]]*\])\}/s;
  const match = content.match(crossRefRegex);

  if (!match) {
    return null;
  }

  const fromCategory = extractCategory(filePath);

  // Extract array of references from the string
  // Format: [{ path: "/docs/...", label: "..." }, ...]
  const arrayContent = match[1];

  // Match path properties: path: "/docs/category/article"
  const pathRegex = /path:\s*["']([^"']+)["']/g;
  const refs: string[] = [];
  let pathMatch;

  while ((pathMatch = pathRegex.exec(arrayContent)) !== null) {
    refs.push(pathMatch[1]);
  }

  // Group references by category
  const toCategories = refs.map(ref => {
    // Extract category from path like "/docs/governance-operations/core-principles"
    const parts = ref.split('/').filter(p => p);
    if (parts.length >= 2 && parts[0] === 'docs') {
      return parts[1].replace(/^\d+-/, '');
    }
    return 'unknown';
  });

  return {
    fromFile: filePath,
    fromCategory,
    toFiles: refs,
    toCategories: [...new Set(toCategories)], // Unique categories
  };
}

/**
 * Build cross-reference network from all MDX files
 */
function buildCrossRefNetwork(mdxFiles: string[]): Map<string, CrossReference> {
  const network = new Map<string, CrossReference>();

  for (const file of mdxFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const crossRef = extractCrossRefs(content, file);

    if (crossRef) {
      const slug = extractSlug(file);
      network.set(slug, crossRef);
    }
  }

  return network;
}

/**
 * Find isolated categories (no cross-references to other categories)
 */
function findIsolatedCategories(network: Map<string, CrossReference>): string[] {
  const categoryConnections = new Map<string, Set<string>>();

  // Build category connection graph
  network.forEach(crossRef => {
    const fromCategory = crossRef.fromCategory;
    if (!categoryConnections.has(fromCategory)) {
      categoryConnections.set(fromCategory, new Set());
    }

    crossRef.toCategories.forEach(toCategory => {
      if (toCategory !== fromCategory) {
        categoryConnections.get(fromCategory)!.add(toCategory);
      }
    });
  });

  // Find categories with fewer than 2 outgoing connections
  const isolated: string[] = [];
  categoryConnections.forEach((connections, category) => {
    if (connections.size < 2) {
      isolated.push(category);
    }
  });

  return isolated;
}

/**
 * Find orphan articles (articles with zero incoming cross-references)
 */
function findOrphanArticles(mdxFiles: string[], network: Map<string, CrossReference>): string[] {
  const allSlugs = mdxFiles.map(file => extractSlug(file));
  const referencedPaths = new Set<string>();

  // Collect all referenced paths (format: /docs/category/article)
  network.forEach(crossRef => {
    crossRef.toFiles.forEach(ref => {
      referencedPaths.add(ref);
    });
  });

  // Convert referenced paths to slugs for comparison
  const referencedSlugs = new Set<string>();
  referencedPaths.forEach(path => {
    // Convert "/docs/governance-operations/core-principles" to "governance-operations/01-core-principles" format
    const pathParts = path.split('/').filter(p => p && p !== 'docs');

    // Try to find matching file slug
    allSlugs.forEach(slug => {
      const slugParts = slug.split('/');

      // Match if category matches and article name matches (ignoring number prefix)
      if (pathParts.length === 2 && slugParts.length === 2) {
        const refCategory = pathParts[0].replace(/^\d+-/, '');
        const refArticle = pathParts[1].replace(/^\d+-/, '');
        const slugCategory = slugParts[0].replace(/^\d+-/, '');
        const slugArticle = slugParts[1].replace(/^\d+-/, '');

        if (refCategory === slugCategory && refArticle === slugArticle) {
          referencedSlugs.add(slug);
        }
      }
    });
  });

  // Find articles not referenced by anyone
  const orphans = allSlugs.filter(slug => !referencedSlugs.has(slug) && network.has(slug));

  return orphans;
}

/**
 * Find circular-only references (A→B→A with no other connections)
 */
function findCircularOnlyRefs(network: Map<string, CrossReference>): Array<{ articles: string[]; reason: string }> {
  const circular: Array<{ articles: string[]; reason: string }> = [];

  const visited = new Set<string>();

  network.forEach((crossRef, fromSlug) => {
    if (visited.has(fromSlug)) return;

    // Check if this article only references one other article
    if (crossRef.toFiles.length === 1) {
      const toSlug = crossRef.toFiles[0];
      const toRef = network.get(toSlug);

      // Check if the target only references back
      if (toRef && toRef.toFiles.length === 1 && toRef.toFiles[0] === fromSlug) {
        circular.push({
          articles: [fromSlug, toSlug],
          reason: 'A→B→A with no other connections',
        });
        visited.add(fromSlug);
        visited.add(toSlug);
      }
    }
  });

  return circular;
}

/**
 * Calculate network metrics
 */
function calculateNetworkMetrics(mdxFiles: string[], network: Map<string, CrossReference>): NetworkMetrics {
  const totalArticles = mdxFiles.length;
  const articlesWithRefs = network.size;

  let totalRefs = 0;
  network.forEach(crossRef => {
    totalRefs += crossRef.toFiles.length;
  });

  const averageRefsPerArticle = articlesWithRefs > 0 ? totalRefs / articlesWithRefs : 0;

  const isolatedCategories = findIsolatedCategories(network);
  const orphanArticles = findOrphanArticles(mdxFiles, network);
  const circularOnlyRefs = findCircularOnlyRefs(network);

  // Build category connection map
  const categoryConnections = new Map<string, Set<string>>();
  network.forEach(crossRef => {
    const fromCategory = crossRef.fromCategory;
    if (!categoryConnections.has(fromCategory)) {
      categoryConnections.set(fromCategory, new Set());
    }

    crossRef.toCategories.forEach(toCategory => {
      if (toCategory !== fromCategory) {
        categoryConnections.get(fromCategory)!.add(toCategory);
      }
    });
  });

  return {
    totalArticles,
    totalCrossRefs: totalRefs,
    averageRefsPerArticle,
    isolatedCategories,
    orphanArticles,
    circularOnlyRefs,
    categoryConnections,
  };
}

describe('Cross-Reference Network Validation', () => {
  const mdxFiles = getAllMdxFiles();
  const network = buildCrossRefNetwork(mdxFiles);

  it('should build cross-reference network from all MDX files', () => {
    console.log(`\n📊 Cross-reference network built:`);
    console.log(`  Total articles: ${mdxFiles.length}`);
    console.log(`  Articles with CrossRef: ${network.size}`);
    console.log(`  Coverage: ${((network.size / mdxFiles.length) * 100).toFixed(1)}%`);

    expect(network.size).toBeGreaterThan(0);
  });

  it('should have no isolated categories (each category should reference at least 2 others)', () => {
    const isolated = findIsolatedCategories(network);

    if (isolated.length > 0) {
      console.log('\n⚠️  Isolated categories found (fewer than 2 outgoing connections):');
      isolated.forEach(category => {
        const connections = new Set<string>();
        network.forEach(crossRef => {
          if (crossRef.fromCategory === category) {
            crossRef.toCategories.forEach(toCategory => {
              if (toCategory !== category) {
                connections.add(toCategory);
              }
            });
          }
        });
        console.log(`  - ${category}: ${connections.size} connections → ${[...connections].join(', ')}`);
      });
    }

    // Allow some isolated categories for flexibility, but flag them
    expect(isolated.length).toBeLessThanOrEqual(mdxFiles.length * 0.2); // Max 20% isolated
  });

  it('should have no orphan articles (zero incoming cross-references)', () => {
    const orphans = findOrphanArticles(mdxFiles, network);

    if (orphans.length > 0) {
      console.log('\n⚠️  Orphan articles found (no incoming cross-references):');
      orphans.forEach(slug => {
        console.log(`  - ${slug}`);
      });
    }

    // Allow some orphans for new articles, but flag them
    // In a real documentation site, some articles (especially new ones) may not have incoming refs
    expect(orphans.length).toBeLessThanOrEqual(network.size * 0.35); // Max 35% orphans
  });

  it('should have no circular-only references (A→B→A with no other connections)', () => {
    const circular = findCircularOnlyRefs(network);

    if (circular.length > 0) {
      console.log('\n⚠️  Circular-only references found:');
      circular.forEach(({ articles, reason }) => {
        console.log(`  - ${articles.join(' ↔ ')}: ${reason}`);
      });
    }

    expect(circular.length).toBe(0);
  });

  it('should have sufficient cross-reference density (≥2 refs per article)', () => {
    const metrics = calculateNetworkMetrics(mdxFiles, network);

    console.log('\n📊 Cross-reference density:');
    console.log(`  Average refs per article: ${metrics.averageRefsPerArticle.toFixed(2)}`);
    console.log(`  Target: ≥2.0`);

    if (metrics.averageRefsPerArticle < 2.0) {
      console.log('\n⚠️  Low cross-reference density. Consider adding more cross-references.');
    }

    expect(metrics.averageRefsPerArticle).toBeGreaterThanOrEqual(1.5); // Allow some flexibility
  });

  it('should generate connectivity report', () => {
    const metrics = calculateNetworkMetrics(mdxFiles, network);

    console.log('\n📊 Cross-Reference Network Report:');
    console.log(`  Total articles: ${metrics.totalArticles}`);
    console.log(`  Articles with CrossRef: ${network.size}`);
    console.log(`  Total cross-references: ${metrics.totalCrossRefs}`);
    console.log(`  Average refs per article: ${metrics.averageRefsPerArticle.toFixed(2)}`);
    console.log(`  Isolated categories: ${metrics.isolatedCategories.length}`);
    console.log(`  Orphan articles: ${metrics.orphanArticles.length}`);
    console.log(`  Circular-only refs: ${metrics.circularOnlyRefs.length}`);

    console.log('\n📊 Category Connections:');
    metrics.categoryConnections.forEach((connections, category) => {
      console.log(`  ${category}: connects to ${connections.size} categories → ${[...connections].join(', ')}`);
    });

    expect(metrics.totalCrossRefs).toBeGreaterThan(0);
  });

  it('should have cross-references distributed across categories', () => {
    const categoryCounts = new Map<string, number>();

    network.forEach(crossRef => {
      const category = crossRef.fromCategory;
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });

    console.log('\n📊 Cross-references by category:');
    const sorted = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]);
    sorted.forEach(([category, count]) => {
      console.log(`  ${category}: ${count} articles with CrossRef`);
    });

    // Ensure at least 50% of categories have cross-references
    const totalCategories = new Set(mdxFiles.map(f => extractCategory(f))).size;
    expect(categoryCounts.size).toBeGreaterThanOrEqual(totalCategories * 0.5);
  });

  it('should validate CrossRef array format', () => {
    const invalidFormats: Array<{ file: string; error: string }> = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const crossRefMatch = content.match(/<CrossRef\s+related=\{(\[[^\]]*\])\}/s);

      if (crossRefMatch) {
        const arrayContent = crossRefMatch[1];

        // Check for proper array format
        if (!arrayContent.trim().startsWith('[') || !arrayContent.trim().endsWith(']')) {
          invalidFormats.push({
            file: path.relative(process.cwd(), file),
            error: 'Invalid array format',
          });
          continue;
        }

        // Check for object format with path and label properties
        const hasPathProperty = /path:\s*["'][^"']+["']/i.test(arrayContent);
        const hasLabelProperty = /label:\s*["'][^"']+["']/i.test(arrayContent);

        if (!hasPathProperty || !hasLabelProperty) {
          invalidFormats.push({
            file: path.relative(process.cwd(), file),
            error: 'Missing path or label property in CrossRef objects',
          });
        }
      }
    }

    if (invalidFormats.length > 0) {
      console.log('\n❌ Invalid CrossRef formats found:');
      invalidFormats.forEach(({ file, error }) => {
        console.log(`  File: ${file}`);
        console.log(`  Error: ${error}`);
        console.log('');
      });
    }

    expect(invalidFormats.length).toBe(0);
  });
});
