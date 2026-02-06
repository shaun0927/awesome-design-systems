# WCAG 2.2 접근성 카드 덱 정리 - Making Accessibility More Accessible

> Original issue: shaun0927/stocktitan-crawler#525

# WCAG 2.2 접근성 카드 덱 정리 - Making Accessibility More Accessible

> **출처**: Johannes (Austria) - Design Systems Conference 발표  
> **핵심**: 접근성을 모든 팀원이 쉽게 이해하고 실행할 수 있도록 만든 카드 덱 시스템

---

## 1. 핵심 철학: 접근성은 장애인만을 위한 것이 아니다

### 실전 예시: 문자 인식 게임
- **테스트**: `I0lOl` 이 문자열을 읽어보세요
- **정답**: 대문자 I, 숫자 0, 소문자 l, 대문자 O, 소문자 l
- **실제 상황**: 비밀번호, 쿠폰 코드에서 이런 문자 조합이 나오면?
- **결론**: 콘트라스트, 글꼴 선택은 모든 사용자에게 영향을 미침

### 시각 장애의 다양한 원인
- 낮은 혈당 (저혈당)
- 음주
- 편두통
- 피로

**→ 원인보다 "흐릿한 시야"라는 장애 자체에 집중해야 함**

---

## 2. WCAG 2.2 카드 덱 구조

### 카드 구성 요소

| 영역 | 내용 | 목적 |
|------|------|------|
| **Principles** | WCAG의 4대 원칙 (Perceivable, Operable, Understandable, Robust) | 기준의 철학적 배경 |
| **Number** | 기준 번호 (예: 1.4.3) | 공식 문서와 연결 |
| **Title** | 기준 제목 (예: Contrast) | 한눈에 이해 |
| **Level** | A, AA, AAA | 준수 우선순위 |
| **Short Description** | 단순화된 설명 | Martin Underhill의 WCAG in language I can understand 기반 |
| **QR Code + Short Link** | 공식 문서 연결 | 모바일에서 QR 스캔, 인쇄물에서 짧은 링크 입력 |
| **Related Criteria** | 연관 기준 | 테마별 그룹핑 |
| **Disability Indicators** | 영향받는 장애 유형 | 시각, 청각, 운동, 인지 장애 |
| **Responsibility Indicators** | 담당 역할 | Code, Content, Design |
| **Braille** | 점자 | 시각 장애인과 협업 가능 |

### 테마 분류
- Keyboard (키보드 접근성)
- Sensory (감각 정보)
- Forms (폼 입력)
- Content (콘텐츠 구조)
- Interaction (상호작용)

---

## 3. 실전 적용법: 접근성 감사 워크플로우

### Step 1: 필터링 - 필요한 레벨만 선택
예시: AA 등급만 준수하려면 Level A, AA 카드만 남김

### Step 2: 식별 - 관련 기준 찾기 (IBM Decision Tree 기반)
- Q: 이 요소에 텍스트가 있는가? → Yes: 1.4.3 Contrast 체크
- Q: 키보드로 조작 가능해야 하는가? → Yes: 2.1.1 Keyboard 체크
- Q: 시간 제한이 있는가? → Yes: 2.2.1 Timing Adjustable 체크

### Step 3: 그룹핑 - 테마별 정리
로그인 폼 감사 시:
- Forms 테마: 3.3.1 Error Identification, 3.3.2 Labels
- Keyboard 테마: 2.1.1 Keyboard, 2.4.7 Focus Visible
- Sensory 테마: 1.4.3 Contrast

### Step 4: 테스트 - 수동 검증
1. 자동화 도구 실행 (axe, Lighthouse)
2. 카드별 수동 검증
3. 이슈 발견 시 해당 카드 분리

### Step 5: 우선순위 부여

| 등급 | 기준 | 예시 |
|------|------|------|
| Blocking | 사용 불가능 | 키보드로 폼 전송 버튼 접근 불가 |
| High | 주요 기능에 심각한 영향 | 에러 메시지 색상으로만 표시 |
| Medium | 불편하지만 우회 가능 | Focus 표시가 약함 |
| Low | 미미한 영향 | Alt 텍스트 품질 개선 필요 |

### Step 6: 배정 - 책임자 지정
- Code → 개발자
- Content → 콘텐츠 작성자
- Design → 디자이너

---

## 4. 코드 예시

### 예시 1: 1.4.3 Contrast (Minimum)

**문제:**
```css
.button {
  background-color: #999;
  color: #ccc;
}
/* Contrast ratio: 1.6:1 (AA 기준 4.5:1 미달) */
```

**개선:**
```css
.button {
  background-color: #0066cc;
  color: #ffffff;
}
/* Contrast ratio: 7.2:1 (AA 통과) */
```

### 예시 2: 2.1.1 Keyboard

**문제:**
```tsx
<div onClick={() => setOpen(!open)}>Open Menu</div>
```

**개선:**
```tsx
<button
  onClick={() => setOpen(!open)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(!open);
    }
  }}
  aria-expanded={open}
  aria-haspopup="true"
>
  Open Menu
</button>
```

### 예시 3: 3.3.1 Error Identification

**문제:**
```tsx
<input type="email" style={{ borderColor: hasError ? 'red' : 'gray' }} />
```

**개선:**
```tsx
<div>
  <label htmlFor="email">이메일</label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
    style={{ borderColor: hasError ? 'red' : 'gray' }}
  />
  {hasError && (
    <span id="email-error" role="alert" style={{ color: 'red' }}>
      유효한 이메일 주소를 입력해주세요.
    </span>
  )}
</div>
```

### 예시 4: 2.4.7 Focus Visible

**문제:**
```css
*:focus { outline: none; }
```

**개선:**
```css
*:focus-visible {
  outline: 3px solid #0066cc;
  outline-offset: 2px;
}
```

---

## 5. AlphaView 접근성 체크리스트

### 5.1 뉴스 기사 카드 (ArticleCard)

| WCAG 기준 | 체크 항목 | 액션 |
|-----------|-----------|------|
| 1.4.3 Contrast | 티커 뱃지 대비 | Contrast checker 검증 |
| 2.1.1 Keyboard | 카드 클릭 가능 | button 사용 확인 |
| 2.4.4 Link Purpose | Read more 명확성 | "Read AAPL earnings report" 형식 |
| 4.1.2 Name, Role, Value | ARIA 라벨 | aria-label 추가 |

### 5.2 AlphaFilterBar

| WCAG 기준 | 체크 항목 | 액션 |
|-----------|-----------|------|
| 2.1.1 Keyboard | 모든 필터 키보드 접근 | Tab 테스트 |
| 4.1.3 Status Messages | 필터 적용 피드백 | live region 추가 |
| 2.4.7 Focus Visible | 포커스 표시 | CSS focus-visible |

### 5.3 ArticleModal

| WCAG 기준 | 체크 항목 | 액션 |
|-----------|-----------|------|
| 2.1.2 No Keyboard Trap | ESC로 닫기 | onKeyDown 핸들러 |
| 2.4.3 Focus Order | 모달 열릴 때 포커스 | 제목으로 포커스 이동 |
| 4.1.2 Name, Role, Value | role="dialog" | aria-modal="true" |

---

## 6. 디자인 시스템 통합

### 6.1 컴포넌트 기본값

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  'aria-label'?: string;
}

export function Button({ 'aria-label': ariaLabel, ...props }: ButtonProps) {
  return <button aria-label={ariaLabel} {...props} />;
}
```

### 6.2 색상 토큰

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f2ff',  // 7:1 contrast
          500: '#0066cc', // 7.2:1 contrast
          700: '#004499', // 10:1 contrast
        },
      },
    },
  },
};
```

### 6.3 ESLint + jsx-a11y

```json
{
  "extends": ["next/core-web-vitals", "plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/click-events-have-key-events": "error"
  }
}
```

### 6.4 Playwright 접근성 테스트

```ts
import AxeBuilder from '@axe-core/playwright';

test('Homepage accessibility', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

---

## 7. Johannes의 활용 팁

### 7.1 팀 온보딩
1. 각 팀원에게 카드 5장 배분
2. 10분 숙지
3. 돌아가며 설명
4. 실제 프로젝트에서 찾기
5. 테마 지도에 배치

### 7.2 코드 리뷰 체크리스트
- [ ] 1.4.3 Contrast: 대비 검증
- [ ] 2.1.1 Keyboard: 키보드 테스트
- [ ] 4.1.2 Name, Role, Value: ARIA 라벨
- [ ] 3.3.1 Error Identification: 에러 명확

### 7.3 점자 버전 협업
1. 점자 카드 준비
2. 시각 장애인이 테스트
3. 발견 이슈를 카드로 표시
4. 비장애인이 카드 텍스트 읽고 파악
5. 책임자 indicator로 담당자 배정

---

## 8. 리소스

### 8.1 공식 리소스
- Figma Community: "WCAG Card Deck Johannes"
- GitHub: 번역 파일, JSON export
- Excel: 한국어 포함 다국어 지원

### 8.2 연관 프로젝트
- Andrew Hick's WCAG Map by Theme
- Martin Underhill's WCAG in language I can understand
- Kimberly's Braille Version
- WCAG Actor Gathering (Magic the Gathering 스타일)

### 8.3 테스트 도구

| 도구 | 용도 |
|------|------|
| axe DevTools | 브라우저 확장 자동 스캔 |
| Lighthouse | Chrome DevTools 내장 |
| WebAIM Contrast Checker | 대비 검증 |
| WAVE | 시각적 피드백 |
| NVDA / JAWS | 스크린 리더 |
| Playwright + axe-core | E2E 테스트 |

---

## 9. AlphaView 적용 로드맵

### Phase 1: 현황 파악 (1-2주)
- [ ] 카드 덱 다운로드
- [ ] 주요 페이지 감사 (Hero, Alpha AI, 모달, Admin)
- [ ] 자동화 도구 실행
- [ ] 이슈 목록 작성

### Phase 2: Quick Wins (2-3주)
- [ ] Blocking 이슈 수정
- [ ] ESLint jsx-a11y 설정
- [ ] 컴포넌트 접근성 기본값

### Phase 3: 시스템화 (1개월)
- [ ] Storybook 접근성 애드온
- [ ] E2E 테스트 axe-core 통합
- [ ] 디자인 토큰 접근성 기준
- [ ] PR 체크리스트

### Phase 4: 문화 정착
- [ ] 월 1회 워크샵
- [ ] 분기별 감사
- [ ] 커뮤니티 기여

---

## 10. 핵심 메시지

1. **접근성은 준수가 아닌 품질** - 모든 사용자에게 더 나은 경험
2. **카드 덱은 접근성을 민주화** - 개발자, 디자이너, PM 모두 이해 가능
3. **테마별 그룹핑으로 효율화** - 영역별 집중 테스트
4. **책임 지표로 역할 분담** - Code, Content, Design
5. **커뮤니티 기반 발전** - 오픈소스, Creative Commons

---

## 참고 링크
- WCAG 2.2: https://www.w3.org/WAI/WCAG22/quickref/
- Figma: "WCAG Card Deck" 검색
- Johannes LinkedIn: QR code in slides

**Created**: 2026-02-05  
**License**: Creative Commons (상업적 사용 가능, 출처 표시)
