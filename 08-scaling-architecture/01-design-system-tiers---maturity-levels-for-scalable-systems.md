---
audience: developer
---

# Design System Tiers - Maturity Levels for Scalable Systems

import DevQuickStart from '@site/src/components/DevQuickStart';

<DevQuickStart
  what="디자인 시스템을 Core → Cross-Group → Within-Group 3단계 계층으로 확장하여 품질과 속도를 양립합니다"
  learn="Tier별 package.json 설정, CI 파이프라인 차이, import 패턴, 승격 경로"
  able="Tier별 품질 기준을 CI/CD에 반영하고 컴포넌트 승격 경로를 설계할 수 있습니다"
/>

## 3-Tier 아키텍처

디자인 시스템은 단일 패키지가 아닌 계층적 생태계로 확장됩니다.

```mermaid
graph TD
    T1["Tier 1: Core\nButton, Input, Card, Modal\n모든 제품에서 사용"]
    T2["Tier 2: Feature Sets\nEditor Kit, Nav Kit\n여러 그룹이 공유"]
    T3["Tier 3: Product\nSales UI, Admin Kit\n단일 그룹 내부"]

    T1 --> T2
    T2 --> T3

    style T1 fill:#51cf66,color:#fff
    style T2 fill:#339af0,color:#fff
    style T3 fill:#ffd43b,color:#000
```

## Tier별 package.json 설정

### Tier 1 - Core (최고 품질)

```json
{
  "name": "@company/core-ui",
  "version": "3.2.1",
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --coverage --min-coverage 90",
    "test:a11y": "jest-axe && pa11y-ci --config .pa11yci.json",
    "test:visual": "chromatic --project-token=$CHROMATIC_TOKEN --exit-zero-on-changes",
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "build:storybook": "storybook build",
    "size": "size-limit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "size-limit": [
    { "path": "dist/esm/index.js", "limit": "50 kB" }
  ]
}
```

### Tier 2 - Feature Set (그룹간 공유)

```json
{
  "name": "@company/editor-kit",
  "version": "1.5.0",
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --coverage --min-coverage 70",
    "test:a11y": "jest-axe",
    "build": "tsup src/index.ts --format esm --dts"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "@company/core-ui": ">=3.0.0"
  }
}
```

### Tier 3 - Within Group (그룹 내부)

```json
{
  "name": "@company/sales-ui",
  "version": "0.8.0",
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest run",
    "build": "tsup src/index.ts --format esm"
  },
  "peerDependencies": {
    "@company/core-ui": ">=3.0.0"
  }
}
```

## Import 패턴

```tsx
// Tier 1 - Core: 모든 제품에서 직접 import
import { Button, Card, Input, Modal } from '@company/core-ui';

// Tier 2 - Feature Set: 해당 기능이 필요한 제품만
import { RichTextEditor, EditorToolbar } from '@company/editor-kit';
import { TopNav, Footer } from '@company/nav-kit';

// Tier 3 - Product: 해당 그룹 내부에서만
import { SalesCard, DealPipeline } from '@company/sales-ui';
```

## Tier별 CI 파이프라인

```mermaid
flowchart TD
    subgraph "Tier 1 CI (Core)"
        L1["Lint\n(zero warnings)"] --> TC1["TypeCheck"]
        TC1 --> U1["Unit Tests\n(90%+ coverage)"]
        U1 --> A1["A11y Tests\n(axe + pa11y)"]
        A1 --> V1["Visual Regression\n(Chromatic)"]
        V1 --> S1["Bundle Size\n(size-limit)"]
        S1 --> B1["Build\n(CJS + ESM + DTS)"]
    end

    subgraph "Tier 2 CI (Feature Set)"
        L2["Lint"] --> TC2["TypeCheck"]
        TC2 --> U2["Unit Tests\n(70%+ coverage)"]
        U2 --> A2["A11y Tests\n(axe)"]
        A2 --> B2["Build\n(ESM + DTS)"]
    end

    subgraph "Tier 3 CI (Product)"
        L3["Lint"] --> U3["Unit Tests"]
        U3 --> B3["Build\n(ESM)"]
    end

    style L1 fill:#51cf66,color:#fff
    style L2 fill:#339af0,color:#fff
    style L3 fill:#ffd43b,color:#000
```

## 품질 기준 비교

| 기준 | Tier 3 | Tier 2 | Tier 1 |
|------|--------|--------|--------|
| Code Linting | 필수 | 필수 (zero warnings) | 필수 (zero warnings) |
| TypeScript | 권장 | 필수 | 필수 (strict mode) |
| Unit Tests | 기본 | 70%+ coverage | 90%+ coverage |
| A11y Tests | - | axe | axe + pa11y |
| Visual Regression | - | 권장 | 필수 (Chromatic) |
| Bundle Size Limit | - | 권장 | 필수 (size-limit) |
| Semantic Versioning | 권장 | 필수 | 필수 |
| Changelog | - | 필수 | 필수 |
| Responsive | - | 필수 | 필수 |
| Theming / Dark Mode | - | - | 필수 |
| i18n / RTL | - | - | 필수 |

## 승격 경로 (Promotion Path)

Tier 3 컴포넌트가 품질 기준을 충족하면 상위 Tier로 승격할 수 있습니다.

```mermaid
flowchart LR
    A["Tier 3\n실험적 사용"] -->|"3+ 팀 사용\n품질 기준 충족"| B["Tier 2\n크로스 그룹"]
    B -->|"모든 제품 관련\n최고 품질 달성"| C["Tier 1\nCore"]

    style A fill:#ffd43b,color:#000
    style B fill:#339af0,color:#fff
    style C fill:#51cf66,color:#fff
```

### 승격 체크리스트

```markdown
## Tier 3 → Tier 2 승격 기준
- [ ] 3개 이상 팀에서 사용 중
- [ ] TypeScript strict 모드 통과
- [ ] 테스트 커버리지 70%+
- [ ] 접근성 테스트(axe) 통과
- [ ] Semantic Versioning 적용
- [ ] CHANGELOG 유지

## Tier 2 → Tier 1 승격 기준
- [ ] 모든 adopter에게 관련
- [ ] 테스트 커버리지 90%+
- [ ] 접근성 종합 리뷰 통과 (axe + pa11y + 수동)
- [ ] Responsive (375px ~ 1440px)
- [ ] Theming / Dark Mode 지원
- [ ] i18n / RTL 지원
- [ ] Bundle size limit 설정
- [ ] Visual regression 테스트 통과
```

## 실무 체크리스트

- [ ] 조직에 맞는 Tier 구조 정의 (2-3 Tier 권장)
- [ ] Tier별 `package.json` scripts 차별화
- [ ] CI 파이프라인을 Tier에 맞게 설정
- [ ] 승격 경로와 기준 문서화
- [ ] 네이밍 규칙 중앙 관리 (`@company/core-*`, `@company/*-kit`)
- [ ] 문서 사이트에 Tier 정보 노출 (실험적 vs 안정적)

---

import CrossRef from '@site/src/components/CrossRef';

<CrossRef related={[
  { path: "/07-governance-operations/01-core-principles-governance", label: "07-01. 핵심 원칙 & Tier 아키텍처" },
  { path: "/08-scaling-architecture/02-a-design-systems-reach---4-levels-of-system-scope", label: "08-02. 시스템 범위" },
  { path: "/09-versioning-releases/01-versioning-design-systems---communicating-change", label: "09-01. 버전 관리" },
]} />

*출처: Nathan Curtis (EightShapes) - Design System Tiers (Feb 2019)*
