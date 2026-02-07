import React from 'react';

interface BrowserSupportData {
  feature: string;
  chrome: string;
  firefox: string;
  safari: string;
  edge: string;
}

interface BrowserSupportProps {
  data?: BrowserSupportData[];
  feature?: string;
  chrome?: string;
  firefox?: string;
  safari?: string;
  edge?: string;
}

function getSupportClass(version: string): string {
  const lower = version.toLowerCase();
  if (lower === 'yes' || lower.includes('✓') || /^\d+$/.test(version) || /^\d+\.\d+/.test(version)) {
    return 'supported';
  }
  if (lower === 'no' || lower.includes('✗')) {
    return 'unsupported';
  }
  return 'partial';
}

export default function BrowserSupport({ data, feature, chrome, firefox, safari, edge }: BrowserSupportProps) {
  const rows: BrowserSupportData[] = data ?? [
    { feature: feature ?? '', chrome: chrome ?? '-', firefox: firefox ?? '-', safari: safari ?? '-', edge: edge ?? '-' },
  ];

  return (
    <div className="browser-support">
      <table className="browser-support__table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Chrome</th>
            <th>Firefox</th>
            <th>Safari</th>
            <th>Edge</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.feature}</td>
              <td className={`browser-support__cell--${getSupportClass(row.chrome)}`}>
                {row.chrome}
              </td>
              <td className={`browser-support__cell--${getSupportClass(row.firefox)}`}>
                {row.firefox}
              </td>
              <td className={`browser-support__cell--${getSupportClass(row.safari)}`}>
                {row.safari}
              </td>
              <td className={`browser-support__cell--${getSupportClass(row.edge)}`}>
                {row.edge}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
