import React from 'react';
import Link from '@docusaurus/Link';

interface CategoryCardProps {
  emoji: string;
  title: string;
  description: string;
  articleCount: number;
  href: string;
}

export default function CategoryCard({ emoji, title, description, articleCount, href }: CategoryCardProps): React.JSX.Element {
  return (
    <Link to={href} className="category-card">
      <div className="category-card-emoji">{emoji}</div>
      <div className="category-card-content">
        <h3 className="category-card-title">{title}</h3>
        <p className="category-card-description">{description}</p>
        <span className="category-card-count">{articleCount} articles</span>
      </div>
    </Link>
  );
}
