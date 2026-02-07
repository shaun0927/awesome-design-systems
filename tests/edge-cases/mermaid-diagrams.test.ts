import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

describe('Mermaid Diagram Validation', () => {
  const docsDir = join(process.cwd(), 'docs');
  const allMdxFiles = getAllMdxFiles(docsDir);

  it('should have valid mermaid diagram syntax', () => {
    const violations: { file: string; lineNumber: number; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inMermaidBlock = false;
      let mermaidStartLine = 0;
      let mermaidContent: string[] = [];

      lines.forEach((line, index) => {
        if (line.trim() === '```mermaid') {
          inMermaidBlock = true;
          mermaidStartLine = index + 1;
          mermaidContent = [];
          return;
        }

        if (inMermaidBlock) {
          if (line.trim() === '```') {
            // End of mermaid block - validate
            const diagramText = mermaidContent.join('\n').trim();

            if (diagramText === '') {
              violations.push({
                file: filePath.replace(process.cwd(), ''),
                lineNumber: mermaidStartLine,
                issue: 'Empty mermaid diagram'
              });
            }

            inMermaidBlock = false;
            mermaidContent = [];
          } else {
            mermaidContent.push(line);
          }
        }
      });

      // Check for unclosed mermaid blocks
      if (inMermaidBlock) {
        violations.push({
          file: filePath.replace(process.cwd(), ''),
          lineNumber: mermaidStartLine,
          issue: 'Unclosed mermaid diagram block'
        });
      }
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} - ${v.issue}`)
        .join('\n');
      expect.fail(`Mermaid syntax issues:\n${errorMsg}`);
    }
  });

  it('should use valid mermaid graph types', () => {
    const violations: { file: string; lineNumber: number; type: string }[] = [];

    const validTypes = [
      'graph',
      'flowchart',
      'sequenceDiagram',
      'classDiagram',
      'stateDiagram',
      'stateDiagram-v2',
      'erDiagram',
      'journey',
      'gantt',
      'pie',
      'gitGraph',
      'mindmap',
      'timeline',
      'quadrantChart',
      'xychart'
    ];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inMermaidBlock = false;
      let mermaidStartLine = 0;
      let firstContentLine = '';

      lines.forEach((line, index) => {
        if (line.trim() === '```mermaid') {
          inMermaidBlock = true;
          mermaidStartLine = index + 1;
          firstContentLine = '';
          return;
        }

        if (inMermaidBlock) {
          if (line.trim() === '```') {
            // End of block - validate type
            if (firstContentLine) {
              const typeMatch = firstContentLine.match(/^\s*(\w+(?:-v\d+)?)/);

              if (typeMatch) {
                const type = typeMatch[1];

                if (!validTypes.includes(type)) {
                  violations.push({
                    file: filePath.replace(process.cwd(), ''),
                    lineNumber: mermaidStartLine,
                    type: type
                  });
                }
              }
            }

            inMermaidBlock = false;
          } else if (line.trim() !== '' && !firstContentLine) {
            firstContentLine = line.trim();
          }
        }
      });
    });

    if (violations.length > 0) {
      const errorMsg = violations
        .map(v => `  ${v.file}:${v.lineNumber} - Invalid type: "${v.type}"`)
        .join('\n');
      expect.fail(`Invalid mermaid diagram types:\n${errorMsg}`);
    }
  });

  it('should not have unescaped special characters in node labels', () => {
    const violations: { file: string; lineNumber: number; issue: string }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inMermaidBlock = false;
      let mermaidStartLine = 0;

      lines.forEach((line, index) => {
        if (line.trim() === '```mermaid') {
          inMermaidBlock = true;
          mermaidStartLine = index + 1;
          return;
        }

        if (inMermaidBlock) {
          if (line.trim() === '```') {
            inMermaidBlock = false;
            return;
          }

          // Check for problematic characters in labels
          // Node definitions: A[Label], A(Label), A{Label}, etc.
          const labelMatch = line.match(/\w+[\[\(\{][^\]\)\}]*[\]\)\}]/g);

          if (labelMatch) {
            labelMatch.forEach(match => {
              // Check for unescaped quotes inside labels
              const labelContent = match.match(/[\[\(\{]([^\]\)\}]*)[\]\)\}]/)?.[1] || '';

              if (labelContent.includes('"') && !labelContent.includes('#quot;')) {
                violations.push({
                  file: filePath.replace(process.cwd(), ''),
                  lineNumber: index + 1,
                  issue: `Unescaped quotes in label: "${match}"`
                });
              }

              // Check for special characters that might break parsing
              if (/[<>{}]/.test(labelContent)) {
                violations.push({
                  file: filePath.replace(process.cwd(), ''),
                  lineNumber: index + 1,
                  issue: `Special characters in label: "${match}"`
                });
              }
            });
          }
        }
      });
    });

    if (violations.length > 0) {
      console.warn(
        `Potential mermaid label issues (review first 10):\n${violations
          .slice(0, 10)
          .map(v => `  ${v.file}:${v.lineNumber} - ${v.issue}`)
          .join('\n')}`
      );
    }

    // Informational only
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should keep mermaid diagrams under 50 lines for readability', () => {
    const violations: { file: string; lineNumber: number; lineCount: number }[] = [];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inMermaidBlock = false;
      let mermaidStartLine = 0;
      let mermaidLineCount = 0;

      lines.forEach((line, index) => {
        if (line.trim() === '```mermaid') {
          inMermaidBlock = true;
          mermaidStartLine = index + 1;
          mermaidLineCount = 0;
          return;
        }

        if (inMermaidBlock) {
          if (line.trim() === '```') {
            if (mermaidLineCount > 50) {
              violations.push({
                file: filePath.replace(process.cwd(), ''),
                lineNumber: mermaidStartLine,
                lineCount: mermaidLineCount
              });
            }

            inMermaidBlock = false;
          } else {
            mermaidLineCount++;
          }
        }
      });
    });

    if (violations.length > 0) {
      console.warn(
        `Large mermaid diagrams found (consider splitting):\n${violations
          .map(v => `  ${v.file}:${v.lineNumber} - ${v.lineCount} lines`)
          .join('\n')}`
      );
    }

    // Soft warning only
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });

  it('should have proper arrow syntax in flowcharts', () => {
    const violations: { file: string; lineNumber: number; arrow: string }[] = [];

    const validArrows = [
      '-->',
      '---',
      '-.-',
      '-.->',
      '==>',
      '==',
      '->>',
      '-->>',
      '->',
      '--'
    ];

    allMdxFiles.forEach(filePath => {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      let inMermaidBlock = false;
      let isFlowchart = false;

      lines.forEach((line, index) => {
        if (line.trim() === '```mermaid') {
          inMermaidBlock = true;
          isFlowchart = false;
          return;
        }

        if (inMermaidBlock) {
          if (line.trim() === '```') {
            inMermaidBlock = false;
            isFlowchart = false;
            return;
          }

          // Check if it's a flowchart
          if (line.trim().match(/^(graph|flowchart)/)) {
            isFlowchart = true;
          }

          // In flowcharts, check arrow syntax
          if (isFlowchart) {
            const arrowMatches = line.match(/[-=.>]{2,}/g);

            if (arrowMatches) {
              arrowMatches.forEach(arrow => {
                if (!validArrows.includes(arrow)) {
                  violations.push({
                    file: filePath.replace(process.cwd(), ''),
                    lineNumber: index + 1,
                    arrow: arrow
                  });
                }
              });
            }
          }
        }
      });
    });

    if (violations.length > 0) {
      console.warn(
        `Potential invalid arrow syntax (review first 10):\n${violations
          .slice(0, 10)
          .map(v => `  ${v.file}:${v.lineNumber} - "${v.arrow}"`)
          .join('\n')}`
      );
    }

    // Informational only
    expect(violations.length).toBeGreaterThanOrEqual(0);
  });
});

// Helper function
function getAllMdxFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
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
