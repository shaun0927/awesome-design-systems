# 웹사이트 구축 23가지 핵심 해킹 노하우 정리 - 23 Hacks about Building Websites

> Original issue: shaun0927/stocktitan-crawler#518

# 웹사이트 구축 23가지 핵심 해킹 노하우 정리

## 개요

이 문서는 웹 개발 효율성을 극대화하는 23가지 실전 노하우를 정리한 것입니다. CSS 트릭, HTML 네이티브 기능 활용, 이미지 최적화, VS Code 단축키까지 - 디자인 시스템 구축과 개발 워크플로우 개선에 즉시 적용 가능한 실용적인 팁들입니다.

---

## 23가지 해킹 상세 설명

### 1. HSL 색상 체계 활용

**핵심**: RGB 대신 HSL(Hue, Saturation, Lightness)을 사용하면 코드만으로 색상 조작이 가능합니다.

```css
/* HSL 구조 */
color: hsl(210, 80%, 50%);
/* Hue(색상): 0-360도 색상환 위치 */
/* Saturation(채도): 0-100% 색의 선명도 */
/* Lightness(명도): 0-100% 밝기 */

/* Hover 상태 - 명도만 증가 */
.button {
  background: hsl(210, 80%, 50%);
}
.button:hover {
  background: hsl(210, 80%, 60%); /* L값만 변경 */
}
```

**장점**:
- 색상 팔레트 생성 시 컬러휠 불필요
- 다크모드 대응 색상을 코드로 생성 가능
- 채도/명도 조절로 무한한 shade 생성

---

### 2. 색상 조합 자동 생성 공식

**핵심**: Primary 색상 하나로 전체 색상 팔레트를 자동 생성하는 수학 공식입니다.

```css
:root {
  /* Primary 색상 (기준점) */
  --hue-primary: 210;

  /* Primary/Secondary - 채도/명도 조정 */
  --color-primary: hsl(var(--hue-primary), 80%, 50%);
  --color-secondary: hsl(var(--hue-primary), 60%, 70%);

  /* Tertiary/Accent - Hue를 ±60도 이동 */
  --color-tertiary: hsl(calc(var(--hue-primary) - 60), 70%, 55%);
  --color-accent: hsl(calc(var(--hue-primary) + 60), 70%, 55%);
}
```

**수학 원리**:
- Primary ↔ Tertiary/Accent = 120도 간격 (색상환의 삼원색 거리)
- Hue 값만 변경하면 전체 팔레트 재생성
- 다크모드: Lightness 값만 반전 (50% → 30% 등)

**실전 활용**:
1. --hue-primary 값 하나만 조정
2. 모든 색상이 자동으로 조화롭게 변경
3. Shades는 Saturation/Lightness 조합으로 생성

---

### 3. WebP 이미지 포맷 전환

**핵심**: 이미지 품질은 유지하면서 파일 크기를 50% 절감합니다.

**추천 도구**: Squoosh.app

**반응형 이미지 최적화**:
```html
<picture>
  <source srcset="hero-mobile.webp" media="(max-width: 768px)" type="image/webp">
  <img src="hero-desktop.webp" alt="Hero image">
</picture>
```

**성능 개선**:
- 모바일: 750px 너비 이미지 제공
- 데스크톱: 1920px 이미지 제공
- 대역폭 절약 + 로딩 속도 향상

---

### 4. SVG 아이콘 활용

**핵심**: SVG는 벡터 기반으로 용량이 작고 HTML처럼 스타일링 가능합니다.

```css
.icon {
  fill: hsl(210, 80%, 50%);
  width: 24px;
  height: 24px;
}

.icon:hover {
  fill: hsl(210, 80%, 60%);
  transform: scale(1.1);
}

@media (prefers-color-scheme: dark) {
  .icon {
    fill: hsl(210, 80%, 70%);
  }
}
```

**리소스**: Heroicons, Feather Icons, Figma

---

### 5. 다크모드 원라인 구현

```css
:root {
  color-scheme: light dark;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: hsl(210, 20%, 10%);
    --color-text: hsl(210, 10%, 90%);
    --color-accent: hsl(210, 80%, 65%);
  }
}
```

---

### 6. Favicon 자동 로드

favicon.ico 파일을 루트 폴더에 두면 HTML 코드 없이 자동 로드됩니다.

---

### 7. contenteditable 속성

```html
<div contenteditable="true">
  <h3>Q: 이 서비스는 어떻게 사용하나요?</h3>
  <p>여기에 답변을 입력하세요...</p>
</div>
```

---

### 8. inert 속성

```html
<main inert>
  <button>클릭 안 됨</button>
  <a href="/">링크 작동 안 함</a>
</main>
```

---

### 9. Aspect Ratio 반응형 유지

```css
.thumbnail {
  aspect-ratio: 16 / 9;
  width: 100%;
}
```

---

### 10. 네이티브 모달 (dialog 태그)

```html
<dialog id="myModal">
  <h2>모달 제목</h2>
  <button onclick="myModal.close()">닫기</button>
</dialog>
<button onclick="myModal.showModal()">모달 열기</button>
```

**내장 기능**: ESC 키로 자동 닫기, Focus trap

---

### 11. 리스트 스타일 원라인

```css
li {
  list-style: "✓ ";
}
```

---

### 12. inputmode 속성

```html
<input type="text" inputmode="numeric">
<input type="text" inputmode="email">
<input type="text" inputmode="url">
```

**UX 개선**: 모바일에서 입력 유형에 맞는 키보드 자동 표시

---

### 13. text-underline-offset

```css
a {
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

---

### 14. Hover 미디어 쿼리

```css
@media (hover: hover) {
  .button:hover {
    transform: scale(1.05);
  }
}

@media (hover: none) {
  .button:active {
    transform: scale(0.95);
  }
}
```

---

### 15. 네이티브 collapsible

```html
<details>
  <summary>펼치기 / 접기</summary>
  <p>숨겨진 내용...</p>
</details>
```

---

### 16. console.table()

```javascript
console.table([
  { name: 'AAPL', price: 150 },
  { name: 'MSFT', price: 300 },
]);
```

---

### 17-21. VS Code 단축키

| 기능 | Windows/Linux | macOS |
|------|---------------|-------|
| 줄 복제 | Alt + Shift + ↑/↓ | Option + Shift + ↑/↓ |
| 줄 이동 | Alt + ↑/↓ | Option + ↑/↓ |
| 멀티 커서 | Alt + Click | Option + Click |
| 동일 단어 선택 | Ctrl + D | Cmd + D |
| 태그 래핑 | Alt + W | Option + W |

**플러그인**: htmltagwrap, Auto Rename Tag

---

### 22. CSS 3D Transform

```css
.card {
  transform: rotateY(15deg);
  perspective: 1000px;
}
```

---

### 23. HTML Tooltip

```html
<button title="저장하기">💾</button>
```

---

## 추가 고급 기능

### 24. Datalist (자동완성)

```html
<input list="tickers">
<datalist id="tickers">
  <option value="AAPL">
  <option value="MSFT">
</datalist>
```

---

### 25. pre 태그

```html
<pre>
function example() {
  console.log("공백과 줄바꿈이 그대로 유지됨");
}
</pre>
```

---

### 26. ruby 태그

```html
<ruby>
  AAPL <rp>(</rp><rt>Apple Inc.</rt><rp>)</rp>
</ruby>
```

---

### 27-28. progress & meter 태그

```html
<progress value="70" max="100">70%</progress>
<meter value="0.85" min="0" max="1">85%</meter>
```

---

## 카테고리별 정리

| 카테고리 | 해킹 번호 | 핵심 키워드 |
|----------|-----------|-------------|
| 색상 시스템 | 1, 2, 5 | HSL, 자동 팔레트, 다크모드 |
| 이미지 최적화 | 3, 4 | WebP, SVG, 반응형 |
| HTML 네이티브 | 6-10, 15, 23-28 | Dialog, Details, Inert |
| CSS 트릭 | 9, 11, 13, 14, 22 | Aspect Ratio, 3D Transform |
| 모바일 UX | 12, 14 | Inputmode, Touch-friendly |
| 개발 워크플로우 | 16-21 | Console.table, VS Code |

---

## 디자인 시스템 활용법

### 1. 색상 팔레트 자동화
```css
:root {
  --hue-primary: 210;
  --primary-50: hsl(var(--hue-primary), 80%, 95%);
  --primary-500: hsl(var(--hue-primary), 80%, 50%);
  --primary-900: hsl(var(--hue-primary), 80%, 10%);
}
```

### 2. 컴포넌트 라이브러리 구축
```html
<dialog class="modal">
  <slot></slot>
</dialog>
```

### 3. 반응형 이미지 시스템
```
hero-mobile.webp (750px)
hero-tablet.webp (1024px)
hero-desktop.webp (1920px)
```

---

## 체크리스트

### 프로젝트 시작 시
- [ ] HSL 기반 색상 변수 정의
- [ ] 다크모드 설정
- [ ] favicon.ico 배치
- [ ] 이미지 WebP 전환
- [ ] SVG 아이콘 라이브러리 선정

### 컴포넌트 개발 시
- [ ] dialog 태그 사용
- [ ] details/summary 사용
- [ ] aspect-ratio 적용
- [ ] inputmode 적용
- [ ] hover 미디어 쿼리 적용

### 성능 최적화
- [ ] picture 태그로 반응형 이미지
- [ ] SVG 아이콘 활용
- [ ] console.table 디버깅

### 접근성
- [ ] inert 속성 활용
- [ ] alt/title 속성
- [ ] 키보드 탐색 테스트

---

## AlphaView 적용 포인트

### 1. 색상 시스템 리팩토링
```css
:root {
  --hue-alpha: 220;
  --alpha-500: hsl(var(--hue-alpha), 80%, 50%);
}

@media (prefers-color-scheme: dark) {
  :root {
    --alpha-500: hsl(var(--hue-alpha), 80%, 65%);
  }
}
```

### 2. 기사 모달 개선
```html
<dialog id="articleModal">
  <article>
    <h2>{{ headline }}</h2>
    <div contenteditable="true" class="user-notes"></div>
  </article>
</dialog>
```

### 3. 티커 검색 자동완성
```html
<input list="popularTickers" inputmode="text">
<datalist id="popularTickers">
  <option value="AAPL">Apple Inc.</option>
</datalist>
```

### 4. 이미지 최적화
- hero-section.png → hero-section.webp (-50% 크기)
- company-logos/*.png → *.svg
- article-thumbnails/*.jpg → *.webp

### 5. 모바일 UX 개선
```html
<input type="text" inputmode="decimal" placeholder="Alpha Score">
<details class="filter-panel">
  <summary>필터 옵션</summary>
</details>
```

### 6. 개발 워크플로우
```javascript
console.table(articles.map(a => ({
  ticker: a.ticker,
  score: a.alpha_score,
  published: a.published_at
})));
```

### 7. Admin 통계 페이지
```html
<meter value="0.85" min="0" max="1">85%</meter>
<progress value="70" max="100">70%</progress>
```

---

## 참고 자료

- HSL Color Picker: hslpicker.com
- WebP Converter: squoosh.app
- SVG Icons: heroicons.com, feathericons.com
- Can I Use: caniuse.com

---

## 마무리

이 23가지 해킹은 "더 적은 코드로 더 많은 기능"이라는 철학을 담고 있습니다.

**핵심 원칙**:
1. HSL로 색상 시스템 구축
2. WebP/SVG로 이미지 최적화
3. 네이티브 HTML 태그 우선 활용
4. 모바일 UX 미디어 쿼리
5. VS Code 단축키 마스터

AlphaView에 적용하면 **성능 개선 + 코드 간결화 + 유지보수성 향상**을 동시에 달성할 수 있습니다.
