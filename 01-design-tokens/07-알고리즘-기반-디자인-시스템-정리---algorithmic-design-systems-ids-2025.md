# 알고리즘 기반 디자인 시스템 정리 - Algorithmic Design Systems (IDS 2025)

> Original issue: shaun0927/stocktitan-crawler#524

# 알고리즘 기반 디자인 시스템 - Into Design Systems 2025

> **발표자**: Marco (Graph Engine Wizard, Token Studio)
> **출처**: Into Design Systems Conference 2025
> **핵심 주제**: 디자인 시스템에서 수학적 패턴과 알고리즘을 활용한 자동화 및 확장성

---

## 📌 핵심 철학: 우주의 법칙처럼 디자인도 법칙이 있다

### 핵심 메시지
- **디자인은 마법이 아니라 패턴이다**: 우주의 법칙을 이해하면 행성의 움직임을 예측할 수 있듯이, 디자인의 알고리즘을 이해하면 시스템이 어떻게 작동하고 확장될지 예측할 수 있다.
- **관찰 → 패턴 발견 → 알고리즘화 → 자동화**: 코페르니쿠스, 뉴턴, 아인슈타인이 방대한 데이터에서 우아한 공식을 발견했듯이, 디자인에서도 성공/실패 사례를 관찰하고 패턴을 찾아 알고리즘으로 변환한다.
- **수백 페이지의 문서 → 몇 줄의 코드**: E=mc²처럼, 하나의 우아한 공식이 무한한 일관된 표현을 생성할 수 있다.

---

## 🔢 알고리즘 디자인의 4단계 진화

### Part 1: 관찰의 시대 (Pre-Algorithmic Era)
**문제점:**
- 모든 것을 수동으로 문서화 (색상, 간격, 타이포그래피 등)
- Walt Disney, NASA 브랜드 가이드처럼 수백 페이지 분량
- 디자이너가 직관과 기억에 의존 ("그냥 느낌이 좋아서")
- 핵심 디자이너가 떠나면 시스템이 무너짐 (Jenga 효과)
- 확장 불가능, 예측 불가능

**역사적 사례:**
- 고대 그리스 (BC 432): 아름다운 디자인이지만 원리는 암묵적
- 2000년대 초 디지털 디자인: 실험적이지만 "왜 좋은지" 설명 불가

### Part 2: 코페르니쿠스적 전환 (Pattern Discovery)
**Aha Moment:**
- 성공/실패 사례를 관찰하다 "패턴이 있다!"는 깨달음
- 자연의 법칙 (황금비, 피보나치 수열)이 디자인에도 적용됨
- 레오나르도 다 빈치도 무의식적으로 수학적 패턴 활용

**핵심 발견:**
- 우리 뇌는 본능적으로 질서와 조화를 선호
- 해바라기, 고전 예술, 잘 구조화된 웹사이트 모두 수학적 패턴을 따름

### Part 3: 알고리즘 시대 (Predictable Systems)
**혜택:**
- **예측 가능**: "만약에?"가 아니라 "알고 있다"
- **반복 가능**: 버튼 색상이 갑자기 이상해지지 않음 (알고리즘의 출력이므로)
- **기계 판독 가능**: AI가 정적 값으로는 작동 불가 - 알고리즘이 필요
- **유지보수 용이**: 수백 개 토큰 수정이 아니라 if문 하나 추가로 끝

### Part 4: 새로운 은하 탐험 (Future Frontiers)
**다음 단계:**
- 뷰잉 거리 기반 자동 폰트 크기 계산 (독일 DIN 1450 산업 규격)
- 브랜드 + 개인 취향 혼합 (Material Design의 vibrancy)
- 접근성 자동화 (적록색맹 → Hue 자동 회전)
- 멀티 디바이스 적응 (HMI: 자동차 7개 디스플레이 각각 최적화)

---

## 🎨 알고리즘 디자인 원리: 색상 시스템 사례

### 1. 색상은 3D 공간이다 (HSL Cylinder)
- **Hue (색조)**: 0-360도 회전
- **Saturation (채도)**: 중앙(무채색) → 외곽(완전 포화)
- **Lightness (명도)**: 하단(검정) → 상단(흰색)

### 2. Lightness Scale 알고리즘
**선형 분포 (Naive):**
```
어두움 → 밝음으로 동일 간격 (7단계 균등 분포)
❌ 문제: 시각적으로 부자연스러움
```

**곡선 기반 분포 (Optimal):**
```
Physics of Perception: 인간의 명도 지각 특성을 반영한 곡선
✅ 결과: 부드러운 시각적 전환
```

**실전 데모 (Graph Engine):**
- 곡선 조정 → 전체 색상 스케일 실시간 업데이트
- 새 브랜드 색상 6개 추가? → 입력만 교체하면 토큰 자동 생성
- 15단계 → 11단계로 변경? → 한 줄 수정으로 완료

### 3. Saturation 알고리즘
**평면 채도 (Wrong):**
```
모든 단계에 동일 채도값 적용
❌ 문제: 극단에서 cropping 발생, 밝은 톤 품질 저하
```

**곡선 기반 채도 (Correct):**
```
극단에서 채도 감소 → 중간(base color)에서 최고점
- 어두운 쪽: 빠른 상승 → 느린 하강
- 밝은 쪽: 느린 상승 → 빠른 하강
```

### 4. Hue Rotation 알고리즘
**특수 케이스 처리:**
```javascript
if (hue >= 28 && hue <= 60) { // 노랑-주황 범위
  hue -= 15; // 15도 왼쪽 회전 (빨강 쪽으로)
  // 이유: 탁한 갈색톤 방지
}
```

### 5. 색공간 진화
- **RGB**: 기계용 (Red+Blue+Green 혼합은 인간이 이해 불가)
- **HSL**: 직관적이지만 인간 지각과 불일치
- **LCH, OKLab**: 인간 지각에 더 정확히 매핑 → 더 조화로운 결과

**핵심 원리:**
> "각 색공간은 3D 객체일 뿐이다. 축의 작동 방식만 이해하면 navigable하다."

---

## 📐 수학적 기반: Typography & Spacing

### Type Scale 알고리즘
**선형 분포 (Bad):**
```
12px → 21px → 30px → 39px → 48px
❌ "정신 나간 사람이나 쓸 스케일"
```

**곡선 기반 (Good):**
```
초반: 완만한 성장 (12 → 13 → 16)
후반: 급격한 성장 (20 → 26 → 35 → 96)
```

**Graph Engine 구현:**
- 곡선 조정 → 전체 폰트 사이즈 자동 재계산
- 최대값 96 → 128로 변경? → 중간 단계도 자동 조정

### Spacing Scale
**Harmonic Series 기반:**
- Victor의 발표 인용: "Ratio of 2/5 nodes"
- 반픽셀 반올림 로직 포함
- 노트 변경 → 전체 dimension 값 자동 업데이트

### 핵심 원리
> "자연과 고전 디자인에서 발견되는 수학적 패턴 (황금비, 피보나치)이 균형과 위계를 만든다. 끝없는 픽셀값 목록 대신 몇 가지 핵심 알고리즘 규칙으로 대체 가능하다."

---

## 🛠️ 실전 구현: Context-Driven Token System

### 문제: 수백 개의 토큰을 수동 관리?
**기존 방식:**
```
surface-card-primary-background-light: #FFFFFF
surface-card-primary-foreground-light: #000000
surface-card-secondary-background-light: #F5F5F5
... (수백 개 계속)
```

### 해결: 컨텍스트 기반 자동 계산
**Token Studio 접근법:**
```css
/* 사용자는 이것만 설정 */
data-surface="surface"     /* canvas or surface */
data-appearance="default"  /* default, subtle, minimal, accent */
data-theme="light"         /* light or dark */

/* 시스템이 자동 계산 */
foreground-default
foreground-subtle
stroke-minimal
background
```

**실제 데모:**
- Card 컴포넌트에 `data-appearance="subtle"` 설정
- 시스템이 자동으로 대비 색상, 스트로크, 아이콘 색상 계산
- 접근성 자동 보장 (WCAG/APCA 준수)
- Appearance 변경: `default` → `accent` → `minimal` → 즉시 반영
- 브랜드 전환: Hea → Penpot → Token Studio → 모든 색상/둥근 정도 자동 조정

### 입력 토큰 (헤아 브랜드 예시)
```json
{
  "fonts": ["Font1", "Font2", "Font3"],
  "pillShape": true,
  "neutral": {
    "light": "#F5F5F5",
    "dark": "#1A1A1A"  // 극명한 대비 선호
  },
  "roundness": 0.8  // 0(각짐) ~ 1(완전 둥글음)
}
```

**결과:**
- 입력 토큰: ~20개
- 자동 생성 토큰: 수천 개
- 사용자 노출 색상 선택기: 스크롤 가능한 간결한 팔레트

### 코드 통합 (CSS)
```html
<div data-appearance="accent" data-surface="surface">
  <!-- 자동으로 접근 가능한 on-color 적용 -->
</div>
```

```javascript
element.setAttribute('data-appearance', 'success');
// → 녹색 배경 + 대비 텍스트 색상 자동 계산
```

---

## 🤖 자동화 전략: Graph Engine 활용

### Graph Engine이란?
- **시각적 노드 기반**: 알고리즘을 연결된 노드로 표현
- **실시간 계산**: 입력 변경 → 즉시 전체 토큰 재생성
- **기계 판독 가능**: AI가 이해하고 수정 가능한 구조

### 실전 워크플로우

#### Step 1: 패턴 스케치 (종이/화이트보드)
```
입력: [Surface Colors] → 반복 → [Contrast Check] → 출력: [Foreground Colors]

예시:
- 입력: negative, positive, warning, info
- 각 색상마다:
  - 배경: surface-color-background
  - 전경: 대비 체크 (WCAG/APCA)
    - 흰색 vs 검정 중 선택
  - 출력: surface-color-foreground
```

#### Step 2: Graph Engine 구현
```
[Input Colors] → [Color Scale Generator] → [Table View]
                ↓
        [Dimension Scale]
                ↓
        [Font Size Scale]
```

**3개의 Scale 동시 실행:**
1. **Color Scale**: Deep Sky Blue 100~1100 (명암 5단계 up/down)
2. **Dimension**: F1~F6 (Foundation dimension)
3. **Font Size**: F1~F10 (12px ~ 96px)

#### Step 3: 곡선 조정으로 미세 튜닝
```
Before: 12 → 21 → 30 → 39 → 48 (선형, 이상함)
↓ 곡선 조정 (초반 완만, 후반 급격)
After: 12 → 13 → 16 → 20 → 26 → 35 → 96 (자연스러움)
```

### 유지보수의 혁명
**전통적 방식:**
```
1. 포토샵에서 500개 레이어 수정
2. 브랜드 가이드 PDF 200페이지 업데이트
3. Figma Variables 수천 개 수동 조정
```

**Graph Engine 방식:**
```
1. 곡선 하나 조정 또는 if문 추가
2. 전체 토큰 자동 재계산
3. Figma/Code로 export
```

---

## ✅ 알고리즘 디자인 체크리스트

### 1. 관찰 (Observe Keenly)
- [ ] 성공한 디자인의 공통 패턴 찾기
- [ ] 실패한 디자인의 문제점 분석
- [ ] 표면 너머 반복되는 규칙 탐색

### 2. 가설 수립 (Hypothesize)
- [ ] "이 패턴을 규칙으로 정의할 수 있나?"
- [ ] 수학적 관계로 설명 가능한가? (비율, 곡선, 조건문)
- [ ] LLM 활용: "이 타입 스케일의 알고리즘은 뭐야?"

### 3. 로직 구현 (Define Logic)
- [ ] Graph Engine 또는 코드로 패턴 구현
- [ ] 반복 가능한 로직으로 변환
- [ ] 예외 케이스 처리 (예: 노랑-주황 Hue 회전)

### 4. 테스트 & 개선 (Refine & Evolve)
- [ ] 다양한 입력값으로 검증
- [ ] 엣지 케이스 확인 (극단적 색상, 크기)
- [ ] 시스템이 성장하면 알고리즘도 업데이트

### 5. 문서화 (Document the Algorithm)
- [ ] 결정 트리 시각화
- [ ] "왜 이 규칙인가?" 맥락 기록
- [ ] 기계 판독 가능한 형태로 저장 (AI 활용 대비)

---

## 🚀 AlphaView 적용 포인트

### 1. 색상 시스템 알고리즘화
**현재 상태 분석:**
- AlphaView의 브랜드 색상이 수동 정의되어 있는가?
- 다크모드 전환 시 색상 생성 로직이 있는가?

**적용 방안:**
```typescript
// 1. 브랜드 색상 입력
const brandColors = {
  primary: '#0066FF',
  success: '#00C851',
  warning: '#FFB100',
  danger: '#FF4444'
};

// 2. 자동 스케일 생성
const generateColorScale = (baseColor: string, mode: 'light' | 'dark') => {
  const lightnessCurve = getCurve(mode); // 곡선 알고리즘
  const saturationCurve = getSaturationCurve(baseColor);
  const hueRotation = getHueRotation(baseColor); // 노랑-주황 처리

  return generateSteps(11, lightnessCurve, saturationCurve, hueRotation);
};

// 3. On-color 자동 계산
const getOnColor = (bg: string, algorithm: 'APCA' | 'WCAG') => {
  return checkContrast(bg, ['#FFFFFF', '#000000'], algorithm);
};
```

### 2. Typography Scale 자동화
**현재:**
```css
font-size: 12px, 14px, 16px, 18px, 24px, 32px... (수동 정의?)
```

**알고리즘 적용:**
```typescript
// 뷰잉 거리 고려 (DIN 1450 규격)
const calculateBaseFontSize = (
  viewingDistance: number, // cm
  xHeight: number,          // 폰트의 x-height 비율
  visualAcuity: number      // 시력
) => {
  // 독일 산업 규격 공식 적용
  return Math.round(/* formula */);
};

// 성장 곡선 기반 스케일
const typeScale = generateScale({
  base: calculateBaseFontSize(60, 0.5, 1.0), // 60cm 모니터 거리
  min: 12,
  max: 96,
  curve: 'ease-in-quad' // 초반 완만, 후반 급격
});
```

### 3. Admin Dashboard Context Tokens
**현재:**
```tsx
// 하드코딩된 색상?
<Card className="bg-white dark:bg-gray-800">
  <Text className="text-gray-900 dark:text-white">
```

**Context-Driven 접근:**
```tsx
<Card data-surface="surface" data-appearance="default">
  <Text data-variant="default">
    {/* 시스템이 자동으로 접근 가능한 색상 적용 */}
  </Text>
</Card>

// 브랜드 전환
<div data-brand="alphaview">
  {/* 모든 하위 요소가 AlphaView 브랜드 토큰 사용 */}
</div>
```

### 4. 크롤러 모니터링 UI 개선
**AlphaView의 크롤러 상태 카드:**
```tsx
// 현재: 수동 색상 매핑?
const statusColor = {
  running: 'green',
  stopped: 'red',
  warning: 'yellow'
};

// 알고리즘 기반:
<StatusCard
  data-appearance={crawlerStatus} // 'success' | 'danger' | 'warning'
  data-surface="surface"
>
  {/* 자동으로 적절한 배경/전경/스트로크 색상 */}
</StatusCard>
```

### 5. 반응형 Spacing 자동화
**적용:**
```typescript
// Harmonic series 기반 spacing
const spacingScale = generateHarmonicScale({
  base: 8, // 8px 기준
  ratio: 2/5, // Victor의 접근법
  steps: 10
});

// 뷰포트 크기별 자동 조정
const responsiveSpacing = (breakpoint: string) => {
  return spacingScale.map(value =>
    scaleByBreakpoint(value, breakpoint)
  );
};
```

### 6. 개인화 + 브랜드 혼합 (미래 대비)
**Material Design 3 접근법 차용:**
```typescript
// 사용자 색약 대응
const userPreference = {
  colorBlindness: 'red-green',
  preferredHue: 240 // 파란색 계열 선호
};

// 브랜드 + 개인 취향 혼합
const personalizedBrand = mixBrandWithUser(
  brandColors,
  userPreference,
  mixRatio: 0.7 // 70% 브랜드, 30% 개인
);
```

---

## 📚 추천 학습 자료

### 색상 이론
- **Color and Contrast** (Nate Baldwin) - 색공간, 대비 기초
- **Female Colorists in History** (Coffee table book) - 역사적 색상 휠 시각화
- **Standards Manual** - 빈티지 브랜드 가이드 북

### 알고리즘 디자인
- **IDS 2024 - Scalable Scales That Scale** (Nate Baldwin)
- **IDS 2024 - Graph Engine Vision** (Mike & Yan) - AB 테스트, 티켓 통합
- **DIN 1450** (독일 산업 규격) - 뷰잉 거리 기반 타이포그래피

### 도구
- **Graph Engine** (Token Studio) - 시각적 알고리즘 빌더
- **Color Space Visualizer** (Ardov) - 3D 색공간 탐험 도구
- **LLM (ChatGPT/Claude)**: "이 타입 스케일의 수학 공식은?" 질문

---

## 💡 핵심 인사이트

### 1. "알고리즘은 강제하는 것이 아니라 발견하는 것이다"
> 깊은 관찰과 진정한 이해에서 우아한 알고리즘이 자연스럽게 나온다.

### 2. "혼돈은 필요하다"
> 알고리즘은 1일차에 나타나지 않는다. 실험 → 관찰 → 패턴 발견 → 알고리즘화 순서.

### 3. "Context is King"
> 수백 개 토큰을 수동 관리하지 말고, 시스템에 올바른 컨텍스트를 주면 올바른 값을 반환하게 하라. (LLM과 같은 원리)

### 4. "AI 시대 대비"
> 정적 값으로는 AI가 작동 불가. 기계 판독 가능한 알고리즘이 있어야 AI가 디자인 시스템을 이해하고 수정 가능.

### 5. "미래: 음성으로 알고리즘 구축"
> Gemini 같은 음성 모델로 Graph Engine과 대화하며 "어두운 쪽 채도를 좀 낮춰줘" → 자동으로 노드 추가/수정.

---

## 🎯 실행 로드맵 (AlphaView 팀용)

### Phase 1: 현황 분석 (1주)
- [ ] 현재 색상 시스템 audit (수동 정의 vs 자동 생성)
- [ ] Typography scale 분석
- [ ] 반복되는 패턴 식별 (예: 상태별 색상 매핑)

### Phase 2: 핵심 알고리즘 구축 (2주)
- [ ] 색상 생성 알고리즘 (Lightness/Saturation/Hue curves)
- [ ] On-color 자동 계산 (APCA 기반)
- [ ] Type/Spacing scale 자동화

### Phase 3: Context Token 시스템 (2주)
- [ ] `data-appearance` 기반 컴포넌트 리팩토링
- [ ] Admin Dashboard 적용
- [ ] Storybook으로 모든 조합 테스트

### Phase 4: 자동화 파이프라인 (1주)
- [ ] Figma Variables export 자동화
- [ ] Tailwind config 자동 생성
- [ ] 문서 자동 생성 (알고리즘 설명 포함)

### Phase 5: 미래 대비 (지속)
- [ ] 개인화 시스템 기반 설계
- [ ] 접근성 자동 최적화 (색약 대응 등)
- [ ] 멀티 디바이스 적응 로직

---

**Marco의 말:**
> "우리는 더 이상 별을 관찰하는 사람이 아니다. 우리는 우주 시스템의 설계자다. 알고리즘으로 무장하고, 비율로 힘을 얻고, 아주 잘 차려입었다." 🌌

**연락처**: 해결 불가능해 보이는 디자인 챌린지가 있다면 Marco에게 연락 - "가장 어려운 문제를 가져오세요. 저는 도전을 사랑합니다."
