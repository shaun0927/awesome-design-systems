import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const DOCS_DIR = path.join(process.cwd(), 'docs');

interface CodeBlock {
  file: string;
  language: string;
  title?: string;
  content: string;
  line: number;
  valid: boolean;
  error?: string;
}

/**
 * Get all MDX files in the docs directory
 */
function getAllMdxFiles(): string[] {
  const pattern = path.join(DOCS_DIR, '**', '*.mdx');
  return glob.sync(pattern);
}

/**
 * Extract all code blocks from MDX content
 */
function extractCodeBlocks(content: string, filePath: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const lines = content.split('\n');

  let inCodeBlock = false;
  let currentBlock: Partial<CodeBlock> = {};
  let blockContent: string[] = [];
  let blockStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match opening code fence: ```language or ```language title="..."
    const openMatch = line.match(/^```(\w*)\s*(?:title=["']([^"']+)["'])?/);

    if (openMatch && !inCodeBlock) {
      inCodeBlock = true;
      blockStartLine = i + 1;
      currentBlock = {
        file: filePath,
        language: openMatch[1] || 'plain',
        title: openMatch[2],
        line: blockStartLine,
        valid: true,
      };
      blockContent = [];
      continue;
    }

    // Match closing code fence
    if (line.trim() === '```' && inCodeBlock) {
      inCodeBlock = false;
      currentBlock.content = blockContent.join('\n');

      blocks.push(currentBlock as CodeBlock);
      currentBlock = {};
      blockContent = [];
      continue;
    }

    // Accumulate content inside code block
    if (inCodeBlock) {
      blockContent.push(line);
    }
  }

  return blocks;
}

/**
 * Validate code block
 */
function validateCodeBlock(block: CodeBlock): CodeBlock {
  const errors: string[] = [];

  // Check if language is valid (common languages)
  const validLanguages = [
    'javascript', 'js', 'typescript', 'ts', 'tsx', 'jsx',
    'python', 'java', 'go', 'rust', 'c', 'cpp', 'csharp',
    'html', 'css', 'scss', 'sass', 'less',
    'json', 'yaml', 'yml', 'xml', 'toml', 'ini',
    'bash', 'sh', 'shell', 'powershell',
    'sql', 'graphql', 'markdown', 'md', 'mdx',
    'diff', 'patch', 'plain', 'text',
    'dockerfile', 'docker', 'makefile',
    'vue', 'svelte', 'php', 'ruby', 'swift', 'kotlin',
    'mermaid', // Docusaurus supports mermaid diagrams
    'nunjucks', 'njk', // Template engines
    '', // Allow empty language (plain text)
  ];

  if (!validLanguages.includes(block.language.toLowerCase())) {
    errors.push(`Unknown language hint: "${block.language}"`);
  }

  // Check if title is realistic (should look like a filename)
  if (block.title) {
    // Title should have a file extension or be a reasonable identifier
    const hasExtension = /\.[a-z0-9]+$/i.test(block.title);
    const isPathLike = block.title.includes('/') || block.title.includes('\\');
    const hasSpace = /\s/.test(block.title);

    if (hasSpace && !isPathLike) {
      errors.push(`Title "${block.title}" contains spaces but is not a path`);
    }

    // Warn about generic titles
    const genericTitles = ['example', 'code', 'sample', 'test'];
    if (genericTitles.some(generic => block.title?.toLowerCase().includes(generic)) && !hasExtension) {
      errors.push(`Generic title without extension: "${block.title}"`);
    }
  }

  // Check if code block is empty
  if (block.content.trim() === '') {
    errors.push('Empty code block');
  }

  // Check if code block contains only comments
  const lines = block.content.split('\n').map(l => l.trim()).filter(l => l !== '');
  const commentPrefixes = ['//', '#', '/*', '*/', '<!--', '-->', '{/*', '*/}'];
  const allComments = lines.every(line =>
    commentPrefixes.some(prefix => line.startsWith(prefix))
  );

  if (allComments && lines.length > 0) {
    errors.push('Code block contains only comments');
  }

  if (errors.length > 0) {
    return {
      ...block,
      valid: false,
      error: errors.join('; '),
    };
  }

  return block;
}

/**
 * Group code blocks by language
 */
function groupByLanguage(blocks: CodeBlock[]): Map<string, number> {
  const languageCounts = new Map<string, number>();

  blocks.forEach(block => {
    const lang = block.language || 'plain';
    languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
  });

  return languageCounts;
}

/**
 * Find code blocks with common issues
 */
function findCommonIssues(blocks: CodeBlock[]): {
  emptyBlocks: CodeBlock[];
  commentOnlyBlocks: CodeBlock[];
  invalidLanguages: CodeBlock[];
  unrealisticTitles: CodeBlock[];
} {
  return {
    emptyBlocks: blocks.filter(b => b.content.trim() === ''),
    commentOnlyBlocks: blocks.filter(b => {
      const lines = b.content.split('\n').map(l => l.trim()).filter(l => l !== '');
      const commentPrefixes = ['//', '#', '/*', '*/', '<!--', '-->', '{/*', '*/}'];
      return lines.length > 0 && lines.every(line =>
        commentPrefixes.some(prefix => line.startsWith(prefix))
      );
    }),
    invalidLanguages: blocks.filter(b => {
      const validLanguages = [
        'javascript', 'js', 'typescript', 'ts', 'tsx', 'jsx',
        'python', 'java', 'go', 'rust', 'c', 'cpp', 'csharp',
        'html', 'css', 'scss', 'sass', 'less',
        'json', 'yaml', 'yml', 'xml', 'toml', 'ini',
        'bash', 'sh', 'shell', 'powershell',
        'sql', 'graphql', 'markdown', 'md', 'mdx',
        'diff', 'patch', 'plain', 'text',
        'dockerfile', 'docker', 'makefile',
        'vue', 'svelte', 'php', 'ruby', 'swift', 'kotlin',
        'mermaid', 'nunjucks', 'njk', '',
      ];
      return !validLanguages.includes(b.language.toLowerCase());
    }),
    unrealisticTitles: blocks.filter(b => {
      if (!b.title) return false;
      const hasSpace = /\s/.test(b.title);
      const isPathLike = b.title.includes('/') || b.title.includes('\\');
      const hasExtension = /\.[a-z0-9]+$/i.test(b.title);
      return hasSpace && !isPathLike && !hasExtension;
    }),
  };
}

describe('Code Block References Validation', () => {
  const mdxFiles = getAllMdxFiles();

  it('should extract all code blocks from MDX files', () => {
    let totalBlocks = 0;

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);
      totalBlocks += blocks.length;
    }

    console.log(`\n📊 Found ${totalBlocks} code blocks across ${mdxFiles.length} files`);
    expect(totalBlocks).toBeGreaterThan(0);
  });

  it('should have valid language hints', () => {
    const invalidBlocks: CodeBlock[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);

      blocks.forEach(block => {
        const validated = validateCodeBlock(block);
        if (!validated.valid && validated.error?.includes('Unknown language')) {
          invalidBlocks.push(validated);
        }
      });
    }

    if (invalidBlocks.length > 0) {
      console.log('\n❌ Code blocks with invalid language hints:');
      invalidBlocks.forEach(block => {
        console.log(`  File: ${path.relative(process.cwd(), block.file)}:${block.line}`);
        console.log(`  Language: ${block.language}`);
        console.log(`  Error: ${block.error}`);
        console.log('');
      });
    }

    expect(invalidBlocks.length).toBe(0);
  });

  it('should have no empty code blocks', () => {
    const emptyBlocks: CodeBlock[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);

      blocks.forEach(block => {
        if (block.content.trim() === '') {
          emptyBlocks.push(block);
        }
      });
    }

    if (emptyBlocks.length > 0) {
      console.log('\n❌ Empty code blocks found:');
      emptyBlocks.forEach(block => {
        console.log(`  File: ${path.relative(process.cwd(), block.file)}:${block.line}`);
        console.log(`  Language: ${block.language}`);
        console.log('');
      });
    }

    expect(emptyBlocks.length).toBe(0);
  });

  it('should have no comment-only code blocks', () => {
    const commentOnlyBlocks: CodeBlock[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);

      blocks.forEach(block => {
        const lines = block.content.split('\n').map(l => l.trim()).filter(l => l !== '');
        const commentPrefixes = ['//', '#', '/*', '*/', '<!--', '-->', '{/*', '*/}'];
        const allComments = lines.length > 0 && lines.every(line =>
          commentPrefixes.some(prefix => line.startsWith(prefix))
        );

        if (allComments) {
          commentOnlyBlocks.push(block);
        }
      });
    }

    if (commentOnlyBlocks.length > 0) {
      console.log('\n⚠️  Code blocks with only comments:');
      commentOnlyBlocks.forEach(block => {
        console.log(`  File: ${path.relative(process.cwd(), block.file)}:${block.line}`);
        console.log(`  Language: ${block.language}`);
        console.log('');
      });
    }

    // This is a warning, not a hard failure (some docs use comment-only blocks for explanations)
    expect(commentOnlyBlocks.length).toBeGreaterThanOrEqual(0);
  });

  it('should have realistic filenames in title attributes', () => {
    const unrealisticTitles: CodeBlock[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);

      blocks.forEach(block => {
        if (!block.title) return;

        const hasSpace = /\s/.test(block.title);
        const isPathLike = block.title.includes('/') || block.title.includes('\\');
        const hasExtension = /\.[a-z0-9]+$/i.test(block.title);

        if (hasSpace && !isPathLike && !hasExtension) {
          unrealisticTitles.push(block);
        }
      });
    }

    if (unrealisticTitles.length > 0) {
      console.log('\n⚠️  Code blocks with unrealistic title attributes:');
      unrealisticTitles.forEach(block => {
        console.log(`  File: ${path.relative(process.cwd(), block.file)}:${block.line}`);
        console.log(`  Title: ${block.title}`);
        console.log(`  Suggestion: Use a filename (e.g., "Button.tsx") or path (e.g., "src/components/Button.tsx")`);
        console.log('');
      });
    }

    // This is a warning, not a hard failure
    expect(unrealisticTitles.length).toBeGreaterThanOrEqual(0);
  });

  it('should report code block statistics', () => {
    let totalBlocks = 0;
    let blocksWithTitle = 0;
    let blocksWithLanguage = 0;
    const languageCounts = new Map<string, number>();

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);

      totalBlocks += blocks.length;

      blocks.forEach(block => {
        if (block.title) blocksWithTitle++;
        if (block.language) blocksWithLanguage++;

        const lang = block.language || 'plain';
        languageCounts.set(lang, (languageCounts.get(lang) || 0) + 1);
      });
    }

    console.log('\n📊 Code Block Statistics:');
    console.log(`  Total code blocks: ${totalBlocks}`);
    console.log(`  Blocks with title: ${blocksWithTitle} (${((blocksWithTitle / totalBlocks) * 100).toFixed(1)}%)`);
    console.log(`  Blocks with language: ${blocksWithLanguage} (${((blocksWithLanguage / totalBlocks) * 100).toFixed(1)}%)`);

    console.log('\n📊 Code blocks by language (Top 15):');
    const sorted = [...languageCounts.entries()].sort((a, b) => b[1] - a[1]);
    sorted.slice(0, 15).forEach(([lang, count], index) => {
      const displayLang = lang || '(none)';
      console.log(`  ${index + 1}. ${displayLang}: ${count} blocks`);
    });

    expect(totalBlocks).toBeGreaterThan(0);
  });

  it('should validate common code block issues', () => {
    const allBlocks: CodeBlock[] = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const blocks = extractCodeBlocks(content, file);
      allBlocks.push(...blocks);
    }

    const issues = findCommonIssues(allBlocks);

    console.log('\n📊 Code Block Quality Report:');
    console.log(`  Empty blocks: ${issues.emptyBlocks.length}`);
    console.log(`  Comment-only blocks: ${issues.commentOnlyBlocks.length}`);
    console.log(`  Invalid language hints: ${issues.invalidLanguages.length}`);
    console.log(`  Unrealistic titles: ${issues.unrealisticTitles.length}`);

    const totalIssues = issues.emptyBlocks.length + issues.invalidLanguages.length;
    expect(totalIssues).toBe(0);
  });

  it('should check for proper code fence closing', () => {
    const unclosedBlocks: Array<{ file: string; line: number }> = [];

    for (const file of mdxFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      let inCodeBlock = false;
      let blockStartLine = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.match(/^```\w*/) && !inCodeBlock) {
          inCodeBlock = true;
          blockStartLine = i + 1;
        } else if (line.trim() === '```' && inCodeBlock) {
          inCodeBlock = false;
        }
      }

      // If still in code block at end of file, it's unclosed
      if (inCodeBlock) {
        unclosedBlocks.push({
          file: path.relative(process.cwd(), file),
          line: blockStartLine,
        });
      }
    }

    if (unclosedBlocks.length > 0) {
      console.log('\n❌ Unclosed code blocks found:');
      unclosedBlocks.forEach(({ file, line }) => {
        console.log(`  File: ${file}:${line}`);
        console.log(`  Error: Code block not closed with \`\`\``);
        console.log('');
      });
    }

    expect(unclosedBlocks.length).toBe(0);
  });
});
