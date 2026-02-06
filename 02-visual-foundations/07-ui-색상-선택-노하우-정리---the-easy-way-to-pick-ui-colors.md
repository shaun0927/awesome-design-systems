# UI 색상 선택 노하우 정리 - The Easy Way to Pick UI Colors

> Original issue: shaun0927/stocktitan-crawler#511

# UI 색상 선택 노하우 정리 - The Easy Way to Pick UI Colors

> **출처**: [The Easy Way to Pick UI Colors - YouTube](https://www.youtube.com/watch?v=_2LLXnUdUIc)
> **정리 관점**: 디자인 시스템 효율성 및 실무 적용 노하우

---

## 📌 핵심 철학

### 1. UI 색상은 단순하게
```
색상 과학자가 될 필요 없음 → UI에서는 3가지 색상 카테고리면 충분
```

| 카테고리 | 용도 | 예시 |
|---------|------|------|
| **Neutral Colors** | 배경, 텍스트, 테두리 등 기본 UI 요소 | Gray scale |
| **Primary/Brand Colors** | 주요 액션 버튼, 브랜딩 | Blue, Purple 등 |
| **Semantic Colors** | 상태 표시 (성공/에러/경고) | Green, Red, Yellow |

### 2. "색상"이 아닌 "Shades"로 생각하기
- 버튼 hover, gradient 배경 등 → 같은 색의 명암 변화
- **올바른 색상 포맷 선택이 palette 생성의 핵심**

---

## 🎨 색상 포맷 비교

### ❌ Hex/RGB의 문제점
```css
/* Gray shades in RGB - 규칙성이 전혀 보이지 않음 */
background-1: rgb(13, 13, 13);
background-2: rgb(26, 26, 26);
background-3: rgb(38, 38, 38);
```

### ✅ HSL/OKLCH의 장점
```css
/* HSL - 직관적인 명암 제어 */
background-1: hsl(0, 0%, 5%);   /* Lightness: 5% */
background-2: hsl(0, 0%, 10%);  /* Lightness: 10% */
background-3: hsl(0, 0%, 15%);  /* Lightness: 15% */

/* 수학적으로 조화로운 팔레트, 추측 불필요 */
```

---

## 🛠️ 실전 색상 시스템 구축

### Step 1: Neutral Palette 생성 (Dark Mode)

**HSL 파라미터 이해:**
```
hsl(hue, saturation, lightness)
   ↓      ↓           ↓
 0-360  0-100%     0-100%
```

**Neutral 생성 규칙:**
| 파라미터 | 값 | 이유 |
|---------|---|------|
| Hue | `0` (상관없음) | Saturation이 0이면 Hue는 무의미 |
| Saturation | `0%` | 중립 색상 → 채도 제거 |
| Lightness | `0% → 5% → 10%` | 단계별 명암 변화 |

**배경 색상 3단계:**
```css
:root {
  /* Dark Mode */
  --bg-dark: hsl(0, 0%, 0%);    /* Base - 가장 어두운 배경 */
  --bg-base: hsl(0, 0%, 5%);    /* Cards, Surface 요소 */
  --bg-light: hsl(0, 0%, 10%);  /* Raised 요소 (사용자에게 더 가까움) */
}
```

**시각적 위계 원칙:**
```
더 밝은 요소 = 위에 떠 있음 = 사용자에게 더 가까움
→ 중요한 요소에만 bg-light 사용
```

**텍스트 색상 2단계:**
```css
:root {
  /* Dark Mode */
  --text-primary: hsl(0, 0%, 90%);  /* Headings, 중요 텍스트 */
  --text-muted: hsl(0, 0%, 70%);    /* Body text, 부가 정보 */
}
```

**⚠️ 100% Lightness를 피하는 이유:**
```css
/* ❌ 너무 강렬함 */
--text-primary: hsl(0, 0%, 100%);

/* ✅ 눈에 편안함 */
--text-primary: hsl(0, 0%, 90%);
```

---

### Step 2: Light Mode 전환

**간단한 수학 변환:**
```css
/* Dark Mode lightness - 100 = Light Mode 시작점 */
Dark: 0%  → Light: 100%
Dark: 5%  → Light: 95%
Dark: 10% → Light: 90%
```

**수동 조정 필요:**
```css
body.light-mode {
  /* ⚠️ 주의: BG dark/light 의미가 반전됨 */
  --bg-dark: hsl(0, 0%, 100%);  /* 이제 가장 밝은 배경 */
  --bg-base: hsl(0, 0%, 98%);
  --bg-light: hsl(0, 0%, 95%);  /* 이제 가장 어두운 배경 */
}
```

**빛의 방향 고려:**
```
Light Mode: 빛이 위에서 오므로 → 위쪽 요소가 가장 밝아야 함
Dark Mode: 빛이 아래에서 오므로 → 위쪽 요소가 가장 어두워야 함
```

**네이밍 전략:**
```css
/* ✅ 좋은 네이밍 (모드 독립적) */
--bg-dark, --bg-base, --bg-light
--text-primary, --text-muted

/* ❌ 나쁜 네이밍 (모드 의존적) */
--bg-darkest, --bg-lightest  /* Light Mode에서 의미가 반전됨 */
```

---

### Step 3: CSS 변수 구조화

```css
/* 기본 테마 (Root) */
:root {
  /* === Neutral Colors === */
  --bg-dark: hsl(0, 0%, 0%);
  --bg-base: hsl(0, 0%, 5%);
  --bg-light: hsl(0, 0%, 10%);

  --text-primary: hsl(0, 0%, 90%);
  --text-muted: hsl(0, 0%, 70%);

  /* === Interactive Elements === */
  --border: hsl(0, 0%, 15%);
  --highlight: hsl(0, 0%, 20%);

  /* === Gradients === */
  --gradient-bg: linear-gradient(
    to bottom,
    var(--bg-light),
    var(--bg-base)
  );

  /* === Shadows (Dark Mode는 보통 불필요) === */
  --shadow: none;
}

/* Light Mode */
body.light-mode {
  --bg-dark: hsl(0, 0%, 100%);
  --bg-base: hsl(0, 0%, 98%);
  --bg-light: hsl(0, 0%, 95%);

  --text-primary: hsl(0, 0%, 10%);
  --text-muted: hsl(0, 0%, 40%);

  --border: hsl(0, 0%, 85%);
  --highlight: hsl(0, 0%, 100%);

  --gradient-bg: linear-gradient(
    to bottom,
    var(--bg-light),
    var(--bg-base)
  );

  /* Light Mode는 Shadow 필수 */
  --shadow:
    0 1px 2px hsla(0, 0%, 0%, 0.1),
    0 4px 8px hsla(0, 0%, 0%, 0.05);
}

/* 적용 */
body {
  background: var(--bg-dark);
  color: var(--text-primary);
}
```

---

### Step 4: 테마 전환 구현

**방법 1: JavaScript Toggle**
```javascript
document.body.classList.toggle('light-mode');
```

**방법 2: 시스템 설정 자동 반영**
```css
@media (prefers-color-scheme: light) {
  :root {
    --bg-dark: hsl(0, 0%, 100%);
    --bg-base: hsl(0, 0%, 98%);
    /* ... */
  }
}
```

---

## 🎯 Advanced Techniques

### 1. Gradient + Hover 효과

```css
.card {
  background: var(--gradient-bg);
  border-top: 1px solid var(--highlight);
  border: 1px solid var(--border);
  transition: background 0.3s ease;
}

.card:hover {
  /* Hover 시 gradient를 더 강조 */
  background: linear-gradient(
    to bottom,
    hsl(0, 0%, 12%),  /* 더 밝게 */
    var(--bg-base)
  );
}
```

**효과:**
- 빛이 위에서 오는 것처럼 보임
- Top border highlight로 "빛나는" 느낌 강화

---

### 2. Light Mode Shadow 전략

```css
body.light-mode {
  /* 2개의 Shadow 레이어 조합 */
  --shadow:
    0 1px 2px hsla(0, 0%, 0%, 0.1),   /* 짧고 진한 그림자 */
    0 4px 8px hsla(0, 0%, 0%, 0.05);  /* 길고 연한 그림자 */
}

.card {
  box-shadow: var(--shadow);
}
```

**원칙:**
```
빛이 있으면 그림자도 있음
→ Light Mode에서는 Shadow가 깊이감 생성의 핵심
→ Dark Mode에서는 Gradient/Border로 충분
```

---

### 3. Hue + Saturation 추가

**지금까지:**
```css
hsl(0, 0%, 10%)  /* Hue=0, Saturation=0 (완전 중립) */
```

**분위기 추가:**
```css
/* Cool & Vibrant (Blue tint) */
hsl(220, 15%, 10%)

/* Warm & Neutral (Orange tint) */
hsl(30, 8%, 10%)
```

**규칙:**
| 효과 | Hue | Saturation |
|------|-----|------------|
| Cool (차가운) | 200-240 (Blue) | 10-20% |
| Warm (따뜻한) | 20-40 (Orange) | 5-15% |
| Neutral (중립) | 아무거나 | 0-5% |

---

## 🚀 OKLCH: 차세대 색상 포맷

### HSL vs LCH vs OKLCH 비교

| 포맷 | L (Lightness) | C/S | H (Hue) | 장점 | 단점 |
|------|---------------|-----|---------|------|------|
| **HSL** | 0-100% | S: 0-100% | 0-360° | 직관적, 넓은 지원 | Lightness 불균일 (어두운/밝은 끝에서 채도 손실) |
| **LCH** | 0-100 | C: 0-4 | 0-360° | Lightness 균일, 자연스러운 shades | 브라우저 지원 제한적 |
| **OKLCH** | 0-1 | C: 0-0.4 | 0-360° | LCH 개선판, Tailwind v4 기본값 | 최신 브라우저만 지원 |

### OKLCH 실전 예시

```css
:root {
  /* OKLCH 포맷 */
  --bg-dark: oklch(0% 0 0);        /* L=0%, C=0, H=0 */
  --bg-base: oklch(5% 0.01 220);   /* L=5%, C=0.01, H=220 (Blue tint) */
  --bg-light: oklch(10% 0.02 220);

  --text-primary: oklch(90% 0 0);
  --text-muted: oklch(70% 0 0);
}
```

**Chroma 사용 범위:**
```
UI 작업에서는 C=0~0.15 (최대 0.2)면 충분
→ 너무 높으면 과도하게 채도가 높아짐
```

---

## 📊 색상 포맷별 Shades 비교

### 테스트 결과 (동일한 Lightness 증가 적용 시)

| Lightness | HSL | LCH | OKLCH |
|-----------|-----|-----|-------|
| 10% | 채도 거의 없음 | 자연스러운 채도 유지 | 가장 자연스러움 |
| 50% | 정상 | 정상 | 정상 |
| 90% | 채도 거의 없음 | 자연스러운 채도 유지 | 가장 자연스러움 |

**결론:**
```
HSL: 어두운/밝은 끝에서 채도 손실 심함
LCH/OKLCH: 전체 범위에서 일관된 채도 유지
→ Gradient/Shades가 더 자연스럽고 조화로움
```

---

## ✅ 실전 체크리스트

### 색상 시스템 구축 순서

```
☐ 1. HSL/OKLCH 포맷 선택 (OKLCH 권장, HSL도 충분)
☐ 2. Neutral Palette 생성 (Saturation=0)
     ├─ Background 3단계 (dark/base/light)
     └─ Text 2단계 (primary/muted)
☐ 3. Light Mode 전환 (100 - Lightness)
☐ 4. CSS Variables 정의 (:root, body.light-mode)
☐ 5. Interactive Elements 추가
     ├─ Border
     ├─ Highlight (top border)
     ├─ Gradient
     └─ Shadow (Light Mode only)
☐ 6. Hue + Saturation으로 분위기 조정 (선택)
☐ 7. Primary/Brand Color 추가 (같은 로직 적용)
☐ 8. Semantic Colors 추가 (success/error/warning)
```

---

## 🎯 AlphaView 적용 포인트

### 현재 상태 분석 필요 사항

1. **색상 포맷 확인**
   ```bash
   # Tailwind 설정 확인
   grep -r "hsl\|oklch\|rgb" tailwind.config.js
   ```

2. **Neutral Palette 일관성 체크**
   ```css
   /* 현재 배경/텍스트 색상이 수학적으로 일관된 간격인가? */
   --bg-1: ? → --bg-2: ? → --bg-3: ?
   ```

3. **Light/Dark Mode 전환 로직**
   ```typescript
   // AuthContext 또는 별도 ThemeContext에서 관리 중?
   ```

### 권장 개선 작업

| 작업 | 우선순위 | 예상 효과 |
|------|---------|----------|
| CSS Variables로 색상 중앙 관리 | 🔴 HIGH | 유지보수성 대폭 향상 |
| OKLCH 포맷 도입 (Tailwind v4) | 🟡 MEDIUM | Shades 자연스러움 개선 |
| Shadow 시스템 정리 | 🟡 MEDIUM | Light Mode 깊이감 향상 |
| Gradient + Highlight 활용 | 🟢 LOW | Premium 느낌 강화 |

### 구체적 구현 예시 (AlphaView)

```css
/* frontend/nextjs-app/src/app/globals.css */
:root {
  /* === Neutral Base === */
  --bg-dark: oklch(0% 0 0);
  --bg-base: oklch(5% 0.01 220);  /* 약간 Blue tint */
  --bg-light: oklch(10% 0.02 220);

  --text-primary: oklch(90% 0 0);
  --text-muted: oklch(70% 0 0);

  /* === Brand (Blue) === */
  --brand-primary: oklch(60% 0.2 240);  /* AlphaView Blue */
  --brand-hover: oklch(65% 0.22 240);

  /* === Semantic === */
  --success: oklch(65% 0.18 145);  /* Green */
  --error: oklch(60% 0.22 25);     /* Red */
  --warning: oklch(75% 0.15 85);   /* Yellow */
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-dark: oklch(100% 0 0);
    --bg-base: oklch(98% 0.005 220);
    --bg-light: oklch(95% 0.01 220);

    --text-primary: oklch(15% 0 0);
    --text-muted: oklch(45% 0 0);

    /* Light Mode Shadow */
    --shadow:
      0 1px 2px oklch(0% 0 0 / 0.1),
      0 4px 8px oklch(0% 0 0 / 0.05);
  }
}
```

### Tailwind 통합 (tailwind.config.js)

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: {
          dark: 'var(--bg-dark)',
          base: 'var(--bg-base)',
          light: 'var(--bg-light)',
        },
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        brand: {
          DEFAULT: 'var(--brand-primary)',
          hover: 'var(--brand-hover)',
        },
      },
      boxShadow: {
        'card': 'var(--shadow)',
      },
    },
  },
};
```

---

## 📚 핵심 Takeaways

| 원칙 | 설명 |
|------|------|
| **단순함이 최고** | Neutral + Primary + Semantic = 충분 |
| **포맷이 중요** | HSL/OKLCH >> Hex/RGB (수학적 일관성) |
| **Shades로 생각** | 단일 색상의 명암 변화로 palette 구성 |
| **Light Mode ≠ Dark Mode 반전** | 빛의 방향 고려하여 수동 조정 필요 |
| **CSS Variables 필수** | 중앙 관리로 테마 전환 간소화 |
| **Shadow = 깊이감** | Light Mode에서 특히 중요 |
| **OKLCH 권장** | 더 자연스러운 shades, 미래 표준 |

---

## 🔗 유용한 리소스

- **색상 도구**: [OKLCH Color Picker](https://oklch.com)
- **Tailwind OKLCH**: [Tailwind CSS v4 Color System](https://tailwindcss.com/docs/colors)
- **대비 체크**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Gradient Generator**: [CSS Gradient](https://cssgradient.io/)

---

**작성일**: 2026-02-05
**관련 이슈**: #510 (SEC Data UI 개선)
**다음 액션**: AlphaView 색상 시스템 진단 → CSS Variables 마이그레이션 계획 수립
