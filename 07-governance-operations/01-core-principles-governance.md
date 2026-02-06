# Core Principles & Governance

> Original issue: shaun0927/stocktitan-crawler#564

# 디자인 시스템 핵심 원칙 & 거버넌스

## 📌 디자인 시스템 8가지 핵심 원칙 (Nathan Curtis, 2017)

### 1. Build Buttons Once, Really Well
**의미**: 버튼은 모든 곳에서 쓰는 원자적 컴포넌트. 각 팀이 따로 만드는 시대는 끝.
**Etsy 사례**: 10개 제품에서 버튼 중복 제작 = 6자리 비용 → 한 번 잘 만들어서 모든 팀 비용 절감

### 2. Favor Shared Needs Over Personal Preferences
**의미**: 잘 만든 것 ≠ 시스템에 포함되어야 하는 것
**기준**: 통합/정규화/유지보수 비용 vs 재사용 가치 → 혼자만 쓰면 시스템에 안 넣기

### 3. Systems Serve Products, Not Vice Versa
**의미**: 시스템은 제품을 대신 만들거나 명령할 권한 없음
**원칙**: 제품이 선택권 가짐 (채택 여부, 사용 범위, 속도). 강제보다 **선택의 가치 증명**.

### 4. Build Community, Not Governance
**의미**: "Big G" 거버넌스보다 "커뮤니티" 우선
**실무**: Cross-product critique 문화, 세그먼트 가이드(접근성, 모션) → 당근 먼저, 채찍 나중

### 5. Keep the Simple Simple
**의미**: 복잡한 문제를 해결하되, 인터페이스는 단순하게
**레이어드 아키텍처**: 기본은 쉽게, 고급은 가능하게 → 사용자에게 복잡도 전가 최소화

### 6. Show, Don't Tell
**의미**: 문서화는 시각화와 도구로
**좋은 예**: 렌더링된 variations, 복사 가능한 코드, Component explorers, Do & Don't 대비 이미지

### 7. Value Is Realized When Products Ship
**의미**: 시스템 가치는 제품이 시스템 부품으로 기능을 출시할 때 실현됨
**성공 지표**: NPM dependency 추가, adoption 측정/모니터링/리포팅

### 8. Never Compromise Quality
**의미**: 시스템 품질은 항상 제품 팀 기준 이상
**원칙**: 느려도 프로세스 신뢰하고 높은 품질 달성 → 스테이크홀더가 "빨리 더 많이" 원해도 타협 금지

## 🎯 디자인 시스템 Tiers (Nathan Curtis, 2019)

### Tier 구조

```
Tier 0 (Brand) ────────────────────┐
Tier 1 (Core) ─────────────────┐   │ 모두에게 관련
  └─ Button, Input, Checkbox   │   │ 최고 품질
Tier 2 (Cross-Group Sets) ─┐   │   │
  └─ Editor, Navigation     │   │   │ 그룹간 공유
Tier 3 (Within-Group Sets) │   │   │ 중간 품질
  └─ Sales-UI, Product Kit  │   │   │
Products ───────────────────┘   └───┘ 조직 내 공유
                                      기본 품질
```

### Tier별 기준

**Tier 1 (Core)**:
- 모든 adopter에게 관련
- Core 팀 중앙 관리
- 최고 품질 필수 (접근성, 성능, 테마, i18n, RTL 등)

**Tier 2 (Cross-Group)**:
- 조직 경계 넘어 공유
- 시스템 팀이 matchmaker 역할
- 여러 팀 공동 투자

**Tier 3 (Within-Group)**:
- 조직/사업부 내부 공유
- 느슨한 통제, 빠른 납기
- 품질은 낮지만 일관성 유지

### 품질 계층화

**Within Group Tier**: Linting, Browser testing, Core 접근성, 일관된 스타일링
**Across Groups Tier (↑ 추가)**: Responsive, Semantic versioning, Changelog, Unit/Visual regression tests, 커뮤니티 승인
**Top Core Tier (↑ 추가)**: 포괄적 접근성 리뷰, Sizing(S/M/L), Light/Dark mode, Theming, Analytics, i18n(RTL)

## 🔧 통합 전략 (Nathan Curtis, 2018)

### 여러 시스템 통합 4가지 옵션

**Option 1: 아무것도 안 함** - 통합 의지 없거나 변화 저항 큼
**Option 2: 양쪽 유지 + 하위 시스템 공유** - 실제론 거의 성공 못함 (장기 커밋 어려움)
**Option 3: 양쪽 폐기 + 새로 시작** - 가장 비용 높고 시간 오래 걸림
**Option 4: 하나 유지 + 다른 것 흡수 (권장)** - 강한 시스템 선택, 약한 시스템 기능 이관

### 통합 전 필수 단계

1. **생태계 매핑**: 모든 시스템과 제품 관계 시각화
2. **비교 & 합리화**: Visual Style, UI Components, 코드 출력물, 문서화 강점/약점 비교
3. **통합 경로 선택**: Option 4 권장

## ⚠️ 디자인 시스템 통념(Myths) 경계 (Nathan Curtis, 2024)

1. **"100% 채택률 = 성공"** → 부분 채택도 가치 있음
2. **"완전 연합 또는 완전 중앙집중"** → 하이브리드 모델이 현실
3. **"여러 시스템 = 실패"** → 조직 규모와 맥락에 따라 필요할 수 있음
4. **"기여가 확장의 지름길"** → 빠른 확장은 코어 팀의 실행력에서 나옴
5. **"자동화가 최우선"** → 기초를 먼저 다져야 함

## ✅ 실무 적용 체크리스트

### 원칙 적용
- [ ] "Simple simple" 유지 체크
- [ ] 문서를 시각화/도구로 전환
- [ ] 거버넌스보다 커뮤니티 우선
- [ ] 품질 타협 금지
- [ ] 제품 출시로 가치 측정

### Tier 설계
- [ ] Core 범위 명확히
- [ ] Tier 2/3 기준 정의
- [ ] 품질 criteria 계층화
- [ ] 권한 모델 설계 (가시성 최대화, 위험 최소화)
- [ ] 네이밍 큐레이션 프로세스
- [ ] Tier 승격 경로 문서화

### 통합 고려
- [ ] 생태계 시각화 완료
- [ ] 각 시스템 강점/약점 비교
- [ ] Option 4 (Keep One) 우선 검토
- [ ] 피인수 팀 감정 고려
- [ ] 비용 분담 모델 합의

---
*출처: Nathan Curtis (EightShapes) - Principles of Designing Systems, Design System Tiers, Consolidating Design Systems, Design System Myths*