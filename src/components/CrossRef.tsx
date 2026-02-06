import React from 'react';
import Link from '@docusaurus/Link';

interface RelatedArticle {
  path: string;
  label: string;
}

interface CrossRefProps {
  related: RelatedArticle[];
}

export default function CrossRef({ related }: CrossRefProps): React.JSX.Element {
  if (!related || related.length === 0) return null;

  return (
    <div className="cross-ref-container">
      <div className="cross-ref-grid">
        {related.map((article, idx) => (
          <Link key={idx} to={article.path} className="cross-ref-card">
            <span className="cross-ref-icon">📎</span>
            <span className="cross-ref-label">{article.label}</span>
            <span className="cross-ref-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
