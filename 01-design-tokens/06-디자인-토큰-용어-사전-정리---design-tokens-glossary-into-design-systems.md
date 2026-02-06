# 디자인 토큰 용어 사전 정리 - Design Tokens Glossary (Into Design Systems)

> Original issue: shaun0927/stocktitan-crawler#523

# 디자인 토큰 용어 사전 정리 - Design Tokens Glossary

**발표자**: Marta Conde (Into Design Systems Conference)
**요약 작성일**: 2026-02-05

---

## 📋 핵심 개요

Marta Conde는 Sosafe에서 디자인 시스템 팀 (디자이너 1명 + 엔지니어 1명)을 이끌며, 체계적인 디자인 토큰 명명 시스템을 구축한 경험을 공유합니다. 이 발표는 **토큰 네이밍의 실전 프로세스**와 **AI 기반 자동화 도구**를 중심으로, 소규모 팀에서도 빠르게 임팩트를 낼 수 있는 방법론을 제시합니다.

---

## 🎯 핵심 개념

### 1. 토큰 네이밍 전 필수 단계
디자인 토큰을 명명하기 전에 반드시 수행해야 할 3가지 기둥:

#### (1) 생태계 이해 (Ecosystem Understanding)
- **90일 디자인 시스템 캔버스** 활용 (90 blocks of information)
- Marta는 30일로 압축하여 실행
- 수집 항목:
  - 회사 리소스 및 인력 구조
  - 사용 중인 라이브러리 (Mantine, 아이콘, 차트, 테이블 등)
  - 라이브러리 간 연결 관계 (naming에 직접 영향)
  - 로드맵 (우선순위 결정)
  - 스테이크홀더 인터뷰 (30분 coffee chat)

**실전 예시**:
```
질문: "제품 색상이 너무 파랗습니다. 변경이 필요합니다."
→ 번역: Primary color 재정의 필요
→ 우선순위: 색상 토큰 네이밍이 최우선
```

#### (2) MVP 구축으로 가치 증명
- 100개+ 컴포넌트 중 시각적으로 불일치한 15개 선택
- 재사용성 높은 컴포넌트 우선:
  - **Semantic tokens 활용 컴포넌트**: Badge, Alert, Banner
  - **자주 사용되는 Controls**: Button, Checkbox
  - **Input 요소들**
- **3주 내 리브랜딩 완료** → Primary token 값만 변경하여 새 Look & Feel 구현
- 결과: 회사가 토큰 네이밍에 더 많은 시간과 도구 투자 승인

#### (3) 컴포넌트 구조 분석
각 컴포넌트의 토큰화 가능한 요소 파악:
- Border
- Background
- Icons
- Typography
- Spacing
- Shadow

---

### 2. 제약 조건 문서화 (4가지 카테고리)

토큰 네이밍 전 반드시 정리해야 할 제약 조건:

| 카테고리 | 내용 | 예시 |
|---------|------|------|
| **Visual Requirements** | 시각적 요구사항 | 더 밝고 현대적인 색상 팔레트 |
| **System Structure** | 시스템 구조 | 토큰 계층 (Foundation → Semantic) |
| **Development Constraints** | 개발 제약 | Mantine은 primary color 네이밍 변경 불가 |
| **Design Constraints** | 디자인 제약 | 기존 semantic token은 유지해야 함 |

**핵심 통찰**: Mantine 같은 UI 라이브러리는 자체 네이밍 규칙이 있어 변경 불가한 경우가 많음 → **추가 레이어 생성**으로 해결

---

## 🏗️ 디자인 토큰 분류 체계

### 토큰 타입별 분류

#### 1. Color Tokens
가장 복잡하고 다양한 네이밍이 존재하는 영역

**Foundation Layer (기본 색상)**:
- Palette: `blue-100`, `blue-200`, ..., `blue-900`
- Grayscale: `gray-50`, `gray-100`, ..., `gray-900`

**Semantic Layer (의미 기반)**:
```
Primary: primary-default, primary-hover, primary-active
Status: success, warning, error, info
State: danger, caution, alert, attention (모두 유사 의미의 동의어)
Neutral: neutral-default, neutral-subtle, neutral-plane
```

#### 2. Typography Tokens
**주요 이슈: Medium 중복 문제**

```
문제:
- Body Medium (size)
- Font Weight Medium (weight)
→ 두 개의 "medium"이 충돌

해결책:
- Scale naming: body-200, body-300
- Descriptor naming: body-md, body-lg
- Empty naming: body-1, body-2
- Dim naming: body-dim
```

#### 3. Spacing Tokens
```
Foundation: spacing-1, spacing-2, spacing-4, spacing-8 (4px base)
Semantic: padding-default, margin-compact, gap-loose
```

#### 4. Border Radius Tokens
```
radius-none: 0
radius-sm: 4px
radius-md: 8px
radius-lg: 16px
radius-full: 9999px
```

---

## 📐 네이밍 규칙 및 구조

### 토큰 네이밍 패턴

```
[Category]-[Type]-[Variant]-[State]
```

**실전 예시**:
```
color-background-neutral-default
color-background-neutral-hover
color-background-success-default
color-border-error-active
color-icon-warning-default
```

### Mantine 통합 예시 (제약 조건 하의 네이밍)

Mantine이 `color.redeem`을 강제하는 경우:
```
Mantine Layer: color-redeem (변경 불가)
Custom Layer: color-background-success (의미 기반 재매핑)
```

---

## 💡 동의어 시스템 (Synonyms)

토큰 용어 사전의 핵심 가치는 **동의어 매핑**입니다.

### 상태(State) 토큰 동의어

| 의미 | 동의어 옵션 |
|------|------------|
| 경고 | Warning, Alert, Caution, Attention |
| 성공 | Success, Positive, Confirmed, Valid |
| 오류 | Error, Danger, Critical, Failed |
| 정보 | Info, Notice, Informative, Neutral-info |

### 중립(Neutral) 배경 구분

**문제 상황**:
- 카드 배경: White (neutral)
- 폼 컨트롤 배경: Gray (neutral)
→ 둘 다 neutral인데 어떻게 구분?

**해결책**:
```
neutral-default (기본 흰색)
neutral-subtle (은은한 회색)
neutral-low (낮은 명도)
neutral-high (높은 명도)
neutral-plane (평면형 배경)
```

---

## 🤖 AI 기반 토큰 네이밍 자동화

### Phase 1: 수동 프로세스 (초기)

```
1. 컴포넌트 구조 분석 (borders, bg, icons)
2. Tokens Glossary에서 수동으로 네이밍 검색
3. 제약 조건과 비교하여 최적 네이밍 선택
```

### Phase 2: ChatGPT 통합 (중기)

**프롬프트 예시**:
```
컴포넌트: Alert 컴포넌트
구조: background, border, icon, text
제약 조건: Mantine library 사용, color.redeem 변경 불가

위 정보를 기반으로 semantic token naming을 제안해주세요.
```

**출력 예시**:
```
icon-success
border-success
background-success
color-redeem (Mantine constraint)
```

**한계**:
- Generic한 네이밍 제안 (가이드라인 부재)
- Typography medium 중복 같은 엣지 케이스 해결 불가

### Phase 3: Tokens Glossary Chat (최신)

Marta가 개발한 **커스텀 GPT 챗봇** (발표 후 공개 예정)

#### 주요 기능

1. **구조화된 지식베이스**:
   - 모든 토큰 타입별 네이밍 규칙
   - 실전 FAQ (학생들이 자주 묻는 질문들)
   - 동의어 매핑 데이터

2. **이미지 기반 토큰 추출**:
   ```
   입력: 컴포넌트 스크린샷 업로드
   프롬프트: "Extract color tokens from this image"

   출력:
   - background-neutral-default
   - background-info
   - background-warning
   - border-error
   ```

3. **엣지 케이스 해결**:
   ```
   질문: "body typography에서 medium (size)과 medium (weight)이 충돌합니다.
         어떻게 네이밍해야 하나요?"

   답변:
   - Option 1: body-md (size), font-weight-medium
   - Option 2: body-200 (scale), font-weight-500
   - Option 3: body-2, font-weight-medium
   ```

4. **동의어 추천**:
   ```
   질문: "warning의 다른 네이밍 옵션은?"
   답변: caution, alert, attention
   ```

#### 지원 토큰 타입 (현재/향후)

**현재 지원**:
- Colors
- Spacing
- Border Radius

**향후 추가 예정**:
- Shadows
- Motion/Animation
- Typography (구조만 있고 FAQ 확장 필요)

#### 사용 워크플로우

```
1. Miro 폼 작성 → 컴포넌트 정보, 제약 조건 입력
2. Chat에 질문 → 구체적인 네이밍 이슈 해결
3. AI 제안 검토 → 프로젝트 맥락에 맞게 조정
4. 실제 데이터로 피드백 → AI 정확도 향상
```

---

## 📝 실전 적용 체크리스트

### 프로젝트 시작 시

- [ ] 90일 캔버스 템플릿 다운로드 (또는 30일 버전으로 압축)
- [ ] 스테이크홀더 인터뷰 스케줄 (30분 coffee chat)
- [ ] 사용 중인 UI 라이브러리 제약 조건 문서화
- [ ] 라이브러리 간 연결 관계 다이어그램 작성
- [ ] 로드맵 기반 토큰 우선순위 설정

### 토큰 네이밍 전

- [ ] 4가지 제약 조건 카테고리 정리 (Visual, System, Dev, Design)
- [ ] 재사용성 높은 컴포넌트 15개 선정
- [ ] 각 컴포넌트의 토큰화 가능 요소 분석
- [ ] Tokens Glossary 다운로드 및 커스터마이징
- [ ] 동의어 목록 프로젝트 맥락에 맞게 조정

### 토큰 시스템 구축

- [ ] Foundation tokens 먼저 정의 (색상 팔레트, spacing scale)
- [ ] Semantic tokens 매핑 (foundation → 의미 기반)
- [ ] Component-specific tokens (필요 시)
- [ ] 네이밍 충돌 검증 (medium-medium 같은 케이스)
- [ ] AI 챗봇으로 엣지 케이스 검증

### MVP 검증

- [ ] Primary token만 변경하여 Look & Feel 업데이트
- [ ] 3주 내 15개 컴포넌트 리브랜딩 완료
- [ ] 스테이크홀더에게 임팩트 시연
- [ ] 추가 시간/도구 투자 승인 획득

---

## 🎨 AlphaView 프로젝트 적용 포인트

### 1. 현재 상황 진단

AlphaView의 Next.js 프론트엔드는 Tailwind CSS 기반으로 구축되어 있습니다. Tailwind의 유틸리티 클래스는 이미 토큰 시스템의 기초를 제공하지만, **semantic layer가 부족**합니다.

**현재 이슈**:
```tsx
// 컴포넌트마다 하드코딩된 색상 클래스
<div className="bg-blue-500 hover:bg-blue-600">
<div className="text-red-600">  // Error state인지 Brand color인지 불명확
```

### 2. 적용 우선순위 (Marta의 방법론 적용)

#### Phase 1: 생태계 이해 (1주)
- [ ] Tailwind config 분석 (`tailwind.config.ts`)
- [ ] 재사용 빈도 높은 컴포넌트 15개 선정
  - 후보: `AlphaArticleCard`, `AlphaFilterBar`, `NewsModal`, `Header`
- [ ] 색상 사용 패턴 분석 (Primary, Status, Neutral)

#### Phase 2: Semantic Token Layer 구축 (2주)

**Foundation → Semantic 매핑**:
```ts
// tailwind.config.ts에 추가
theme: {
  extend: {
    colors: {
      // Foundation (기존 Tailwind 유지)
      blue: { ... },
      gray: { ... },

      // Semantic Layer (새로 추가)
      primary: {
        DEFAULT: '#3B82F6',  // blue-500
        hover: '#2563EB',    // blue-600
        active: '#1D4ED8',   // blue-700
      },
      status: {
        success: '#10B981', // green-500
        warning: '#F59E0B', // amber-500
        error: '#EF4444',   // red-500
        info: '#3B82F6',    // blue-500
      },
      neutral: {
        bg: '#FFFFFF',
        'bg-subtle': '#F9FAFB',  // gray-50
        border: '#E5E7EB',       // gray-200
      }
    }
  }
}
```

#### Phase 3: 컴포넌트 마이그레이션 (1주)

**Before**:
```tsx
<div className="bg-blue-500 hover:bg-blue-600 text-white">
```

**After**:
```tsx
<div className="bg-primary hover:bg-primary-hover text-white">
```

### 3. AI 챗봇 활용 전략

Tokens Glossary Chat 공개 후:

1. **AlphaView 컴포넌트 스크린샷 업로드**
   - `AlphaArticleCard` 이미지 → 토큰 추출
   - 예상 출력: `background-neutral-default`, `border-neutral`, `text-heading`

2. **네이밍 충돌 해결**
   - 질문: "AlphaView는 'alpha'라는 브랜드 네이밍과 'alpha score'라는 데이터 개념을 모두 사용합니다. 토큰에서 어떻게 구분해야 하나요?"
   - 기대 답변: `brand-alpha-primary` vs `data-alpha-score-high`

3. **Tailwind 제약 조건 피드백**
   - 프롬프트에 Tailwind config 구조 포함
   - AI가 Tailwind 호환 네이밍 제안하도록 학습

### 4. 측정 가능한 목표 (Marta의 3주 리브랜딩 벤치마크)

- [ ] **1주차**: Semantic color tokens 정의 → `tailwind.config.ts` 업데이트
- [ ] **2주차**: 15개 핵심 컴포넌트 마이그레이션 완료
- [ ] **3주차**: 전체 Admin 페이지에 새 토큰 시스템 적용
- [ ] **검증**: 색상 변경이 5분 내 완료 가능한지 테스트 (Primary color 교체)

### 5. 장기 로드맵

- **Typography tokens**: 현재 Tailwind 기본값 사용 → `text-heading-lg`, `text-body-md` 등 semantic 정의
- **Spacing system**: `space-compact`, `space-default`, `space-loose` 추가
- **Component tokens**: `alpha-card-bg`, `alpha-filter-border` 등 컴포넌트별 토큰

---

## 🔑 핵심 교훈 (Key Takeaways)

### 1. 네이밍보다 이해가 먼저
> "You need to understand your ecosystem before naming everything."

토큰 네이밍은 기술적 작업이 아니라 **조직의 생태계를 이해하는 과정**입니다.

### 2. AI는 보조 도구, 단일 정보원이 아님
> "Use the Tokens Glossary Chat as support, not as a single source of truth."

AI는 제안을 하지만, 최종 결정은 프로젝트 맥락과 제약 조건을 고려한 인간이 해야 합니다.

### 3. 빠른 가치 증명이 투자를 이끈다
3주 만에 15개 컴포넌트를 리브랜딩하여 스테이크홀더에게 **토큰 시스템의 위력**을 시연 → 추가 시간과 도구 투자 확보

### 4. 실제 데이터로 AI 정확도 향상
> "Feed the AI with real relevant data about your product, constraints, and libraries."

제네릭한 AI 답변이 아닌, 프로젝트 특화 솔루션을 얻으려면 **실제 컴포넌트 구조, 제약 조건, 사용 라이브러리 정보**를 AI에 지속적으로 학습시켜야 합니다.

### 5. 동의어 매핑이 협업의 핵심
`warning = alert = caution = attention`

팀마다, 디자인 시스템마다 다른 용어를 사용합니다. **동의어 시스템**이 없으면 커뮤니케이션이 단절됩니다.

---

## 📚 참고 자료

- **Tokens Glossary Chat**: 발표 후 Marta의 LinkedIn/Instagram에서 공개 예정
- **90일 디자인 시스템 캔버스**: Dan Mall의 템플릿 (90 blocks)
- **Miro 폼**: AI 챗봇에 피드백 제공용 (발표 자료에 링크 포함 예정)

**Marta Conde 소셜**:
- LinkedIn: [링크는 발표 자료 참조]
- Instagram: [링크는 발표 자료 참조]

---

## ✅ 결론

Marta Conde의 방법론은 **소규모 팀 (1 디자이너 + 1 엔지니어)**에서도 체계적인 디자인 토큰 시스템을 구축할 수 있음을 증명합니다. 핵심은:

1. **생태계 이해** (30일 압축 가능)
2. **빠른 MVP** (3주 리브랜딩으로 가치 증명)
3. **AI 활용** (Tokens Glossary Chat으로 반복 작업 자동화)
4. **지속적 학습** (실제 프로젝트 데이터로 AI 정확도 향상)

AlphaView 프로젝트는 이미 Tailwind라는 Foundation layer를 가지고 있으므로, **Semantic layer 추가**만으로 Marta의 성과를 재현할 수 있습니다.

---

**작성자**: Claude (oh-my-claudecode executor)
**태그**: #design-tokens #naming-conventions #AI-automation #design-systems #scalability
