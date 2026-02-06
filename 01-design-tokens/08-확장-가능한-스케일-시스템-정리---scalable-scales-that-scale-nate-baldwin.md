# 확장 가능한 스케일 시스템 정리 - Scalable Scales That Scale (Nate Baldwin)

> Original issue: shaun0927/stocktitan-crawler#538

# 확장 가능한 스케일 시스템 정리 - Scalable Scales That Scale

> **출처**: Into Design Systems 컨퍼런스 - Nate Baldwin (Adobe Spectrum, Leonardo/Proportio 개발자)
> **핵심 주제**: 디자인 시스템에서 타입, 간격, 컴포넌트 크기를 수학적으로 확장 가능하게 만드는 방법론

---

## 📌 핵심 철학

### 문제 인식: "픽셀 그리드는 쓰레기다"

**기존 8px 그리드 시스템의 한계**:
- 선형 진행(Linear Progression): `8, 16, 24, 32, 40, 48...`
- 절대 차이는 일정(8px)하지만 **상대 차이는 불균형**
  - 8px → 16px = 100% 증가
  - 96px → 104px = 8% 증가
- 결과: 큰 값일수록 차이가 불명확해져 **사용성 저하**
- 컴포넌트 높이 vs 내부 패딩이 그리드에 **동시에 맞지 않음**
- "일관성 없이 적용되는 규칙은 시스템이 아니다"

### 해결 방향: 비례 스케일(Proportional Scale)

```
픽셀 그리드 (선형) → Modular Scale (기하급수적)
절대 차이 고정 → 상대 비율 고정
주관적 예외 발생 → 수학적 일관성 보장
```

---

## 🎯 시스템 설계 원칙

### 1. **캡슐화(Encapsulation)** - 문제를 작은 단위로 분리

복잡한 시스템 문제를 3개의 독립적 관계로 분해:

| 관계 | 입력 | 출력 | 목적 |
|------|------|------|------|
| **반응형(Responsive)** | 뷰포트 너비 | 텍스트/간격 크기 | 화면 크기별 최적화 |
| **확장성(Extensibility)** | 컴포넌트 유형 | 크기/밀도 옵션 | 다양한 UI 패턴 지원 |
| **접근성(Accessibility)** | 사용자 선호 텍스트 크기 | 모든 텍스트 크기 | 개인화 |

**시스템 다이어그램 작성의 중요성**:
- 각 관계를 시각화 → 의존성 파악
- 예: 컴포넌트 높이 = `간격 + line-height + 텍스트 크기`
- **컴포넌트 높이는 직접 제어 대상이 아닌 시스템 출력값**

### 2. **파라미터화(Parameterization)** - 최소 변수로 전체 제어

**타입 스케일 생성 공식**:
```javascript
textSize = baseSize × ratio^n

// 예시: baseSize=16px, ratio=1.2, n=4
textSize = 16 × 1.2^4 = 33.18px → (반올림) 34px
```

**파라미터 분류**:
- **설계 파라미터(Design Parameters)**: 시스템 제작자가 제어
  - `baseSize` (기본 크기)
  - `ratio` (비율)
  - `viewport breakpoints` (중단점)
- **가변 파라미터(Variable Parameters)**: 사용자가 제어
  - 뷰포트 너비
  - 선호 텍스트 크기

### 3. **추상화(Abstraction)** - 공통 패턴을 템플릿화

**컴포넌트 원형(Archetype)** 개념:
- 대부분의 기본 컴포넌트는 동일한 구조를 공유
  - 텍스트 + 아이콘/컨트롤
  - 텍스트-아이콘 간 고정된 간격
  - 경계가 있는 경우 일관된 패딩
- 이 공통 패턴을 **하나의 템플릿**으로 정의
- 모든 컴포넌트가 이 템플릿에서 파생

---

## 🔢 수학적 기반: Modular Scale

### 타입 스케일 (Type Scale)

**기본 공식**:
```javascript
function textSize(base, ratio, n) {
  const size = base * Math.pow(ratio, n);
  // 디자이너를 위한 반올림: 짝수로 정규화
  return Math.round(size / 2) * 2;
}

// 예시
textSize(16, 1.2, 0)  → 16px  (기본)
textSize(16, 1.2, 1)  → 20px  (1단계 크게)
textSize(16, 1.2, -1) → 14px  (1단계 작게)
textSize(16, 1.2, 4)  → 34px  (4단계 크게)
```

**반응형 타입 스케일**:
```javascript
function getResponsiveTextSize(n) {
  let base, ratio;

  if (viewportWidth < 768) {
    base = 14; ratio = 1.15;  // 모바일: 작은 기본, 완만한 비율
  } else if (viewportWidth < 1440) {
    base = 16; ratio = 1.2;   // 태블릿/데스크톱
  } else {
    base = 20; ratio = 1.3;   // 와이드스크린: 큰 기본, 급격한 비율
  }

  return textSize(base, ratio, n);
}
```

**접근성: REM 변환**:
```javascript
// 픽셀 → REM (사용자 브라우저 설정 반영)
function toRem(px) {
  return px / 16;  // 기본 브라우저 폰트는 16px
}

// REM은 사용자가 브라우저 설정에서 폰트 크기 변경 시 자동 스케일
```

### 간격 스케일 (Spacing Scale)

**타입 스케일과 동일한 공식 재사용**:
```javascript
function spacingSize(base, ratio, n) {
  return Math.round((base * Math.pow(ratio, n)) / 2) * 2;
}

// 단, 간격은 픽셀 유지 (REM 변환 안 함)
// 이유: 텍스트 확대가 전체 레이아웃까지 확대하면 안 됨
```

**왜 타입 스케일 공식을 재사용?**
- 간격은 **텍스트 크기에 비례**해야 관계가 유지됨
- 작은 텍스트 옆 간격 vs 큰 텍스트 옆 간격
- 동일한 ratio 사용 → 시각적 일관성 보장

---

## 🎨 적응형 스케일: 크기(Size) vs 밀도(Density)

### 개념 정의

| 차원 | 정의 | 변경 대상 | 사용 목적 |
|------|------|----------|----------|
| **크기(Size)** | 컴포넌트 전체 크기 | 텍스트 크기 + 간격 | **콘텐츠 계층(Content Hierarchy)** 생성 |
| **밀도(Density)** | 내부 간격만 | 간격만 (텍스트 고정) | **공간 효율성(Space Efficiency)** 조절 |

**예시**:
- `<Button size="large">` → 텍스트 18px, 패딩 12/20px (큰 버튼)
- `<Button size="medium" density="compact">` → 텍스트 16px, 패딩 4/8px (좁은 버튼)
- `<Table density="comfortable">` → 셀 텍스트 16px, 패딩 10/16px (넓은 테이블)

### 구현: 상대 인덱스(Relative Index)

**컴포넌트 원형에서 패딩을 인덱스로 정의**:
```javascript
const componentArchetype = {
  textIndex: 0,           // 기본 텍스트 크기
  paddingVertical: -4,    // 기본 크기보다 4단계 작음 (6px)
  paddingHorizontal: -1,  // 기본 크기보다 1단계 작음 (12px)
  gap: -3                 // 텍스트-아이콘 간격: 3단계 작음 (8px)
};
```

**크기 옵션 생성**:
```javascript
const sizeOffsets = {
  small: -1,    // 모든 인덱스를 -1
  medium: 0,    // 기본
  large: 1      // 모든 인덱스를 +1
};

function getComponentSize(size) {
  const offset = sizeOffsets[size];
  return {
    textSize: textSize(base, ratio, 0 + offset),
    paddingV: spacingSize(base, ratio, -4 + offset),
    paddingH: spacingSize(base, ratio, -1 + offset)
  };
}

// 결과:
// small:  textSize(16, 1.2, -1) = 14px, padding = 4/10px
// medium: textSize(16, 1.2, 0)  = 16px, padding = 6/12px
// large:  textSize(16, 1.2, 1)  = 20px, padding = 8/14px
```

**밀도 옵션 생성**:
```javascript
const densityOffsets = {
  compact: -1,
  regular: 0,
  comfortable: 1
};

const densityFactor = 2;  // 밀도 차이를 더 극명하게 (선택사항)

function getComponentDensity(size, density) {
  const sizeOffset = sizeOffsets[size];
  const densityOffset = densityOffsets[density] * densityFactor;

  return {
    textSize: textSize(base, ratio, 0 + sizeOffset),  // 텍스트는 크기만 반영
    paddingV: spacingSize(base, ratio, -4 + sizeOffset + densityOffset),
    paddingH: spacingSize(base, ratio, -1 + sizeOffset + densityOffset)
  };
}

// 예시: medium + compact (densityFactor=2)
// textSize = 16px (변경 없음)
// paddingV = spacingSize(16, 1.2, -4 + 0 + (-2)) = spacingSize(16, 1.2, -6) = 4px
// paddingH = spacingSize(16, 1.2, -1 + 0 + (-2)) = spacingSize(16, 1.2, -3) = 8px
```

---

## 💻 코드 구현 예시

### 전체 시스템 통합

```javascript
// 설계 파라미터
const config = {
  viewports: [
    { max: 768, base: 14, ratio: 1.15 },
    { max: 1440, base: 16, ratio: 1.2 },
    { max: Infinity, base: 20, ratio: 1.3 }
  ],
  densityFactor: 2
};

// 현재 뷰포트 설정 가져오기
function getCurrentConfig() {
  const vw = window.innerWidth;
  return config.viewports.find(v => vw <= v.max);
}

// 텍스트 크기 계산 (REM으로 출력)
function getTextSize(index) {
  const { base, ratio } = getCurrentConfig();
  const px = Math.round((base * Math.pow(ratio, index)) / 2) * 2;
  return `${px / 16}rem`;  // 접근성을 위한 REM 변환
}

// 간격 크기 계산 (픽셀로 출력)
function getSpacingSize(index) {
  const { base, ratio } = getCurrentConfig();
  return Math.round((base * Math.pow(ratio, index)) / 2) * 2;
}

// 컴포넌트 스타일 생성
function getComponentStyle(size, density) {
  const sizeOffset = { small: -1, medium: 0, large: 1 }[size];
  const densityOffset = { compact: -1, regular: 0, comfortable: 1 }[density];
  const densityShift = densityOffset * config.densityFactor;

  return {
    fontSize: getTextSize(0 + sizeOffset),
    paddingTop: `${getSpacingSize(-4 + sizeOffset + densityShift)}px`,
    paddingBottom: `${getSpacingSize(-4 + sizeOffset + densityShift)}px`,
    paddingLeft: `${getSpacingSize(-1 + sizeOffset + densityShift)}px`,
    paddingRight: `${getSpacingSize(-1 + sizeOffset + densityShift)}px`,
    gap: `${getSpacingSize(-3 + sizeOffset + densityShift)}px`
  };
}

// 사용 예시
const buttonStyle = getComponentStyle('medium', 'regular');
// {
//   fontSize: '1rem',        // 16px (뷰포트 중간 기준)
//   paddingTop: '6px',
//   paddingBottom: '6px',
//   paddingLeft: '12px',
//   paddingRight: '12px',
//   gap: '8px'
// }

// 뷰포트 변경 시 자동 재계산
window.addEventListener('resize', () => {
  document.querySelectorAll('[data-component]').forEach(el => {
    const size = el.dataset.size || 'medium';
    const density = el.dataset.density || 'regular';
    Object.assign(el.style, getComponentStyle(size, density));
  });
});
```

### CSS 변수(Design Tokens) 생성

```javascript
function generateCSSVariables() {
  const { base, ratio } = getCurrentConfig();
  const root = document.documentElement;

  // 타입 스케일 토큰
  for (let i = -4; i <= 8; i++) {
    const size = Math.round((base * Math.pow(ratio, i)) / 2) * 2;
    root.style.setProperty(`--text-${i}`, `${size / 16}rem`);
  }

  // 간격 스케일 토큰
  for (let i = -4; i <= 8; i++) {
    const size = Math.round((base * Math.pow(ratio, i)) / 2) * 2;
    root.style.setProperty(`--space-${i}`, `${size}px`);
  }

  // 컴포넌트 시맨틱 토큰
  root.style.setProperty('--button-text-medium', 'var(--text-0)');
  root.style.setProperty('--button-padding-v-medium', 'var(--space--4)');
  root.style.setProperty('--button-padding-h-medium', 'var(--space--1)');
}

// 초기화 및 반응형 업데이트
generateCSSVariables();
window.addEventListener('resize', generateCSSVariables);
```

---

## ✅ 실전 체크리스트

### 시스템 구축 단계

- [ ] **1단계: 문제 분해**
  - [ ] 시스템 다이어그램 작성 (입력 → 출력 관계)
  - [ ] 3가지 관계 식별: 반응형, 확장성, 접근성
  - [ ] 각 관계를 독립적인 문제로 캡슐화

- [ ] **2단계: 타입 스케일 정의**
  - [ ] 기본 크기(baseSize) 선택: 모바일 14px, 데스크톱 16px, 와이드 20px
  - [ ] 비율(ratio) 선택: 1.15 ~ 1.3 (완만 ~ 급격)
  - [ ] 뷰포트별 조건부 설정 구현
  - [ ] REM 변환 (접근성)
  - [ ] 반올림 규칙 (짝수 선호)

- [ ] **3단계: 간격 스케일 정의**
  - [ ] 타입 스케일 공식 재사용
  - [ ] 픽셀 단위 유지 (REM 변환 안 함)
  - [ ] 뷰포트 반응형 지원

- [ ] **4단계: 컴포넌트 원형 설계**
  - [ ] 기본 컴포넌트들의 공통 패턴 추출
  - [ ] 패딩/간격을 상대 인덱스로 정의
  - [ ] 크기 옵션 배열 정의 (small/medium/large)
  - [ ] 밀도 옵션 배열 정의 (compact/regular/comfortable)
  - [ ] 밀도 계수(densityFactor) 결정

- [ ] **5단계: 구현 및 테스트**
  - [ ] CSS 변수/디자인 토큰 생성
  - [ ] 반응형 업데이트 로직 구현
  - [ ] 다양한 뷰포트/텍스트 크기에서 테스트
  - [ ] 접근성 검증 (브라우저 폰트 크기 변경 테스트)

### 마이그레이션 고려사항

- [ ] **점진적 적용**
  - [ ] 모든 컴포넌트를 한 번에 반응형으로 만들지 말 것
  - [ ] 헤딩은 반응형 우선 적용
  - [ ] 본문/컴포넌트 텍스트는 제품 특성에 따라 선택

- [ ] **플랫폼별 전략**
  - [ ] 웹: CSS 변수 + 미디어 쿼리
  - [ ] 모바일 앱: 뷰포트별 별도 토큰 세트
  - [ ] 크로스플랫폼: 함수형 토큰 생성 로직 공유

- [ ] **문서화**
  - [ ] 시스템 다이어그램 공유
  - [ ] 팀별 필요 정보만 제공 (모바일팀 ≠ 마케팅팀)
  - [ ] 수학적 세부사항은 숨기고 결과만 제시

---

## 🎯 AlphaView 적용 포인트

### 현재 상황 분석

AlphaView는 Next.js + Tailwind 기반으로 Tailwind의 기본 스케일 시스템을 사용 중:
- 간격: `p-2, p-4, p-6` 등 (4px 단위 선형 스케일)
- 텍스트: `text-sm, text-base, text-lg` 등 (사전 정의된 크기)
- 반응형: `md:text-xl, lg:p-8` 등 (중단점별 수동 지정)

**현재 문제점**:
- 큰 화면에서 텍스트/간격이 상대적으로 작게 보임
- Admin 대시보드의 밀도 조절 불가 (차트 많은 페이지 vs 넓은 여백 필요한 페이지)
- 일관된 비례 관계 부족 (컴포넌트마다 주관적 크기 선택)

### 적용 전략

#### Phase 1: 타입 스케일 시스템 (우선순위 HIGH)

**1. Tailwind 설정 확장**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        // Modular Scale: base=16px, ratio=1.2
        'xs': ['0.69rem', { lineHeight: '1rem' }],    // 11px (index -4)
        'sm': ['0.83rem', { lineHeight: '1.25rem' }], // 13px (index -3)
        'base': ['1rem', { lineHeight: '1.5rem' }],   // 16px (index 0)
        'lg': ['1.2rem', { lineHeight: '1.75rem' }],  // 19px (index 1)
        'xl': ['1.44rem', { lineHeight: '2rem' }],    // 23px (index 2)
        '2xl': ['1.73rem', { lineHeight: '2.25rem' }],// 28px (index 3)
        '3xl': ['2.07rem', { lineHeight: '2.5rem' }], // 33px (index 4)
        '4xl': ['2.49rem', { lineHeight: '3rem' }],   // 40px (index 5)
      },
      // 반응형 타입 스케일
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1440px',
        '2xl': '1920px',
      }
    }
  }
}
```

**2. CSS 변수로 반응형 베이스 구현**:
```css
/* globals.css */
:root {
  --base-size: 14px;
  --ratio: 1.15;
}

@media (min-width: 768px) {
  :root {
    --base-size: 16px;
    --ratio: 1.2;
  }
}

@media (min-width: 1440px) {
  :root {
    --base-size: 18px;
    --ratio: 1.25;
  }
}
```

**3. 헤딩 컴포넌트 우선 적용**:
```tsx
// components/typography/Heading.tsx
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

const levelMap = {
  1: 'text-3xl md:text-4xl xl:text-5xl',  // 반응형 스케일
  2: 'text-2xl md:text-3xl xl:text-4xl',
  3: 'text-xl md:text-2xl xl:text-3xl',
  4: 'text-lg md:text-xl xl:text-2xl',
  5: 'text-base md:text-lg xl:text-xl',
  6: 'text-sm md:text-base xl:text-lg',
};

export function Heading({ level, children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return <Tag className={levelMap[level]}>{children}</Tag>;
}
```

#### Phase 2: 간격 스케일 시스템 (우선순위 MEDIUM)

**Tailwind 간격 확장**:
```javascript
// tailwind.config.js - spacing 섹션
spacing: {
  // Modular Scale과 동일한 비율 적용
  'xs': '0.5rem',   // 8px  (index -3)
  'sm': '0.75rem',  // 12px (index -1)
  'md': '1rem',     // 16px (index 0)
  'lg': '1.5rem',   // 24px (index 2)
  'xl': '2.25rem',  // 36px (index 4)
  '2xl': '3.5rem',  // 56px (index 6)
}
```

**실전 적용 예시**:
```tsx
// Before
<div className="p-4 gap-2">

// After (비례 관계 명확)
<div className="p-md gap-sm">  // 16px padding, 12px gap
```

#### Phase 3: Admin 대시보드 밀도 시스템 (우선순위 LOW)

**Context API로 밀도 설정 관리**:
```tsx
// contexts/DensityContext.tsx
type Density = 'compact' | 'regular' | 'comfortable';

const DensityContext = createContext<{
  density: Density;
  setDensity: (d: Density) => void;
}>({ density: 'regular', setDensity: () => {} });

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<Density>('regular');
  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

// Admin 페이지에서 사용
export default function AdminStatsPage() {
  const { density, setDensity } = useDensity();

  return (
    <div className={`density-${density}`}>
      <select value={density} onChange={e => setDensity(e.target.value)}>
        <option value="compact">Compact</option>
        <option value="regular">Regular</option>
        <option value="comfortable">Comfortable</option>
      </select>
      {/* 차트, 테이블 등 */}
    </div>
  );
}
```

**CSS로 밀도별 간격 조정**:
```css
/* globals.css */
.density-compact {
  --card-padding: 0.5rem;
  --section-gap: 0.75rem;
}

.density-regular {
  --card-padding: 1rem;
  --section-gap: 1.5rem;
}

.density-comfortable {
  --card-padding: 1.5rem;
  --section-gap: 2.25rem;
}
```

### 예상 효과

- **반응형 개선**: 모바일(작은 텍스트) ↔ 와이드스크린(큰 텍스트) 자동 조정
- **일관성**: 모든 크기가 동일한 비율로 증가 → 시각적 조화
- **접근성**: REM 기반 → 사용자 브라우저 폰트 설정 자동 반영
- **유지보수**: 파라미터 2개(base, ratio) 조정으로 전체 시스템 튜닝

### 마이그레이션 위험 최소화

1. **점진적 롤아웃**: 헤딩 → 카드 → 버튼 → 전체 순으로 적용
2. **시각적 회귀 테스트**: Playwright 스크린샷 비교
3. **피드백 수집**: Admin 사용자에게 밀도 옵션 만족도 조사

---

## 🛠️ 추천 도구

| 도구 | 용도 | URL |
|------|------|-----|
| **Proportio** | Modular Scale 계산기 (Nate Baldwin 개발) | [proportio.app](https://proportio.app) |
| **Utopia** | CSS clamp() 기반 Fluid 타이포그래피 | [utopia.fyi](https://utopia.fyi) |
| **Token Studio** | Figma 플러그인 (시스템 다이어그램 → 토큰) | [tokens.studio](https://tokens.studio) |

**주의**: CSS `clamp()` 함수는 접근성 이슈 있음 (텍스트 스케일 방해 가능) → 조사 후 사용

---

## 📚 핵심 용어 정리

| 용어 | 한글 | 설명 |
|------|------|------|
| **Modular Scale** | 모듈 스케일 | 기하급수적 비율로 생성된 크기 체계 |
| **Parameterization** | 파라미터화 | 최소 변수로 시스템 전체 제어 |
| **Encapsulation** | 캡슐화 | 복잡한 문제를 독립적 부분으로 분리 |
| **Abstraction** | 추상화 | 공통 패턴을 재사용 가능한 템플릿으로 변환 |
| **Archetype** | 원형 | 모든 컴포넌트가 파생되는 기본 템플릿 |
| **Relative Index** | 상대 인덱스 | 기본 크기 대비 몇 단계 떨어진 값인지 표현 |
| **Design Tokens** | 디자인 토큰 | 디자인 결정을 코드로 표현한 변수 |

---

## 💡 주요 인사이트

1. **"픽셀 그리드는 시스템이 아니다"** - 주관적 예외가 필요한 규칙은 확장 불가
2. **컴포넌트 높이는 출력값이지 입력값이 아니다** - 간격+텍스트 크기가 높이를 결정
3. **모든 것을 반응형으로 만들 필요는 없다** - 헤딩은 반응형, 본문은 고정이 더 나을 수도
4. **크기(Size) ≠ 밀도(Density)** - 계층 구조 vs 공간 효율성은 별개 차원
5. **시스템 다이어그램을 먼저 그려라** - 구현 전에 관계를 시각화하면 문제가 명확해짐
6. **파라미터 2개로 수백 개의 값을 제어** - baseSize + ratio = 전체 스케일 시스템
7. **팀별로 다른 문서를 제공하라** - 모바일팀은 모바일 값만, 마케팅팀은 반응형 로직만

---

**작성 기준**: 2026-02-05
**발표자**: Nate Baldwin (Adobe Spectrum, Leonardo/Proportio 개발자)
**컨퍼런스**: Into Design Systems 2023
