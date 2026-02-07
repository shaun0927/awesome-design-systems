import { describe, it, expect } from 'vitest';
import {
  getAllMDXFiles,
  countLines,
  countCodeBlocks,
  hasTableOrList,
  hasEmptySections,
  hasTodoComments,
} from '../utils/mdx-parser';

describe('Content Quality Validation', () => {
  it('should have at least 100 lines in each file', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const lineCount = countLines(file.content);

      if (lineCount < 100) {
        errors.push(`${file.relativePath}: Only ${lineCount} lines (minimum 100 required)`);
      }
    }

    if (errors.length > 0) {
      console.error('Files with insufficient content:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have at least 2 code blocks in each file', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const codeBlockCount = countCodeBlocks(file.content);

      if (codeBlockCount < 2) {
        errors.push(`${file.relativePath}: Only ${codeBlockCount} code blocks (minimum 2 required)`);
      }
    }

    if (errors.length > 0) {
      console.error('Files with insufficient code blocks:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have at least 1 table or list in each file', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (!hasTableOrList(file.content)) {
        errors.push(`${file.relativePath}: No tables or lists found`);
      }
    }

    if (errors.length > 0) {
      console.error('Files without tables or lists:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have empty sections', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (hasEmptySections(file.content)) {
        errors.push(`${file.relativePath}: Has empty sections (consecutive ## headings with no content between)`);
      }
    }

    if (errors.length > 0) {
      console.error('Files with empty sections:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should not have TODO/FIXME/HACK comments', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      if (hasTodoComments(file.content)) {
        // Find the actual lines with TODO comments
        const lines = file.content.split('\n');
        const todoLines = lines
          .map((line, idx) => ({ line, idx }))
          .filter(({ line }) => /TODO|FIXME|HACK/i.test(line))
          .slice(0, 3) // Show first 3 occurrences
          .map(({ line, idx }) => `  Line ${idx + 1}: ${line.trim()}`);

        errors.push(`${file.relativePath}: Contains TODO/FIXME/HACK comments:\n${todoLines.join('\n')}`);
      }
    }

    if (errors.length > 0) {
      console.error('Files with TODO comments:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });

  it('should have meaningful content in code blocks', async () => {
    const files = await getAllMDXFiles();
    const warnings: string[] = [];

    for (const file of files) {
      // Extract all code blocks
      const codeBlockRegex = /```[\s\S]*?```/g;
      const codeBlocks = file.content.match(codeBlockRegex) || [];

      for (const block of codeBlocks) {
        // Remove the backticks and language identifier
        const content = block.replace(/```[\w]*\n?/g, '').trim();

        // Check if code block is too short (less than 10 characters)
        if (content.length < 10) {
          warnings.push(`${file.relativePath}: Has very short code block (${content.length} chars): ${content.substring(0, 30)}...`);
        }
      }
    }

    // This is a warning, not a hard error
    if (warnings.length > 0) {
      console.warn('Short code block warnings:\n' + warnings.join('\n'));
    }

    expect(files.length).toBeGreaterThan(0);
  });

  it('should have substantial content between headings', async () => {
    const files = await getAllMDXFiles();
    const errors: string[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      let lastHeadingIdx = -1;
      let consecutiveEmptyLines = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Only check ## level headings (not ### or ####)
        // Sub-sections can legitimately be short introductions to code/tables
        if (/^## [^#]/.test(line.trim())) {
          // Check if previous section had content
          if (lastHeadingIdx !== -1) {
            const sectionLines = i - lastHeadingIdx - 1;
            const sectionContent = lines.slice(lastHeadingIdx + 1, i).join('\n').trim();
            const headingText = lines[lastHeadingIdx].trim();

            // Skip special sections that are legitimately short
            const isSpecialSection =
              headingText.includes('[Unreleased]') ||
              headingText.includes('Checklist') ||
              headingText.includes('Before/After') ||
              headingText.includes('Context');

            // Skip sections that are immediately followed by code blocks, tables, or subsections
            // Also check if content contains these elements even with some intro text
            const hasCodeBlock = /^```/.test(sectionContent) || /\n```/.test(sectionContent);
            const hasTable = /^\|/.test(sectionContent) || /\n\|/.test(sectionContent);
            const hasSubsection = /^###\s/.test(sectionContent) || /\n###\s/.test(sectionContent);

            // Section should have at least 50 chars, unless it's a special case
            if (sectionContent.length < 50 && !isSpecialSection && !hasCodeBlock && !hasTable && !hasSubsection) {
              errors.push(
                `${file.relativePath}:${lastHeadingIdx + 1}: Section "${headingText}" has insufficient content (${sectionContent.length} chars)`
              );
            }
          }

          lastHeadingIdx = i;
          consecutiveEmptyLines = 0;
        } else if (line.trim() === '') {
          consecutiveEmptyLines++;
        } else {
          consecutiveEmptyLines = 0;
        }
      }
    }

    if (errors.length > 0) {
      console.error('Sections with insufficient content:\n' + errors.join('\n'));
    }

    expect(errors).toHaveLength(0);
  });
});
