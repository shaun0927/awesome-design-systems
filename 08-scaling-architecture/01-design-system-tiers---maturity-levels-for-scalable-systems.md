# Design System Tiers - Maturity Levels for Scalable Systems

> Original issue: shaun0927/stocktitan-crawler#584

## 📌 핵심 개념
- **계층적 시스템 구조**: Core(모두에게 관련) → Tier 2(비즈니스 유닛별/기능별) → Product(개별 제품) 3단계 계층으로 디자인 시스템을 확장
- **유연한 품질 기준**: Core는 최고 품질 필수, 하위 Tier는 점진적 품질 개선 허용 (실험 → 안정화 → 승격)
- **조직 경계를 넘는 공유**: Tier는 비즈니스 유닛 내부(Within Group)뿐만 아니라 유닛 간(Across Groups) 협업도 지원
- **네임스페이스 중앙 관리**: 컴포넌트 이름 충돌 방지를 위해 명명 규칙을 중앙에서 큐레이션
- **승격 경로(Promotion Path)**: 실험적 기능이 품질 기준을 충족하면 상위 Tier로 승격 가능한 명확한 경로 제공

## 🎯 실무 노하우
- **파일럿 먼저 시작**: 전사 확대 전 2-3개 feature set(editor, navigation, social 등)으로 Tier 2 파일럿 운영 → 권한/워크플로우 검증
- **품질 기준을 Tier별로 차별화**: Within Group(기본 린팅/브라우저 테스트), Across Groups(반응형/BEM/semantic versioning), Core(접근성/테마/i18n) 등 단계적 기준 설정
- **권한 모델 설계**: Core는 시스템팀만 편집, Tier 2는 해당 비즈니스 유닛 + 시스템팀 편집, 모든 Tier는 전체에 visible
- **시스템팀은 매칭메이커 역할**: 여러 팀에서 유사한 요구사항(예: rich-text editor) 발견 시 연결해주고 공유 투자 유도
- **문서화에 Tier 노출**: 사용자가 Core vs 실험적 기능을 구분할 수 있도록 문서 사이트 내비게이션/상태 표시에 Tier 정보 반영

## 📊 주요 구조/다이어그램
**3-Tier 아키텍처 예시:**
```
Tier 1 (Core): 
  - Style: Color, Typography, Iconography, Space
  - Components: Button, Card, Checkbox, Input, List Group, Menu, Modal, Notification, Radio, Select

Tier 2 (Feature Sets):
  - Editor Kit: Rich Text Input, Editor Toolbar, Editor Full Screen, Editor Upload
  - Navigation Kit: Site Top Hat, Site Primary Nav, Site Footnotes, Site Footer
  - Social Kit: Share, Favorite
  - A Kit, B Kit, C Kit (비즈니스 유닛별)

Tier 3 (Products): 개별 제품들
```

**품질 기준 단계별 요구사항:**
| Tier Level | 필수 요구사항 |
|-----------|-------------|
| Core | Sizing(S/M/L), Theming, Analytics, i18n(RTL), 종합 접근성 검토, Light/Dark 모드 |
| Across Groups | 반응형, BEM CSS, Semantic Versioning, Change Log, Design Tokens, Unit/Visual Regression Tests |
| Within Group | Code Linting, 브라우저 테스트, Core 접근성 기준, Core 스타일 일관성 |

**실제 사례: Sales Organization이 sales-ui를 Tier 2로 운영**
- core-ui에 의존하는 sales-ui 저장소를 별도 운영
- 25개 영업팀이 빠른 딜리버리 달성
- 시스템팀은 sales-ui → core-ui 승격 후보 발굴 및 품질 개선 지원

---
> 출처: Nathan Curtis (EightShapes)
> 원문: "Design System Tiers. Time To Mature Systems To Support Levels of Work" (Feb 2019)