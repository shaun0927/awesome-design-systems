# Variants Analysis - 데이터 기반 컴포넌트

> Original issue: shaun0927/stocktitan-crawler#552

# 베리언트 분석 (Variants Analysis)

## 📌 핵심 개념

**정의**: Figma 컴포넌트의 모든 베리언트를 체계적으로 분석하여 구조화된 데이터로 변환하는 프로세스

**Components as Data 패러다임**:
```
Figma Asset → Anova Plugin → Structured Data (YAML/JSON)
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
                  AI/LLM         문서화          코드 생성
```

## 🎯 실무 노하우

### 4가지 핵심 원칙

#### 1. Deterministic (결정론적) vs Stochastic (확률적)
- **문제**: AI/LLM은 매번 다른 결과 생성
- **해결**: Figma API에서 직접 추출 (AI 추론 X)
- **이점**: Git 버전 관리 가능, CI/CD 통합 가능

#### 2. Complete (완전성) vs Partial (부분성)
- **문제**: 얕은 분석은 prop 조합을 놓침
- **해결**: 모든 가능한 조합을 순회
- **예시**: `hover + selected + appearance:info` 조합의 색상 발견

#### 3. Succinct (간결성) vs Bloated (비대성)
- **문제**: Figma REST API는 14,400줄 생성
- **해결**: 변경된 부분만 기록 (CSS Cascade 방식)
- **압축률**: 99.99% (14,400줄 → 1줄)

#### 4. Human-readable (인간 친화성)
- **문제**: 기계 중심 JSON은 읽기 어려움
- **해결**: YAML 포맷 사용
- **이점**: 코드 리뷰 가능, 온보딩 빠름, Figma 코멘트 활용

### 데이터 모델 구조

```yaml
# 1. Anatomy (해부학적 구조)
anatomy:
  root:
    type: container
  label:
    type: text
  icon:
    type: instance
    instanceOf: DS Icon

# 2. Props (속성 정의)
props:
  disabled:
    type: boolean
    default: false
  appearance:
    type: string
    default: critical
    enum: [critical, warning, success, info]

# 3. Variants (베리언트별 차이점)
variants:
  - configuration:
      size: small
    elements:
      root:
        styles:
          paddingLeft: DS Space/Padding/0_25x
      label:
        styles:
          textStyleId: Body/Small
```

### CSS Cascade 방식 레이어링

```yaml
# Step 1: default 스타일 로드
default:
  elements:
    root:
      styles:
        fills: DS Color/Alert/Basic/Background filled
        paddingLeft: DS Space/Padding/0_5x

# Step 2: size:small 매칭 → 덮어쓰기
variants:
  - configuration:
      size: small
    elements:
      root:
        styles:
          paddingLeft: DS Space/Padding/0_25x  # ← 덮어씀

# Step 3: appearance:success 매칭 → 추가 덮어쓰기
  - configuration:
      appearance: success
    elements:
      root:
        styles:
          fills: DS Color/Alert/Success/Element  # ← 덮어씀
```

## 📊 7가지 활용 사례

| 활용 사례 | 실무 시나리오 | 예상 효과 |
|-----------|---------------|-----------|
| AI LLM 활용 | "Alert 컴포넌트를 React로 변환" | 코드 생성 정확도 90%+ |
| 버전 관리 | Git으로 컴포넌트 spec 추적 | 디자인 변경 이력 완전 추적 |
| 카탈로그 분석 | 100개 컴포넌트 일관성 자동 검증 | QA 시간 80% 단축 |
| 품질 검사 | Invalid variant 조합 자동 탐지 | 디자인 오류 사전 방지 |
| 핸드오프 | JSON 데이터를 개발팀에 전달 | 핸드오프 시간 70% 단축 |
| 문서 자동 생성 | Storybook/Docs 자동 생성 | 문서 작업 90% 단축 |
| Round-trip | 데이터에서 Figma Asset 생성 | 디자인-코드 동기화 자동화 |

---

*출처: Nathan Curtis, Medium 2025-10*