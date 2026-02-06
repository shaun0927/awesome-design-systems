import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CategoryCard from '../components/CategoryCard';

const categories = [
  { emoji: '🎨', title: 'Design Tokens', description: '토큰 아키텍처, 네이밍, 자동화', count: 9, href: '/docs/category/01-design-tokens' },
  { emoji: '🧱', title: 'Visual Foundations', description: '컬러, 타이포그래피, 스페이싱', count: 8, href: '/docs/category/02-visual-foundations' },
  { emoji: '🧩', title: 'Component Design', description: '버튼, 카드, 슬롯, 상태 관리', count: 12, href: '/docs/category/03-component-design' },
  { emoji: '📝', title: 'Documentation', description: '컴포넌트 문서화, 명세서, 온보딩', count: 9, href: '/docs/category/04-component-documentation' },
  { emoji: '✅', title: 'Quality & Testing', description: 'QA 워크플로우, Figma 테스팅', count: 5, href: '/docs/category/05-quality-testing' },
  { emoji: '♿', title: 'Accessibility', description: 'WCAG 준수, 접근성 감사', count: 3, href: '/docs/category/06-accessibility' },
  { emoji: '⚙️', title: 'Governance', description: '거버넌스 모델, 지원 워크플로우', count: 5, href: '/docs/category/07-governance-operations' },
  { emoji: '🏗️', title: 'Scaling', description: '티어 시스템, 멀티 라이브러리', count: 6, href: '/docs/category/08-scaling-architecture' },
  { emoji: '📦', title: 'Versioning', description: '시맨틱 버저닝, 릴리스 주기', count: 3, href: '/docs/category/09-versioning-releases' },
  { emoji: '🔄', title: 'Evolution', description: '세대 전환, 디자인 전략', count: 4, href: '/docs/category/10-generations-evolution' },
  { emoji: '🔧', title: 'Figma & Tooling', description: 'Figma Make, MCP, AI 도구', count: 9, href: '/docs/category/11-figma-tooling' },
  { emoji: '🌐', title: 'Web Design & CSS', description: '반응형, 애니메이션, 3D 효과', count: 8, href: '/docs/category/12-web-design-craft' },
];

const readingPaths = [
  {
    level: '🌱 Beginner',
    subtitle: 'Foundations First',
    description: '디자인 시스템의 기초부터 시작하세요',
    categories: ['Design Tokens', 'Visual Foundations', 'Web Design & CSS'],
    links: ['/docs/category/01-design-tokens', '/docs/category/02-visual-foundations', '/docs/category/12-web-design-craft'],
  },
  {
    level: '🌿 Intermediate',
    subtitle: 'Component Mastery',
    description: '컴포넌트 설계와 문서화를 마스터하세요',
    categories: ['Component Design', 'Documentation', 'Quality & Testing', 'Accessibility'],
    links: ['/docs/category/03-component-design', '/docs/category/04-component-documentation', '/docs/category/05-quality-testing', '/docs/category/06-accessibility'],
  },
  {
    level: '🌳 Advanced',
    subtitle: 'System Strategy',
    description: '조직 차원의 전략과 도구를 학습하세요',
    categories: ['Governance', 'Scaling', 'Versioning', 'Evolution', 'Figma & Tooling'],
    links: ['/docs/category/07-governance-operations', '/docs/category/08-scaling-architecture', '/docs/category/09-versioning-releases', '/docs/category/10-generations-evolution', '/docs/category/11-figma-tooling'],
  },
];

export default function Home(): React.JSX.Element {
  return (
    <Layout title="Home" description="디자인 시스템 지식 베이스 — 81개 아티클, 12개 카테고리">
      {/* Hero */}
      <header className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Awesome Design Systems</h1>
          <p className="hero-subtitle">
            81개 전문 아티클로 구성된 디자인 시스템 지식 베이스
          </p>
          <p className="hero-description">
            디자인 토큰부터 컴포넌트 설계, 거버넌스, 스케일링까지 — 12개 카테고리로 정리된 실전 노하우
          </p>
          <div className="hero-actions">
            <Link to="/docs/category/01-design-tokens" className="hero-btn hero-btn-primary">
              시작하기 →
            </Link>
            <Link to="https://github.com/shaun0927/awesome-design-systems" className="hero-btn hero-btn-secondary">
              GitHub
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Stats */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">81</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Categories</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">17K+</span>
              <span className="stat-label">Lines</span>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="categories-section">
          <h2 className="section-title">📚 Knowledge Base</h2>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={idx}
                emoji={cat.emoji}
                title={cat.title}
                description={cat.description}
                articleCount={cat.count}
                href={cat.href}
              />
            ))}
          </div>
        </section>

        {/* Reading Path */}
        <section className="reading-path-section">
          <h2 className="section-title">🗺️ Reading Path</h2>
          <div className="reading-path-grid">
            {readingPaths.map((path, idx) => (
              <div key={idx} className="reading-path-card">
                <h3 className="reading-path-level">{path.level}</h3>
                <h4 className="reading-path-subtitle">{path.subtitle}</h4>
                <p className="reading-path-description">{path.description}</p>
                <ul className="reading-path-list">
                  {path.categories.map((cat, i) => (
                    <li key={i}>
                      <Link to={path.links[i]}>{cat}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
