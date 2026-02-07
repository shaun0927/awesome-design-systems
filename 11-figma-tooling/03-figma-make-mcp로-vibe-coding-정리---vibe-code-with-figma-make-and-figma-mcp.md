# Figma Make & MCP로 Vibe Coding 정리 - Vibe Code with Figma Make and Figma MCP

> Original issue: shaun0927/stocktitan-crawler#526

# Figma Make & MCP로 Vibe Coding 정리

> **출처**: Vibe Code with Figma Make and Figma MCP (Into Design Systems Meetup)
> **발표자**: Laura (Designer Advocate @ Figma)
> **핵심 주제**: AI 기반 디자인-코드 워크플로우, Figma Make, Figma MCP, 디자인 시스템 통합

---

## 📌 핵심 철학: "Vibe Coding"

### 화면 디자인에서 감성(Vibe) 디자인으로의 전환

**전통적 접근**:
- 픽셀 퍼펙트한 화면 구현에 집중
- 디자이너-개발자 간 핸드오프 마찰
- 반복적인 수정과 커뮤니케이션 오버헤드

**Vibe Coding 접근**:
- **제품의 "느낌(Feel)"에 집중** - 기능이 작동하는 것을 넘어 사용자가 느끼는 감성
- **AI가 반복 작업 처리** - 디자이너/개발자는 창의적 작업에 집중
- **역할 간 경계 허물기** - PM, QA, 엔지니어 모두가 디자인에 참여
- **디자인을 조직 문화로** - 특정 역할이 아닌 모두가 소유

### AI 시대의 디자인 시스템 역할

```
전통적 역할: 일관성 유지 + 컴포넌트 라이브러리
    ↓
AI 시대 역할: 일관성 유지 + 컴포넌트 라이브러리 + AI 학습 소스 + 팀 간 공통 언어
```

**핵심 인사이트**:
- 디자인 시스템은 이제 **AI가 이해할 수 있는 소스**가 되어야 함
- 좋은 파일 구조/네이밍 = AI에게 더 나은 컨텍스트 제공
- 디자인 시스템이 견고할수록 AI 결과물 품질 향상

---

## 🎯 Figma Make 핵심 기능

### 1. AI 기반 프로토타입 생성

**기본 작동 방식**:
```
프롬프트 입력 → AI가 인터랙티브 프로토타입 생성 → 실제로 작동하는 UI
```

**기술 스택**:
- **기본 라이브러리**: Radix UI (shadcn/ui 기반)
- **프레임워크**: React + Tailwind CSS
- **특징**: 모든 인터랙션이 실제로 작동 (폼 검증, 상태 관리 등)

### 2. 디자인 시스템 통합

**Export to Figma Make 기능**:
```bash
# Figma 라이브러리 게시 화면에서
Publish Library → Export to Figma Make 버튼 클릭
→ 디자인 시스템이 Figma Make에서 사용 가능
```

**지원되는 요소**:
- ✅ Foundation (색상, 타이포그래피, 스페이싱)
- ✅ 오픈소스 디자인 시스템 (Material Design, Carbon, shadcn/ui 등)
- ⚠️ 제한사항: 라이브러리 업데이트 시 수동 동기화 필요 (개선 중)

### 3. 실시간 데이터 연동

**지원되는 데이터 소스**:
- 카메라/음성 인터페이스
- 외부 API (예: Spotify 실시간 차트, 교통 정보 API)
- 실제 데이터베이스

**실전 예시**:
```
프롬프트: "Make this music player interactive. When tapping,
change images to most listened songs on Spotify."

결과: Spotify API에서 실시간 차트를 가져와 UI에 반영
```

### 4. 인터랙티브 편집

**Point & Edit 도구**:
- 생성된 프로토타입에서 특정 요소 선택
- 자연어로 수정 요청 ("이 카드를 다른 컴포넌트로 교체해줘")
- 코드 창에서 직접 수정 가능 (코딩 스킬 거의 불필요)

---

## 🔌 Figma MCP (Model Context Protocol) 통합

### MCP란?

**정의**: Figma 디자인을 AI 코딩 툴(Cursor, VS Code 등)에서 직접 참조할 수 있게 하는 프로토콜

**작동 흐름**:
```
1. Figma에서 프레임 선택
2. Cursor/VS Code에서 "Build the selected Figma design" 프롬프트
3. AI가 Figma에서 디자인 데이터 + 이미지 가져옴
4. 실제 작동하는 코드 생성
```

### 설정 방법 (초보자도 가능!)

**Figma 측 설정**:
```
Figma 로고 클릭 → Preferences → Enable Dev Mode MCP Server 체크
```

**Cursor 측 설정**:
```
MCP 서버가 자동으로 연결됨 (별도 설정 불필요)
```

### 코딩 경험 없이 사용하기

**발표자의 실제 경험**:
> "저는 코딩을 전혀 모르지만, Cursor가 Homebrew 설치부터 로컬 서버 설정까지 모든 단계를 안내해줬어요. 정말 친절하고 도움이 됐습니다."

**Cursor가 자동으로 해주는 것들**:
- ✅ 개발 환경 셋업 (Homebrew, Node.js 등)
- ✅ 로컬 서버 구성 (localhost 자동 설정)
- ✅ 컴포넌트 라이브러리 설치 (shadcn/ui 등)
- ✅ 테마 설정
- ✅ 버그 수정

**놀라운 기능**:
```
# 첫 번째 시도 후 수정할 때
Cursor: "첫 번째 버전을 덮어쓰지 않기 위해 새 로컬 호스트를 생성했습니다 (localhost:3001)"

→ 버전 관리를 자동으로 해줌!
```

---

## 🚀 AI 활용 워크플로우 최적화

### 프롬프트 작성 3원칙: 3C

#### 1. Clarity (명확성)
```
❌ 나쁜 예: "회원가입 화면 만들어줘"
✅ 좋은 예: "이메일, 비밀번호, Google 로그인이 포함된 회원가입 폼을 만들어줘"
```

**팁**:
- 불필요한 수식어 제거
- 불릿 포인트 활용
- 구체적인 요구사항 명시

#### 2. Context (맥락)
```
브랜드: Nike 스타일
사용자: 20-30대 여성
기능: 운동 기록, 프로필 관리, 소셜 공유
```

**왜 중요한가?**:
- 맥락 없으면 AI가 자의적으로 판단
- 브랜드 아이덴티티 반영 불가
- 사용자 특성 고려 못함

#### 3. Constraints (제약조건)
```
플랫폼: iOS (not Android)
디자인 시스템: Material Design 3
접근성: WCAG 2.1 AAA 준수
기술 스택: React + shadcn/ui
```

**제약조건 예시**:
- 플랫폼 (iOS, Android, Web)
- 인터랙션 패턴
- 스타일 가이드
- 접근성 기준

### 실전 프롬프트 예시

**나쁜 프롬프트** (너무 모호함):
```
Make a signup screen.
```

**개선된 프롬프트**:
```
Create a signup form with:
- Email input field
- Password input field
- Google sign-in button
Use Material Design 3 styling.
```

**최적화된 프롬프트** (3C 모두 적용):
```
Create a fitness app for modern users aged 25-40.

Features:
- Training log
- User profile with stats
- Social sharing

Design:
- iOS platform
- Neutral color palette
- Nike Training Club brand style
- Mobile-first layout (375px width)

Technical:
- Use shadcn/ui components
- Ensure WCAG AA contrast
```

**결과 비교**:
| 프롬프트 품질 | 결과 품질 | 재작업 필요 |
|--------------|----------|-----------|
| 나쁜 프롬프트 | 범용 UI, 브랜드 없음 | 50-70% |
| 개선된 프롬프트 | 기능 구현, 브랜드 미흡 | 30-40% |
| 최적화된 프롬프트 | 브랜드 반영, 바로 사용 가능 | 10-20% |

### 점진적 프롬프트 전략

**❌ 한 번에 모든 걸 요구하지 마세요**:
```
"30개 화면이 있는 완전한 앱을 만들어줘, 모든 인터랙션 포함해서..."
→ AI가 혼란스러워하고 일관성 없는 결과 생성
```

**✅ 단계적으로 구축하세요**:
```
1단계: "피트니스 앱 메인 화면 만들어줘"
2단계: "이제 운동 시작 버튼을 추가하고, 클릭하면 운동 화면으로 이동하게 해줘"
3단계: "사용자 프로필 페이지를 추가해줘"
4단계: "세 화면을 네비게이션으로 연결해줘"
```

**이점**:
- 각 단계에서 품질 확인 가능
- AI가 집중할 수 있는 스코프
- 문제 발생 시 빠른 수정

---

## 📁 파일 구조 최적화 (디자인 시스템 관점)

### 좋은 파일 위생 = 더 나은 AI 결과

**Figma Make/MCP가 선호하는 구조**:
```
✅ 명명된 레이어 (Named Layers)
✅ Auto Layout 사용
✅ 그룹 최소화
✅ 의미 있는 이름 (예: "music-card-1", "add-music-button")
```

**❌ 피해야 할 구조**:
```
❌ "Group 123", "Frame 456" 같은 기본 이름
❌ 중첩된 그룹 (Nested Groups)
❌ "div", "div", "div" 같은 반복 이름
```

### 실전 예시: 음악 플레이어

**Before (나쁜 구조)**:
```
Frame 1
  └─ Group
      └─ div
          └─ div
              └─ div (어떤 div를 수정해야 할까?)
```

**After (좋은 구조)**:
```
Music Player
  └─ music-card-1 (앨범 커버 + 제목)
  └─ music-card-2
  └─ music-card-3
  └─ add-music-button (명확한 액션)
```

**AI 프롬프트 예시**:
```
"make this page interactive. When tapping music-card-1,
change the images to most listened songs on Spotify"

→ AI가 정확히 어떤 요소를 조작해야 하는지 알 수 있음
```

### 레이어 네이밍 베스트 프랙티스

**일반 원칙**:
- 복잡한 네이밍 규칙 불필요
- 명확하고 설명적이기만 하면 됨
- 액션 버튼은 동사 포함 (예: "add-music", "play-button")

**예시**:
| 컴포넌트 | 나쁜 이름 | 좋은 이름 |
|----------|----------|----------|
| 헤더 | Frame 1 | header-navigation |
| 검색창 | Group 23 | search-input |
| 카드 리스트 | div | product-card-list |
| CTA 버튼 | Rectangle | signup-button |

---

## 🎨 디자인 시스템 활용 전략

### Figma Make에서 디자인 시스템 사용하기

#### 1. 오픈소스 디자인 시스템 활용

**지원되는 시스템**:
- **Material Design 3**: Google의 디자인 시스템
- **Carbon Design System**: IBM (문서화 훌륭함)
- **shadcn/ui**: Radix 기반 (기본값)

**사용 방법**:
```
프롬프트에 직접 명시:
"Create a signup page using Carbon Design System"
"Use Material Design 3 components for this form"
```

#### 2. 커스텀 디자인 시스템 Export

**프로세스**:
```
1. Figma 라이브러리 준비
   ├─ Foundations (색상, 타이포, 스페이싱)
   ├─ Components (버튼, 인풋, 카드 등)
   └─ Patterns (폼, 네비게이션 등)

2. Publish Library 클릭

3. "Export to Figma Make" 버튼 클릭
   → 자동으로 렌더링 및 업로드

4. Figma Make에서 프롬프트
   "Create a table using [내 라이브러리 이름]"
```

#### 3. Theming (스타일 컨텍스트)

**Foundation 레벨**:
- ✅ 색상 시스템 (Color Tokens)
- ✅ 타이포그래피 스케일
- ✅ 스페이싱 시스템
- ✅ 변수(Variables) / 토큰

**작동 방식**:
```
Figma Make는 Radix/shadcn 기반으로 생성하되,
내 디자인 시스템의 스타일을 입힘

기본 구조 (Radix) + 내 스타일 (Colors, Typography) = 결과물
```

**제한사항** (개선 예정):
- 라이브러리 업데이트 시 자동 동기화 안 됨
- 프로토타입을 수동으로 업데이트해야 함

### 실전 케이스: Data Table 구현

**시나리오**:
> "테이블은 디자인 시스템에서 구현하기 가장 어려운 컴포넌트 중 하나. 수많은 엣지 케이스, 상태, 인터랙션을 고려해야 하고, 디자이너-개발자 간 오해도 많음."

**Figma Make 활용**:
```
1. Figma에서 테이블 디자인 복사
2. Figma Make에 붙여넣기
3. 프롬프트: "Build this data table using shadcn/ui.
   Include all interactions (sort, filter, pagination)."
4. 결과: 모든 인터랙션이 작동하는 테이블 생성
```

**성과**:
- ✅ 정렬(Sorting) 작동
- ✅ 필터링 작동
- ✅ 페이지네이션 작동
- ✅ 디자인 시스템 스타일 반영
- ✅ 개발자에게 작동하는 프로토타입 전달 가능

**이점**:
```
Before: "이 테이블은 클릭하면 정렬되어야 해요" (말로만 설명)
After: "여기 작동하는 프로토타입이요. 코드도 보세요" (실제 구현)

→ 커뮤니케이션 마찰 대폭 감소
→ 구현 시간 단축
→ 오해 최소화
```

### 인터랙티브 컴포넌트 핸드오프

**전통적 핸드오프**:
```
디자이너: Figma 파일 + 스펙 문서 전달
개발자: 해석 → 구현 → 질문 → 수정 → 반복...
```

**Figma Make 핸드오프**:
```
디자이너: Figma Make로 작동하는 프로토타입 생성
         (모든 상태 + 인터랙션 포함)
개발자: 프로토타입 테스트 + 코드 참고 → 구현

→ 질문 최소화, 구현 속도 향상
```

**실전 예시: Content Switcher**:
```
1. 모든 상태를 보여주는 "Playground" 생성
   ├─ Default state
   ├─ Hover state
   ├─ Active state
   ├─ Disabled state
   └─ Error state

2. Figma Make로 인터랙티브하게 만들기

3. 개발자에게 전달
   "실제로 클릭해보고 동작을 확인하세요"
```

### 코드 커스터마이징 (Guidelines)

**Coding Panel에서 할 수 있는 것**:
```
1. 스타일 오버라이드
   - AI가 잘못 적용한 색상/폰트 수정

2. Guidelines 추가
   - "절대 Tailwind gradient를 사용하지 마세요"
   - "항상 우리 디자인 토큰을 사용하세요"
   - "버튼은 최소 44x44px이어야 합니다 (접근성)"

3. 컴포넌트 교체
   - Radix 컴포넌트를 자사 컴포넌트로 교체
```

**Guidelines 예시**:
```javascript
/* Figma Make Guidelines */

// 색상
- Use design tokens from @/tokens/colors
- Never use hardcoded hex values
- Avoid Tailwind gradient utilities

// 접근성
- Minimum touch target: 44x44px
- Maintain WCAG AA contrast (4.5:1)
- Include ARIA labels for interactive elements

// 컴포넌트
- Use @/components/Button instead of Radix Button
- Use @/components/Input instead of Radix Input
```

---

## 🔄 AI 컨텍스트 계층 (Context Pyramid)

### AI가 이해하는 디자인 정보 수준

**Level 0: 스크린샷만 제공**
```
AI 이해도: 10%
- 시각적 레이아웃만 파악
- 스타일/의도 추측
- 재현도 낮음
```

**Level 1: 명명된 레이어**
```
AI 이해도: 30%
+ 요소의 역할 이해 ("header", "cta-button")
+ 구조적 관계 파악
```

**Level 2: 토큰/변수 추가**
```
AI 이해도: 60%
+ 스타일 시스템 이해 (색상, 폰트, 스페이싱)
+ 일관성 있는 스타일 적용
```

**Level 3: Annotations 추가**
```
AI 이해도: 80%
+ 디자인 의도 파악 ("이 버튼은 primary action")
+ 인터랙션 로직 이해
```

**Level 4: Code Connect**
```
AI 이해도: 95%
+ 실제 코드베이스와 연결
+ 정확한 컴포넌트 매칭
+ 프로덕션 레디 코드 생성
```

### 실전 적용 전략

**스타트업/신규 프로젝트**:
→ Level 2-3부터 시작 (토큰 + Annotations)

**대규모 조직/레거시 코드**:
→ Level 4 목표 (Code Connect 투자)

**프로토타이핑/실험**:
→ Level 1-2로 충분 (빠른 반복)

---

## ⚙️ Cursor + MCP 실전 팁

### 1. 프레임 선택 규칙

**⚠️ 중요: 선택 유지하기**
```
❌ 잘못된 사용:
1. Figma에서 프레임 선택
2. Cursor에서 프롬프트 입력
3. Figma에서 다른 곳 클릭 (선택 해제)
4. → AI가 엉뚱한 것 참조하거나 에러 발생

✅ 올바른 사용:
1. Figma에서 프레임 선택
2. Cursor에서 프롬프트 입력
3. AI 작업 완료까지 선택 유지
4. 완료 후 다른 작업 진행
```

### 2. 모델 선택 가이드

**Claude Sonnet (빠르고 좋은 품질)**:
- 일반적인 UI 구현
- 첫 시도에서 좋은 결과
- 반복 작업에 적합

**GPT-4 Turbo (복잡한 로직)**:
- 복잡한 비즈니스 로직
- 다단계 사고 필요
- 사전 계획 수립 가능

**추천**:
```
초보자 → Claude Sonnet
복잡한 작업 → GPT-4 Turbo로 계획 수립 후 Sonnet으로 구현
```

### 3. Cursor Rules 설정

**Cursor 설정 위치**:
```
Cursor → Preferences → Rules
```

**유용한 Rules 예시**:
```markdown
# Project Rules

## Code Style
- Use TypeScript for all files
- Follow Airbnb style guide
- Max line length: 100 characters

## Design System
- Always use @/components from our design system
- Never use Tailwind gradient utilities
- Use design tokens from @/tokens

## Accessibility
- Minimum touch target: 44x44px
- Include ARIA labels
- Maintain WCAG AA contrast

## Figma Integration
- When building from Figma, preserve layer names as data-testid
- Match spacing exactly from Figma
```

### 4. 버전 관리 자동화

**Cursor의 똑똑한 기능**:
```
첫 번째 시도: localhost:3000
수정 요청 시: "기존 버전을 보존하기 위해 localhost:3001에 새 버전을 만들었습니다"

→ 수동 버전 관리 불필요!
```

### 5. 로컬 서버 자동 설정

**Cursor가 자동으로 해주는 것**:
```
1. 프롬프트: "Set up a local server and show this design"

2. Cursor 자동 실행:
   - Homebrew 설치 (macOS)
   - Node.js 설치
   - 프로젝트 초기화 (npm init)
   - 필요한 패키지 설치 (Vite, React 등)
   - Dev server 실행
   - 브라우저 자동 오픈

3. "localhost:3000에서 확인하세요" 안내
```

**코딩 경험 불필요**:
> "저는 코딩을 전혀 모르지만, Cursor의 친절한 안내만 따라가면 로컬 서버가 돌아갔어요."

---

## ✅ 실전 체크리스트

### Figma Make 사용 전

- [ ] 파일 구조 정리 (레이어 명명, Auto Layout)
- [ ] 디자인 시스템 Export (해당 시)
- [ ] 프롬프트 3C 준비 (Clarity, Context, Constraints)
- [ ] 단계적 접근 계획 (한 번에 모든 걸 요구 X)

### MCP + Cursor 사용 전

- [ ] Figma MCP 활성화 (Preferences에서)
- [ ] Cursor Rules 설정 (프로젝트 스타일 가이드)
- [ ] 작업할 프레임 선택 (선택 유지할 것)
- [ ] 로컬 환경 준비 (Cursor가 자동으로 도움)

### 프롬프트 작성 시

- [ ] 명확한 목표 기술
- [ ] 브랜드/사용자 컨텍스트 제공
- [ ] 플랫폼/기술 제약 명시
- [ ] 실제 데이터 연동 필요 여부 결정

### 결과 검토 시

- [ ] 디자인 시스템 스타일 준수 확인
- [ ] 모든 인터랙션 작동 테스트
- [ ] 접근성 기준 충족 확인
- [ ] 필요 시 Point & Edit로 미세 조정

---

## 🚧 현재 한계 및 주의사항

### Figma Make 한계

**1. 라이브러리 동기화**
```
현재: 라이브러리 업데이트 시 수동 재export 필요
개선 예정: 자동 동기화 기능 개발 중
```

**2. 단일 라이브러리만 사용 가능**
```
현재: 한 번에 하나의 디자인 시스템만 연결
커뮤니티 요청: B2B/B2C 라이브러리 동시 사용
→ 로드맵에 포함됨
```

**3. Figma ↔ Make 양방향 동기화**
```
현재: Make에서 생성한 디자인을 Figma로 가져오기 불가
개선 예정: "매우 가까운 미래"에 출시 예정
```

### MCP 한계

**1. 코드 품질은 코드베이스에 따라 다름**
```
신규 프로젝트: 50-70% 완성도 (바로 사용 가능)
레거시 프로젝트: 20-30% 참고용 (수동 통합 필요)
```

**발표자 인용**:
> "10년 이상의 레거시 코드가 있는 거대한 모놀리스에 AI 생성 코드를 그냥 붙여넣을 순 없어요. 스타트업이 처음부터 시작한다면 더 유용하겠지만, 대부분의 회사는 그렇지 않죠."

**2. 프레임워크/스타일 제한**
```
AI는 일반적인 패턴을 학습했지만,
회사 고유의 코딩 규칙/아키텍처는 추가 가이드 필요
```

### 현실적인 기대치 설정

**AI가 할 수 있는 것**:
- ✅ 반복적인 UI 구현 가속화
- ✅ 프로토타입 빠른 제작
- ✅ 디자이너-개발자 커뮤니케이션 개선
- ✅ 컴포넌트 핸드오프 품질 향상

**AI가 할 수 없는 것**:
- ❌ 레거시 코드에 완벽하게 통합
- ❌ 복잡한 비즈니스 로직 이해
- ❌ 회사 고유 아키텍처 자동 적용
- ❌ 디자이너/개발자 역할 완전 대체

**결론**:
```
AI는 "첫 50%를 해결"하는 도구
나머지 50%는 여전히 인간의 전문성 필요

→ 하지만 그 50%만으로도 엄청난 생산성 향상!
```

---

## 🎓 조직/팀 차원 적용 전략

### 1. 사일로 깨기 (Breaking Silos)

**전통적 구조의 문제**:
```
디자이너 → 스펙 문서 작성 → 개발자에게 전달
개발자 → 해석 → 질문 → 디자이너 답변 → 반복...

→ 긴 핸드오프 사이클
→ 오해와 재작업
→ 느린 출시 속도
```

**AI 시대의 협업**:
```
디자이너 → Figma Make로 작동하는 프로토타입 생성
개발자 → 프로토타입 테스트 + 코드 참고 → 빠른 구현
PM → 직접 프로토타입 만들어 아이디어 검증
QA → 인터랙션 미리 테스트

→ 모두가 "디자인"에 참여
→ 디자인이 역할이 아닌 "문화"로 자리잡음
```

**핵심 메시지**:
> "AI 도구의 진짜 가치는 기능이 아니라 **사일로를 깨는 것**. 이제 PM, 엔지니어, QA 모두가 자신의 아이디어를 프로토타입으로 만들어 테이블에 올릴 수 있어요."

### 2. 점진적 도입 전략

**Phase 1: 실험 (1-2개월)**
```
목표: 팀의 익숙해지기
방법:
- 소규모 프로토타이핑 프로젝트
- 1-2명의 얼리 어답터
- 실패해도 괜찮은 환경
```

**Phase 2: 파일럿 (3-6개월)**
```
목표: 실제 프로젝트 적용
방법:
- 신규 기능 개발에 적용
- 디자인 시스템 Export 설정
- 핸드오프 프로세스 개선
```

**Phase 3: 확산 (6개월+)**
```
목표: 조직 전체 문화로 정착
방법:
- 베스트 프랙티스 문서화
- 워크샵/교육 진행
- 성공 사례 공유
```

### 3. 보안/규정 준수 조직

**우려사항**:
> "우리 회사는 보안 요구사항이 엄격해서 AI를 사용할 수 없어요."

**발표자의 답변**:
> "AI가 당신의 일을 완전히 대체하거나, 지금 당장 프로덕션에 사용해야 하는 건 아니에요. **미래를 준비하기 위해 배우는 것**이 중요해요. 학습용으로만 사용해도 충분히 가치가 있습니다."

**현실적 접근**:
```
프로덕션 금지 → 샌드박스 환경에서 학습
코드 검토 필수 → AI를 "주니어 개발자"처럼 취급
보안 데이터 사용 금지 → Mock 데이터로 프로토타이핑
```

### 4. 디자인 시스템 팀 역할 변화

**전통적 역할**:
```
- 컴포넌트 디자인/개발
- 문서 작성
- 일관성 관리
- 질문 답변 (Slack 지원)
```

**AI 시대의 역할**:
```
+ AI가 이해할 수 있는 소스 관리
  - 명확한 네이밍 규칙
  - 토큰/변수 체계화
  - Annotations 추가

+ Guidelines 작성
  - AI가 따라야 할 규칙 문서화
  - 금지 패턴 명시
  - 접근성 체크리스트

+ 교육 및 전파
  - 팀에게 AI 도구 사용법 교육
  - 프롬프트 베스트 프랙티스 공유
  - 성공/실패 사례 큐레이션
```

**새로운 가치**:
> "디자인 시스템은 이제 **인간뿐 아니라 AI도 이해할 수 있어야** 합니다. 이것이 새로운 '품질 기준'입니다."

---

## 🔮 미래 전망 및 마인드셋

### "디자인은 이제 화면이 아니라 Vibe"

**패러다임 전환**:
```
과거 10년: 픽셀 퍼펙트 → 일관성 → 확장성
다음 10년: Vibe → Feel → Emotion

"제품이 작동하는 것"을 넘어 "제품이 어떻게 느껴지는가"
```

**발표자 인용**:
> "우리는 디자인 시스템으로 훌륭한 기반을 만들었어요. 이제 AI가 반복 작업을 처리하니, 우리는 **Vibe와 Love**에 집중할 시간이 생겼습니다."

### "역할의 경계가 흐려지는 시대"

**좋은 점**:
```
✅ PM이 직접 프로토타입 만들어 아이디어 검증
✅ 엔지니어가 디자인 개선 제안 (코드로 직접 보여주며)
✅ QA가 인터랙션 문제를 시각적으로 리포트
✅ 디자이너가 더 전략적 작업에 집중

→ "디자인이 모두의 것"이 됨
```

**도전 과제**:
```
⚠️ 역할 정체성 혼란
⚠️ 품질 관리 어려움
⚠️ 새로운 스킬 학습 부담

→ 변화 관리와 교육이 핵심
```

### "인내심과 호기심"

**발표자의 조언**:
> "AI와 프롬프팅은 배워야 하는 **스킬**입니다. 디자인 시스템을 배울 때처럼 시간이 걸려요. 자신에게 인내심을 가지고, 호기심을 유지하세요."

**현실적 타임라인**:
```
1주차: 어색함 (프롬프트가 잘 안 먹힘)
1개월: 기본 숙달 (간단한 UI는 빠르게 생성)
3개월: 자신감 (복잡한 인터랙션도 구현)
6개월: 전문가 (AI를 도구로 완전히 내재화)

→ 포기하지 말고 꾸준히 연습
```

### Figma의 디자인 시스템 투자

**2024년 로드맵**:
> "Config 2024에서 디자인 시스템 기능이 없었지만, 올해 말까지 '디자인 시스템 폭격'을 준비 중입니다. 품질과 성능을 먼저 개선했고, 이제 새 기능들이 쏟아질 겁니다."

**기대되는 기능**:
- Make ↔ Figma 양방향 동기화
- 다중 라이브러리 지원
- 자동 라이브러리 업데이트
- (더 많은 내용은 공개 불가)

---

## 📊 AlphaView 적용 포인트

### 1. 빠른 프로토타이핑

**시나리오: 새로운 기능 실험**
```
현재: 디자인 → 개발 → 배포 → 테스트 (2-3주)
AI 활용: Figma Make로 프로토타입 (1-2일) → 사용자 테스트 → 검증 후 개발

예시:
- 새로운 차트 레이아웃 A/B 테스트
- 다른 네비게이션 패턴 실험
- 프리미엄 기능 목업 빠르게 제작
```

### 2. 디자인 시스템 문서화

**현재 과제: shadcn/ui 기반 컴포넌트 문서화**
```
해결책:
1. 주요 컴포넌트를 Figma Make로 Export
2. 인터랙티브 Playground 생성
   - 모든 상태 시연
   - 실제 작동하는 예제
3. 개발자 온보딩 시 활용

이점:
→ "이 컴포넌트 어떻게 쓰나요?" 질문 감소
→ 일관된 구현 패턴
```

### 3. 투자자 데모

**시나리오: 신규 기능 피칭**
```
전통적: 정적 목업 + 설명
AI 활용: 실제 작동하는 프로토타입 (실시간 데이터 연동)

예시:
- SEC 데이터 시각화 새 방식
- AI 분석 결과 인터랙티브 대시보드
- 소셜 기능 프로토타입

→ 투자자가 직접 클릭하고 경험
```

### 4. A/B 테스트 고속화

**워크플로우**:
```
1. Figma에서 Variant A, B 디자인
2. Figma Make로 각각 생성 (1-2시간)
3. 사용자 테스트 (1주)
4. 승자 프로덕션 개발

절약 시간:
- 개발 리소스 없이 테스트 가능
- 빠른 iteration
- 데이터 기반 의사결정
```

### 5. 팀 간 협업 개선

**Admin Dashboard 시나리오**:
```
현재: 백엔드 개발자가 데이터는 준비했지만,
       프론트엔드 리소스 부족으로 UI는 기본적

AI 활용:
1. 데이터 API 준비 (백엔드)
2. Figma Make + MCP로 UI 생성 (비개발자도 가능)
3. 실제 데이터 연동
4. 프론트엔드 개발자가 필요 시 refine

→ 백엔드 개발자도 UI를 "프로토타입" 수준으로 만들 수 있음
```

### 6. 기술 부채 시각화

**레거시 코드 리팩토링**:
```
문제: "이 컴포넌트를 리팩토링해야 하는데 어떻게 보일지 모르겠어요"

해결:
1. 현재 컴포넌트를 Figma로 역설계
2. 개선된 버전을 Figma Make로 생성
3. 팀에게 Before/After 시연
4. 우선순위 결정

→ 리팩토링 ROI를 시각적으로 증명
```

---

## 📚 참고 자료

**Figma 공식**:
- [Figma Make Documentation](https://help.figma.com/hc/en-us/articles/16686208127127) — 공식 사용 가이드
- [Figma Dev Mode Guide](https://help.figma.com/hc/en-us/articles/15023124644247) — MCP 설정 포함
- [Figma Variables API](https://www.figma.com/plugin-docs/api/properties/figma-variables/) — 디자인 토큰 자동화

**AI 도구**:
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) — Anthropic의 AI-tool 통합 표준
- [Cursor IDE](https://cursor.sh/) — AI 네이티브 코드 에디터
- [Anthropic Claude](https://www.anthropic.com/claude) — Figma Make/MCP의 기반 모델

**디자인 시스템**:
- [shadcn/ui](https://ui.shadcn.com) — Figma Make 기본 컴포넌트 라이브러리
- [Radix UI](https://www.radix-ui.com) — 접근성 우선 UI 프리미티브
- [Carbon Design System](https://carbondesignsystem.com) — IBM 오픈소스 디자인 시스템
- [Material Design 3](https://m3.material.io/) — Google 디자인 시스템

**프롬프트 엔지니어링**:
- [Prompt Engineering Guide](https://www.promptingguide.ai/) — 3C 프레임워크 응용
- [OpenAI Prompt Engineering](https://platform.openai.com/docs/guides/prompt-engineering) — 구조화된 프롬프트 작성법

**커뮤니티**:
- [Into Design Systems](https://www.intodesignsystems.com/) — 디자인 시스템 컨퍼런스 및 커뮤니티
- [Figma Community](https://www.figma.com/community) — "Figma Make examples" 검색

---

## 💡 핵심 Takeaways

1. **프롬프트는 스킬**: 3C (Clarity, Context, Constraints) 연습하기
2. **파일 구조가 AI 품질을 결정**: 명명된 레이어, Auto Layout
3. **단계적 접근**: 한 번에 모든 걸 요구하지 말고 점진적으로
4. **디자인 시스템을 AI 소스로**: Foundation + Components Export
5. **MCP로 실제 코드 생성**: Cursor와 함께 사용하면 개발 속도 2-3배
6. **현실적 기대치**: AI는 "첫 50%"를 해결하는 도구
7. **사일로 깨기**: 모두가 디자인에 참여하는 문화 만들기
8. **Vibe에 집중**: 이제 "느낌"을 디자인할 시간
9. **인내심과 호기심**: 새로운 스킬 학습에는 시간 필요
10. **미래 준비**: 보안 제약이 있어도 학습용으로 활용

---

**작성일**: 2026-02-05
**작성자**: Claude (oh-my-claudecode:executor)
**원본 출처**: Into Design Systems Meetup - "Vibe Code with Figma Make and Figma MCP"