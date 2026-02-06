# Visual Breaking Change - Color, Typography, Space

> Original issue: shaun0927/stocktitan-crawler#578

## 📌 핵심 개념

- **Visual Breaking Change 정의**: 색상, 타이포그래피, 간격 변경으로 adopter의 UI가 예상치 못하게 깨지는 변경사항
- **색상 위험 지점**: 시스템 텍스트 색상이 사용자 정의 배경 위에, 또는 시스템 배경색 위에 사용자 정의 텍스트가 올라가는 경우
- **타이포그래피 위험**: font-weight, letter-spacing 변경으로 텍스트가 wrap되거나 crop되는 경우 (특히 dense UI)
- **간격/크기 위험**: margin, padding 변경으로 레이아웃이 깨지거나 요소가 wrap되는 경우
- **API vs Visual Style**: 코드 API는 SemVer로 엄격히 관리하지만, visual style 변경 기준은 명확하지 않음

## 🎯 실무 노하우

- **색상 접근성 검증**: 시스템 색상 변경 시 WebAIM Contrast Checker로 AA/AAA 등급 확인 (contrast-grid.eightshapes.com 활용)
- **Contained Change는 안전**: 메뉴 내부 padding/margin 조정처럼 완전히 캡슐화된 변경은 non-breaking
- **공간 규칙 경계 밖으로 내보내지 않기**: 컴포넌트 외부 margin은 피하고, 내부 spatial 조정만 cautiously 수행
- **1.0.0 전에 실험 완료**: 초기에 충분히 실험하고 1.0.0 이후엔 안정적 기반 유지, 위험한 변경은 major 버전에 예약
- **문서화된 기준 수립**: 팀과 CSS 속성 목록 리뷰하고 어떤 변경이 breaking인지 working session으로 합의

## 📊 주요 구조/다이어그램

**Breaking Change 판단 기준:**

| 속성 | Breaking 조건 | 예시 |
|------|---------------|------|
| **Color** | 텍스트 색상이 알 수 없는 배경 위에 | Ghost button 색상 변경 → 사용자 light gray 배경에서 접근성 실패 |
| **Typography** | 텍스트가 wrap/crop 발생 | Tab label을 bold로 변경 → 고정폭 탭에서 줄바꿈 |
| **Space/Size** | 레이아웃 composition 깨짐 | Card padding 증가 → 사용자 정의 icon toolbar가 두 줄로 wrap |
| **Non-breaking** | 완전히 캡슐화된 영역 내부 | 메뉴 아이템 간 spacing 조정 (외부 영향 없음) |

**모니터링 권장 CSS 속성:**
- 색상: `color`, `background-color`, `border-color`
- 타이포: `font-family`, `font-weight`, `font-size`, `letter-spacing`, `line-height`
- 공간: `margin`, `padding`, `width`, `height`
- 레이어링: `z-index`, `opacity`, `box-shadow`

---
> 출처: Nathan Curtis (EightShapes)
> 시리즈: Releasing Design Systems #4