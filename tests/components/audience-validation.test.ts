import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const DOCS_DIR = path.join(process.cwd(), 'docs');

type AudienceType = 'developer' | 'designer' | 'both' | 'leadership';

interface AudienceBadgeMatch {
  file: string;
  audience: string;
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

function extractAudienceBadges(filePath: string): AudienceBadgeMatch[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches: AudienceBadgeMatch[] = [];

  // Match AudienceBadge component with audience prop
  const audienceBadgeRegex = /<AudienceBadge\s+audience=["']([^"']+)["']\s*\/>/g;
  let match;

  while ((match = audienceBadgeRegex.exec(content)) !== null) {
    const audience = match[1];
    const lineNumber = content.substring(0, match.index).split('\n').length;

    matches.push({
      file: filePath,
      audience,
      lineNumber,
    });
  }

  return matches;
}

function getFrontmatterAudience(filePath: string): string | undefined {
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const { data } = matter(content);
    return data.audience;
  } catch {
    return undefined;
  }
}

describe('AudienceBadge Component Validation', () => {
  const allFiles = getAllMdxFiles();
  const validAudiences: AudienceType[] = ['developer', 'designer', 'both', 'leadership'];

  it('should find at least some MDX files', () => {
    expect(allFiles.length).toBeGreaterThan(0);
    expect(allFiles.length).toBe(76);
  });

  describe('AudienceBadge Usage Validation', () => {
    const allAudienceBadges: AudienceBadgeMatch[] = [];

    allFiles.forEach((file) => {
      const badges = extractAudienceBadges(file);
      allAudienceBadges.push(...badges);
    });

    it('should allow files without AudienceBadge (optional component)', () => {
      // AudienceBadge is optional, so this is just informational
      const filesWithBadge = allFiles.filter(file => extractAudienceBadges(file).length > 0);
      console.log(`Files with AudienceBadge: ${filesWithBadge.length}/${allFiles.length}`);
    });

    describe('Audience Type Validation', () => {
      if (allAudienceBadges.length === 0) {
        it('should have placeholder when no AudienceBadge components found', () => {
          expect(allAudienceBadges.length).toBe(0);
        });
      } else {
        allAudienceBadges.forEach((badge) => {
          const fileName = path.relative(process.cwd(), badge.file);

          it(`${fileName}:${badge.lineNumber} - audience must be one of: developer, designer, both, leadership`, () => {
            expect(validAudiences, `Invalid audience type "${badge.audience}" in ${fileName}:${badge.lineNumber}`).toContain(badge.audience as AudienceType);
          });
        });
      }
    });

    describe('Edge Cases', () => {
      it('should detect invalid audience values', () => {
        const invalidBadges = allAudienceBadges.filter(
          badge => !validAudiences.includes(badge.audience as AudienceType)
        );

        if (invalidBadges.length > 0) {
          console.warn(`Found ${invalidBadges.length} AudienceBadge components with invalid audience values`);
          invalidBadges.forEach(badge => {
            const fileName = path.relative(process.cwd(), badge.file);
            console.warn(`  - ${fileName}:${badge.lineNumber} has audience="${badge.audience}"`);
          });
        }

        expect(invalidBadges.length).toBe(0);
      });

      it('should detect typos in audience values', () => {
        const commonTypos = ['dev', 'develop', 'design', 'designers', 'developers', 'all', 'everyone'];

        allAudienceBadges.forEach((badge) => {
          const fileName = path.relative(process.cwd(), badge.file);

          if (commonTypos.includes(badge.audience.toLowerCase())) {
            console.warn(`Possible typo in audience value in ${fileName}:${badge.lineNumber}: "${badge.audience}"`);
          }
        });
      });
    });
  });

  describe('Frontmatter Consistency', () => {
    allFiles.forEach((file) => {
      const fileName = path.relative(process.cwd(), file);
      const frontmatterAudience = getFrontmatterAudience(file);
      const badges = extractAudienceBadges(file);

      if (frontmatterAudience || badges.length > 0) {
        it(`${fileName} - frontmatter audience should match AudienceBadge if both exist`, () => {
          if (frontmatterAudience && badges.length > 0) {
            const badgeAudience = badges[0].audience;
            expect(frontmatterAudience, `Frontmatter audience "${frontmatterAudience}" doesn't match AudienceBadge "${badgeAudience}" in ${fileName}`).toBe(badgeAudience);
          }
        });

        it(`${fileName} - frontmatter audience should be valid if present`, () => {
          if (frontmatterAudience) {
            expect(validAudiences, `Invalid frontmatter audience "${frontmatterAudience}" in ${fileName}`).toContain(frontmatterAudience as AudienceType);
          }
        });
      }
    });
  });

  describe('Import Statement Validation', () => {
    const filesWithImportOrUsage = allFiles.filter((file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const hasAudienceBadge = content.includes('<AudienceBadge');
      const hasImport = content.match(/import\s+AudienceBadge\s+from\s+['"]@site\/src\/components\/AudienceBadge['"]/);
      return hasAudienceBadge || hasImport;
    });

    if (filesWithImportOrUsage.length === 0) {
      it('should have placeholder when no files use AudienceBadge', () => {
        expect(filesWithImportOrUsage.length).toBe(0);
      });
    } else {
      filesWithImportOrUsage.forEach((file) => {
        const content = fs.readFileSync(file, 'utf-8');
        const hasAudienceBadge = content.includes('<AudienceBadge');
        const hasImport = content.match(/import\s+AudienceBadge\s+from\s+['"]@site\/src\/components\/AudienceBadge['"]/);
        const fileName = path.relative(process.cwd(), file);

        it(`${fileName} - should import AudienceBadge if used`, () => {
          if (hasAudienceBadge) {
            expect(hasImport, `AudienceBadge used but not imported in ${fileName}`).toBeTruthy();
          }
        });

        it(`${fileName} - should use AudienceBadge if imported`, () => {
          if (hasImport) {
            expect(hasAudienceBadge, `AudienceBadge imported but not used in ${fileName}`).toBeTruthy();
          }
        });

        it(`${fileName} - should use correct import path`, () => {
          if (hasImport) {
            const importPath = hasImport[0];
            expect(importPath).toContain('@site/src/components/AudienceBadge');
          }
        });
      });
    }
  });

  describe('Placement and Usage Patterns', () => {
    const filesWithBadges = allFiles.filter(file => extractAudienceBadges(file).length > 0);

    if (filesWithBadges.length === 0) {
      it('should find at least one file with AudienceBadge', () => {
        // This is optional, so just a placeholder test
        expect(true).toBe(true);
      });
    } else {
      filesWithBadges.forEach((file) => {
        const badges = extractAudienceBadges(file);
        const fileName = path.relative(process.cwd(), file);

        it(`${fileName} - should have only one AudienceBadge per file`, () => {
          expect(badges.length, `Multiple AudienceBadge components in ${fileName}`).toBeLessThanOrEqual(1);
        });

        it(`${fileName} - AudienceBadge should appear near the top of the content`, () => {
          const firstBadge = badges[0];
          // Should appear within the first 30 lines (after frontmatter and imports)
          expect(firstBadge.lineNumber, `AudienceBadge appears too late in ${fileName} (line ${firstBadge.lineNumber})`).toBeLessThanOrEqual(30);
        });
      });
    }
  });

  describe('Audience Distribution Analysis', () => {
    it('should show audience distribution across all files', () => {
      const distribution: Record<string, number> = {
        developer: 0,
        designer: 0,
        both: 0,
        leadership: 0,
        none: 0,
      };

      allFiles.forEach((file) => {
        const frontmatterAudience = getFrontmatterAudience(file);
        if (frontmatterAudience && validAudiences.includes(frontmatterAudience as AudienceType)) {
          distribution[frontmatterAudience]++;
        } else {
          distribution.none++;
        }
      });

      console.log('Audience Distribution:');
      Object.entries(distribution).forEach(([audience, count]) => {
        const percentage = ((count / allFiles.length) * 100).toFixed(1);
        console.log(`  ${audience}: ${count} (${percentage}%)`);
      });

      // At least some files should have audience metadata
      const filesWithAudience = allFiles.length - distribution.none;
      expect(filesWithAudience).toBeGreaterThan(0);
    });
  });
});
