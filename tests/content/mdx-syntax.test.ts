import { describe, it, expect } from 'vitest';
import {
  getAllMDXFiles,
  hasUnclosedCodeBlocks,
  hasBrokenMermaidBlocks,
  hasInvalidImports,
  hasDuplicateImports,
} from '../utils/mdx-parser';

describe('MDX Syntax Validation', () => {
  it('should not have unclosed code blocks', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (hasUnclosedCodeBlocks(file.content)) {
        const codeBlockCount = (file.content.match(/```/g) || []).length;
        errors.push(`${file.relativePath}: Unclosed code blocks (found ${codeBlockCount} triple-backticks, must be even)`);
      }
    }

    if (errors.length > 0) {
      console.error('Unclosed code block errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have broken Mermaid blocks', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (hasBrokenMermaidBlocks(file.content)) {
        errors.push(`${file.relativePath}: Broken Mermaid blocks (\`\`\`mermaid without proper closing \`\`\`)`);
      }
    }

    if (errors.length > 0) {
      console.error('Broken Mermaid block errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have valid import statements', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (hasInvalidImports(file.content)) {
        const importLines = file.content.split('\n')
          .filter(line => line.trim().startsWith('import'))
          .filter(line => !line.includes('from') || (!line.includes("'") && !line.includes('"')));

        errors.push(`${file.relativePath}: Invalid import statements found:\n  ${importLines.join('\n  ')}`);
      }
    }

    if (errors.length > 0) {
      console.error('Invalid import errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have duplicate imports', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (hasDuplicateImports(file.content)) {
        const importLines = file.content.split('\n').filter(line => line.trim().startsWith('import'));
        const seen = new Map<string, number>();

        for (const line of importLines) {
          const normalized = line.trim();
          seen.set(normalized, (seen.get(normalized) || 0) + 1);
        }

        const duplicates = Array.from(seen.entries())
          .filter(([_, count]) => count > 1)
          .map(([line, count]) => `  "${line}" (${count} times)`);

        if (duplicates.length > 0) {
          errors.push(`${file.relativePath}: Duplicate imports:\n${duplicates.join('\n')}`);
        }
      }
    }

    if (errors.length > 0) {
      console.error('Duplicate import errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have HTML comments that could break MDX', async () => {
    const files = await getAllMDXFiles();
    const warnings: string[] = [];

    for (const file of files) {
      // Check for HTML comments in non-code-block areas
      const codeBlockRegex = /```[\s\S]*?```/g;
      const contentWithoutCodeBlocks = file.content.replace(codeBlockRegex, '');

      if (/<!--[\s\S]*?-->/.test(contentWithoutCodeBlocks)) {
        warnings.push(`${file.relativePath}: Contains HTML comments (<!-- -->) which may cause MDX issues`);
      }
    }

    // This is a warning, not a hard error, so we just log it
    if (warnings.length > 0) {
      console.warn('HTML comment warnings:\n' + warnings.join('\n'));
    }

    // Don't fail the test, just check the data is collected
    expect(files.length).toBeGreaterThan(0);
  });

  it('should have properly formatted JSX components', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      // Check for common JSX issues
      const lines = file.content.split('\n');
      let inCodeBlock = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Track code blocks
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          continue;
        }

        // Skip lines inside code blocks, inline code, or markdown tables
        if (inCodeBlock || line.includes('`<') || line.includes('|')) {
          continue;
        }

        // Check for unclosed JSX tags (basic check)
        if (/<[A-Z][a-zA-Z]*\s+/.test(line) && !line.includes('/>') && !line.includes('</')) {
          // This might be a multi-line component, check if closing tag exists nearby
          const componentName = line.match(/<([A-Z][a-zA-Z]*)/)?.[1];
          if (componentName) {
            const nextLines = lines.slice(i, i + 10).join('\n');
            if (!nextLines.includes(`</${componentName}>`) && !nextLines.includes('/>')) {
              errors.push(`${file.relativePath}:${i + 1}: Potentially unclosed JSX component <${componentName}>`);
            }
          }
        }
      }
    }

    if (errors.length > 0) {
      console.error('JSX formatting errors:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });
});
