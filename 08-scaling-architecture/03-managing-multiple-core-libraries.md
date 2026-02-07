---
audience: developer
---

# Managing Multiple Core Libraries

import DevQuickStart from '@site/src/components/DevQuickStart';

<DevQuickStart
  what="멀티 플랫폼 디자인 시스템은 React, iOS, Android 등 여러 코어 라이브러리를 관리해야 합니다"
  learn="크로스 플랫폼 API 정렬, Turborepo/Nx 설정, 릴리스 동기화 전략"
  able="여러 플랫폼의 디자인 시스템 라이브러리를 일관성 있게 관리하고 릴리스할 수 있습니다"
/>

## 크로스 플랫폼 API 정렬

디자인 시스템이 여러 플랫폼을 지원할 때, API 이름을 통일하는 것이 가장 중요합니다.

### 플랫폼별 동일 API 구현

```tsx
// React (Web)
<Button variant="primary" size="lg" disabled>
  Submit
</Button>

<Card elevation="md" padding="lg">
  <CardHeader title="Dashboard" />
  <CardBody>Content</CardBody>
</Card>
```

```swift
// Swift (iOS)
Button(
  variant: .primary,
  size: .lg,
  isDisabled: true,
  label: "Submit"
)

Card(elevation: .md, padding: .lg) {
  CardHeader(title: "Dashboard")
  CardBody { Text("Content") }
}
```

```kotlin
// Kotlin (Android)
Button(
  variant = ButtonVariant.PRIMARY,
  size = ButtonSize.LG,
  enabled = false
) {
  Text("Submit")
}

Card(
  elevation = Elevation.MD,
  padding = Padding.LG
) {
  CardHeader(title = "Dashboard")
  CardBody { Text("Content") }
}
```

### API 정렬 원칙

| 원칙 | 설명 | 예시 |
|------|------|------|
| **동일한 prop 이름** | 플랫폼 관례에 맞게 변환 | `variant` (모든 플랫폼) |
| **동일한 prop 값** | 열거형 값 통일 | `primary`, `secondary`, `text` |
| **플랫폼 관례 허용** | boolean 접두사 등 | React: `disabled` / Swift: `isDisabled` |
| **동일한 컴포넌트 이름** | 코어 이름 통일 | `Button`, `Card`, `Input` |

## 멀티 라이브러리 관리 도구

### Turborepo 설정

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

```
# 모노레포 구조 (멀티 플랫폼)
design-system/
  packages/
    tokens/              # @company/tokens (공유 토큰)
    react/               # @company/react-ui
    web-components/      # @company/wc-ui
    figma-plugin/        # Figma 연동
  native/
    ios/                 # CompanyUI (Swift Package)
    android/             # company-ui (Kotlin)
  apps/
    docs/                # 통합 문서 사이트
    playground/          # 멀티 플랫폼 데모
  turbo.json
```

### Nx 설정 (대안)

```json
// nx.json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx/tasks-runners/default",
      "options": {
        "cacheableOperations": ["build", "lint", "test"]
      }
    }
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

## 릴리스 동기화 전략

| 라이브러리 수 | 전략 | 설명 |
|-------------|------|------|
| 1-2개 | **동기화** | 모든 라이브러리를 동시에 릴리스 |
| 3개+ | **독립 + 집단 커뮤니케이션** | 각자 릴리스하되, 통합 릴리스 노트 |

```bash
# 독립 릴리스 + 통합 커뮤니케이션
# React는 준비되면 바로 릴리스
cd packages/react && npx changeset publish

# iOS는 별도 주기로 릴리스
cd native/ios && swift package publish

# 통합 릴리스 노트 생성
node scripts/generate-release-notes.js
# → "Design System February 2026 Update"
# → React v3.2.0, iOS v3.1.0, Android v3.1.5
```

## 관리 복잡도 5가지 축

| 축 | 설명 | 해결 방법 |
|---|------|----------|
| **Roadmap** | 팀 간 공유 로드맵 유지 | 월간 sync 미팅 |
| **Collaboration** | 플랫폼별 handoff 관리 | 공유 Figma + 토큰 |
| **API Alignment** | 컴포넌트/속성 이름 통일 | API 리뷰 미팅 |
| **Designer VQA** | 플랫폼별 시각 검증 | 자동화 스냅샷 비교 |
| **Release Sync** | 릴리스 타이밍 조율 | 독립 릴리스 + 통합 노트 |

## 실패 징후 모니터링

| 징후 | 의미 | 행동 |
|------|------|------|
| 6개월째 업데이트 없는 라이브러리 | 메인테이너 우선순위 밀림 | 전담 인력 배정 |
| 플랫폼마다 Button API 다름 | API 정렬 부재 | API 리뷰 프로세스 수립 |
| 새 컴포넌트가 Web만 지원 | 플랫폼 간 격차 확대 | 로드맵에 플랫폼 패리티 반영 |

## 실무 체크리스트

- [ ] 크로스 플랫폼 API 네이밍 규칙 합의
- [ ] 모노레포 도구 선택 (Turborepo/Nx)
- [ ] 공유 토큰 패키지 구축 (모든 플랫폼에서 소비)
- [ ] 릴리스 동기화 전략 결정
- [ ] 플랫폼별 최소 1명 전담 메인테이너 배정
- [ ] 통합 릴리스 노트 자동화

---

import CrossRef from '@site/src/components/CrossRef';

<CrossRef related={[
  { path: "/08-scaling-architecture/01-design-system-tiers---maturity-levels-for-scalable-systems", label: "08-01. Tier 아키텍처" },
  { path: "/08-scaling-architecture/02-a-design-systems-reach---4-levels-of-system-scope", label: "08-02. 시스템 범위" },
  { path: "/09-versioning-releases/02-releasing-design-systems---outputs-cadence-versions", label: "09-02. 릴리스 전략" },
]} />

*출처: Nathan Curtis (EightShapes) - Managing Design Systems with Multiple Core Libraries*
