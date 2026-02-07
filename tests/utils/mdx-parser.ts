import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import fg from 'fast-glob';

export interface MDXFile {
  path: string;
  relativePath: string;
  frontmatter: Record<string, any>;
  content: string;
  category: string;
}

export async function getAllMDXFiles(): Promise<MDXFile[]> {
  const docsDir = join(process.cwd(), 'docs');
  const pattern = 'docs/**/*.mdx';

  const files = await fg(pattern, { cwd: process.cwd() });

  return files.map(filePath => {
    const fullPath = join(process.cwd(), filePath);
    const fileContent = readFileSync(fullPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Extract category from path (e.g., "01-design-system-overview")
    const pathParts = filePath.split('/');
    const category = pathParts[1] || 'unknown';
    const relativePath = filePath.replace('docs/', '');

    return {
      path: fullPath,
      relativePath,
      frontmatter,
      content,
      category,
    };
  });
}

export function countCodeBlocks(content: string): number {
  const matches = content.match(/```/g);
  return matches ? matches.length / 2 : 0;
}

export function hasSection(content: string, sectionTitle: string): boolean {
  const regex = new RegExp(`^##\\s+${sectionTitle}`, 'm');
  return regex.test(content);
}

export function hasComponent(content: string, componentName: string): boolean {
  const importRegex = new RegExp(`import\\s+${componentName}\\s+from`, 'm');
  const usageRegex = new RegExp(`<${componentName}[\\s/>]`, 'm');
  return importRegex.test(content) && usageRegex.test(content);
}

export function getFirstNLines(content: string, n: number): string {
  return content.split('\n').slice(0, n).join('\n');
}

export function countLines(content: string): number {
  return content.split('\n').length;
}

export function hasTableOrList(content: string): boolean {
  // Check for markdown tables (|) or lists (-, *, 1.)
  // Also accept MDX horizontal rules (---) as they serve similar structural purposes
  return /\|.*\|/.test(content) ||
         /^[\s]*[-*]\s+/m.test(content) ||
         /^[\s]*\d+\.\s+/m.test(content) ||
         /^---$/m.test(content);
}

export function hasEmptySections(content: string): boolean {
  // Check for consecutive headings with no content between
  const lines = content.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].startsWith('##') && lines[i + 1].startsWith('##')) {
      return true;
    }
  }
  return false;
}

export function hasTodoComments(content: string): boolean {
  // Strip code blocks first to avoid false positives from code examples
  const codeBlockRegex = /```[\s\S]*?```/g;
  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');

  // Match whole words only (not substrings like "autodocs")
  return /\b(TODO|FIXME|HACK)\b/i.test(contentWithoutCodeBlocks);
}

export function hasUnclosedCodeBlocks(content: string): boolean {
  const matches = content.match(/```/g);
  return matches ? matches.length % 2 !== 0 : false;
}

export function hasBrokenMermaidBlocks(content: string): boolean {
  const mermaidStarts = (content.match(/```mermaid/g) || []).length;
  const codeBlockEnds = (content.match(/```/g) || []).length;

  // If we have mermaid blocks, they must be properly closed
  if (mermaidStarts > 0) {
    // Each ```mermaid needs a closing ```
    return codeBlockEnds < mermaidStarts * 2;
  }

  return false;
}

export function hasInvalidImports(content: string): boolean {
  // Strip code blocks first to avoid false positives from code examples
  const codeBlockRegex = /```[\s\S]*?```/g;
  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');

  // Check for imports without proper 'from' clause
  const importLines = contentWithoutCodeBlocks.split('\n').filter(line => line.trim().startsWith('import'));

  for (const line of importLines) {
    if (!line.includes('from') || !line.includes("'") && !line.includes('"')) {
      return true;
    }
  }

  return false;
}

export function hasDuplicateImports(content: string): boolean {
  // Strip code blocks first to avoid false positives from code examples
  const codeBlockRegex = /```[\s\S]*?```/g;
  const contentWithoutCodeBlocks = content.replace(codeBlockRegex, '');

  const importLines = contentWithoutCodeBlocks.split('\n').filter(line => line.trim().startsWith('import'));
  const seen = new Set<string>();

  for (const line of importLines) {
    const normalized = line.trim();
    if (seen.has(normalized)) {
      return true;
    }
    seen.add(normalized);
  }

  return false;
}
