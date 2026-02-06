# 🧩 Component Design Patterns

> How to design, structure, and compose components: from atomic elements like buttons to complex composable patterns like cards, slots, subcomponents, and state management.

## Articles

| # | Title | Key Topics |
|---|-------|------------|
| 1 | [버튼 컴포넌트 12가지 팁](./01-버튼-컴포넌트-12가지-팁.md) | primary button, variants, sizing, iconography |
| 2 | [Right-Sizing: 컴포넌트 계층 구조 설계](./02-right-sizing-컴포넌트-계층-구조-설계.md) | hierarchical layers, composition, small to large |
| 3 | [Cards and Composability - 컴포저블 컴포넌트 설계](./03-cards-and-composability---컴포저블-컴포넌트-설계.md) | structure, content, style, behavior, flexibility |
| 4 | [Subcomponents - 조합 가능한 부품 제공](./04-subcomponents---조합-가능한-부품-제공.md) | configurable vs composable, reducing dependencies |
| 5 | [Slots in Design Systems - 조합의 철학](./05-slots-in-design-systems---조합의-철학.md) | slot architecture, custom content insertion, flexibility |
| 6 | [Figma Slots for Repeating Items](./06-figma-slots-for-repeating-items.md) | native slots, repeating patterns, min/max constraints |
| 7 | [States Management - 상태 관리의 정석](./07-states-management---상태-관리의-정석.md) | interactive vs disabled vs validation, separate properties |
| 8 | [Code Only Props - 비시각적 속성 관리](./08-code-only-props---비시각적-속성-관리.md) | accessibility, semantic HTML, non-visual attributes |
| 9 | [Components as Data - 플랫폼 독립적 정의](./09-components-as-data---플랫폼-독립적-정의.md) | YAML/JSON structure, anatomy, single source of truth |
| 10 | [Variants Analysis - 데이터 기반 컴포넌트](./10-variants-analysis---데이터-기반-컴포넌트.md) | Figma API extraction, deterministic analysis, completeness |
| 11 | [IKEA 디자인 시스템 Skapa 분석](./11-ikea-디자인-시스템-skapa-분석---스마트-카드-컴포넌트-구축법.md) | 80% coverage, card variants, documentation as validation |
| 12 | [Dealing with Dependencies Inside Design Systems](./12-dealing-with-dependencies-inside-design-systems.md) | dependency chains, icon dependencies, versioning impact |

## Key Takeaways

- **Composability over configuration**: For uncommon variants, provide subcomponents and slots instead of endless props—this reduces API surface and empowers adopters to compose their own solutions
- **State properties should separate concerns**: Don't bundle interactive states (hover/focus), disabled states, and validation states into one "state" prop—separate them for clarity and automation compatibility
- **Components are hierarchical, not flat**: Design systems are layered tapestries where icons embed in buttons, buttons embed in cards, and cards embed in grids—understand and document these dependencies
- **80% coverage is ambitious and intentional**: A single card component covering 80% of use cases is a strategic goal, not a guarantee—accept that edge cases may need separate components
- **Document to validate design**: Writing component specs reveals blind spots in your design—accessibility needs, behavioral edge cases, and platform differences surface during documentation, not after

## Related Categories

- [🎨 Design Tokens](../01-design-tokens/) - Components consume tokens to enable theming and maintain visual consistency
- [📝 Component Documentation](../04-component-documentation/) - Clear documentation of slots, props, and composition patterns is essential for adoption
- [🔧 Figma & Design Tooling](../11-figma-tooling/) - Figma native slots, variants analysis, and component-specific variables support composability
- [🏗️ Scaling & Architecture](../08-scaling-architecture/) - Dependency chains and compositional hierarchies grow complex as systems scale across products

---

[← Back to Main](../README.md)
