import React from 'react';

interface ArticleMetaProps {
  source?: string;
  sourceUrl?: string;
  author?: string;
  tags?: string[];
}

export default function ArticleMeta({ source, sourceUrl, author, tags }: ArticleMetaProps): React.JSX.Element {
  return (
    <div className="article-meta">
      {source && (
        <div className="article-meta-source">
          📖 Source: {sourceUrl ? <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{source}</a> : source}
        </div>
      )}
      {author && <div className="article-meta-author">✍️ {author}</div>}
      {tags && tags.length > 0 && (
        <div className="article-meta-tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="article-meta-tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
