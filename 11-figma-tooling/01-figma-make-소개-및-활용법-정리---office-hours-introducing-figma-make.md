# Figma Make 소개 및 활용법 정리 - Office Hours: Introducing Figma Make

> Original issue: shaun0927/stocktitan-crawler#532

# Figma Make 소개 및 활용법 정리

> **출처**: Figma Office Hours - Introducing Figma Make
> **발표자**: Anna (Designer Advocate), Holly Lee (Product Manager)
> **날짜**: 2024년 6월
> **작성 관점**: 디자인 시스템 효율성 및 실전 노하우

---

## 📌 핵심 요약

Figma Make는 디자인을 코드 기반 인터랙티브 프로토타입으로 자동 변환하는 AI 도구입니다. 기존 Figma 디자인을 복사해 프롬프트에 붙여넣기만 하면 Claude Sonnet 4 기반으로 즉시 작동하는 프로토타입을 생성합니다.

**핵심 가치**:
- **빠른 아이디어 검증**: 코딩 없이 몇 분 만에 작동하는 프로토타입 생성
- **디자인 크래프트 향상**: 정적 화면이 아닌 실제 인터랙션 중심 디자인
- **개발자 핸드오프 개선**: 실제 작동하는 프로토타입으로 명확한 의도 전달

---

## 🎯 Figma Make 워크플로우

### 1. 시작하기

**디자인에서 Make 파일 생성**:
- Figma 디자인 파일 → File → New Make
- 또는 프로젝트 화면 → Create → Make

**디자인 가져오기**:
1. Figma에서 프레임 선택 (Cmd/Ctrl + C)
2. Make 프롬프트 박스에 붙여넣기 (Cmd/Ctrl + V)
3. 프롬프트 작성: "build an interactive prototype of [기능명]"
4. Enter

**제약사항**:
- 한 번에 최대 3개 프레임 첨부 가능
- 추가 프레임은 후속 프롬프트에서 계속 추가 가능

### 2. 편집 방법 (우선순위 순서)

**① Point and Edit Tool (최우선, 가장 빠름)**:
- 프리뷰에서 요소 직접 선택
- 툴바로 즉시 수정 가능한 속성: 배경색, 코너 라디우스, Padding/Margin, 폰트, 색상, 크기, Bold/Italic/Underline, 정렬 및 간격

**② 코드 직접 편집 (빠름)**:
- Point and Edit로 불가능한 경우
- 요소 선택 → 툴바 우측 "Go to Source" 클릭
- 코드에서 해당 부분 직접 수정

**③ 추가 프롬프트 (느림)**:
- 위 두 방법으로 불가능한 경우만 사용

**편집 효율성 팁**: 중복 요소는 하나만 수정하면 자동으로 모두 적용됨

### 3. 공유 및 배포

**팀 내부 공유**: Play 버튼 → 전체화면 프리뷰 URL (기존 Figma 권한 적용)
**외부 공개**: Publish 버튼 → 공개 웹사이트 (민감 정보 주의)

---

## 🤖 AI 통합 및 활용

### 1. Claude Sonnet 4 기반

**특징**:
- **비결정적**: 같은 프롬프트라도 매번 다른 결과 가능
- **맥락 이해**: 디자인 + 프롬프트 조합으로 의도 파악
- **자동 추론**: "interactive"만 입력해도 hover 효과 자동 추가

**결정성 향상 방법**:
- 구체적인 프롬프트 작성
- 디자인 시스템 연결 (2024년 6월 말 출시 예정)
- 가이드라인 파일 작성 (곧 출시)

### 2. 데이터 생성 및 활용

**실전 사례 - 200개 프로젝트 데이터 자동 생성**:
- 프롬프트: "Generate 200 projects to populate this prototype"
- 결과: projectData.js 자동 생성, 실제 바차트 작동, 필터링/정렬 가능

### 3. 애니메이션 및 마이크로인터랙션

**로딩 스크린 예시**:
- 프롬프트 1: "Create looping animations where icons go from 0 to 100% opacity"
- 프롬프트 2: "Animate icons to sporadically rotate"
- 결과: 2개 프롬프트로 완성된 로딩 애니메이션

**Advanced Prototyping 대비 장점**:
- Input 필드 자동 생성
- 유효성 검사 프롬프트로 해결
- 변수 로직 수동 설정 불필요

---

## 💡 실전 활용 사례

### 1. 컬러 시스템 자동 추출 및 변수 생성

**워크플로우**:
1. "Extract 6 core colors from this design with hex codes"
2. "Generate Tailwind color scales from 100 to 1000, export as JSON"
3. Figma 플러그인 "Variable Importer/Exporter"로 가져오기

**결과**: 수작업 2시간 → 5분으로 단축

### 2. 애니메이션 스펙 문서 자동 생성

- 프롬프트: "Export animation specs for developer handoff"
- 효과: duration, easing, keyframes 자동 문서화

### 3. 멀티페이지 모바일 앱 프로토타입

**World Peas 쇼핑 앱 예시**:
- Input 필드 자동 생성
- Zip code 유효성 검사
- 이전 화면 입력값 자동 반영

---

## 🛠️ 팁 & 트릭

### 1. 디자인 파일 준비 (Design Hygiene)

| 항목 | 중요도 | 이유 | 해결 방법 |
|------|--------|------|----------|
| **Auto Layout** | ⭐⭐⭐ | 반응형 디자인 핵심 | AI "Suggest Auto Layout" |
| **Layer 이름** | ⭐⭐⭐ | Make와의 공통 언어 | AI "Rename Layers" |
| **컴포넌트** | ⭐⭐ | 디자인 시스템 일관성 | 라이브러리 활용 |

**Auto Layout 효과**:
- 있음: 반응형 리사이즈
- 없음: 요소 잘림

**Layer 이름 중요성**:
- 좋은 예: "project-card", "filter-dropdown"
- 나쁜 예: "Frame 12345678"

### 2. 프롬프트 작성 전략

**레벨 1 - 기본**: "Build an interactive prototype" → 기본 hover만
**레벨 2 - 구체적**: 상세 기능 명세 → 의도대로 구현
**레벨 3 - AI 확장**: AI Expand 버튼 (2024년 6월 출시)

**프롬프트 도우미**: Figma Make GPT 활용

### 3. 복잡한 화면 분할 전략

**단일 프롬프트 적합**: 카드 리스트, 기본 폼, 단순 대시보드
**분할 필요**: 멀티페이지, 복잡한 대시보드

**분할의 이점**:
- Point and Edit 수정 범위 증가
- 프롬프트당 집중도 향상
- 디버깅 용이

### 4. 반응형 디자인 설정

**3개 브레이크포인트 전달**:
- Desktop (1440px)
- Tablet (768px)
- Mobile (375px)

최대 3개 프레임 활용 → 자연스러운 반응형

### 5. 반복 작업 자동화

| 작업 | 수동 | Make | 절약 |
|------|------|------|------|
| 컬러 변수 | 2시간 | 5분 | 1시간 55분 |
| 더미 데이터 | 1시간 | 2분 | 58분 |
| 애니메이션 스펙 | 30분 | 3분 | 27분 |

---

## ✅ 체크리스트

### 디자인 준비
- [ ] Auto Layout 적용
- [ ] 레이어 이름 지정
- [ ] 컴포넌트 라이브러리 활용
- [ ] 브레이크포인트별 디자인
- [ ] 인터랙션 요소 파악

### 프롬프트 작성
- [ ] 구체적 기능 명세
- [ ] 인터랙션 상세 설명
- [ ] 데이터 요구사항 정의
- [ ] 유효성 검사 규칙
- [ ] 애니메이션 세부사항

### 편집 및 검증
- [ ] Point and Edit 시도
- [ ] 코드 직접 편집
- [ ] 추가 프롬프트 (최후 수단)
- [ ] 다양한 화면 크기 테스트
- [ ] 실제 데이터 확인

### 공유 전
- [ ] 민감 정보 제거
- [ ] 공유 방식 결정
- [ ] 권한 설정 확인
- [ ] 팀 테스트
- [ ] 피드백 반영

---

## 🚀 로드맵 (2024년 6~7월)

### 6월 말

1. **디자인 시스템 연동**: 컬러/폰트 자동 추출
2. **가이드라인 파일**: 반복 규칙 작성 가능
3. **모바일 프리뷰 토글**: Desktop ↔ Mobile 전환
4. **AI 프롬프트 확장**: 자동으로 구체적 프롬프트 생성

### 7월

5. **Supabase 통합**: 데이터베이스 및 API 연결

### 장기

6. **풀 디자인 시스템**: 컴포넌트 라이브러리 자동 반영
7. **Figma Design 통합**:
   - Phase 1: 같은 캔버스에 나란히
   - Phase 2: Figma Design처럼 완전 편집
8. **개발자 핸드오프 강화**: 코드 품질 개선
9. **Conversation Mode**: Make가 역질문
10. **접근성 강화**: 더 강력한 가드레일

---

## 🎨 AlphaView 프로젝트 적용 포인트

### 1. 고속 프로토타이핑

**현재**: 디자인 → 코드 → 빌드 → 테스트
**도입 후**: 디자인 → Make → 프로토타입 → 검증 → 코드

**시나리오**:
- 기사 카드 A/B 테스트 → 5분
- Admin 차트 아이디어 검증 → 즉시
- 모바일 반응형 확인 → 3개 브레이크포인트

### 2. 디자인 시스템 구축

**Step 1**: AlphaView 페이지 → 컬러 추출 → Tailwind 스케일 → Figma 변수
**Step 2**: UI 요소 컴포넌트화 → 인터랙션 확인 → 개발자 스펙 전달

### 3. 사용자 테스트 효율화

**Before**: 예측 어려움 → 코드 작성 → 수정 비용 높음
**After**: 3가지 버전 프로토타입 (각 5분) → 팀 테스트 → 최선안 선택

### 4. 개발자 커뮤니케이션

**Before**: 설명 → 상상 → 오해 가능성
**After**: Make 프로토타입 공유 → 즉시 이해

### 5. 시간 절약 (주당)

| 작업 | 기존 | Make | 절약 |
|------|------|------|------|
| 프로토타입 3개 | 6시간 | 30분 | 5.5시간 |
| 컬러 정리 | 2시간 | 10분 | 1시간 50분 |
| 인터랙션 설명 | 1시간 | 5분 | 55분 |
| 테스트 목업 | 3시간 | 20분 | 2시간 40분 |
| **총 절약** | - | - | **약 11시간** |

### 6. 도입 고려사항

**장점**:
- ✅ 아이디어 빠른 검증
- ✅ 팀 커뮤니케이션 명확
- ✅ 디자인 시스템 가속
- ✅ 반응형 즉시 테스트

**제약**:
- ⚠️ 프로덕션 코드 직접 사용 불가
- ⚠️ 디자인 시스템 풀 지원은 향후
- ⚠️ 비결정적 출력
- ⚠️ Figma Full Seat 필요

**도입 순서**:
1. 소규모 프로토타입 시작
2. Design hygiene 개선
3. 팀 워크샵
4. 복잡한 프로토타입 시도
5. 디자인 시스템 연동

---

## 📚 참고 자료

- [Figma Make Documentation](https://help.figma.com/hc/en-us/articles/16686208127127) — 공식 가이드 및 튜토리얼
- [Figma Plugin API](https://www.figma.com/plugin-docs/) — Variable Importer/Exporter 등 플러그인 개발
- [Anthropic Claude Sonnet 4](https://www.anthropic.com/claude) — Figma Make의 기반 AI 모델
- [Radix UI](https://www.radix-ui.com/) — Figma Make가 생성하는 기본 컴포넌트 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) — Figma Make의 기본 스타일링 프레임워크
- [Supabase](https://supabase.com/) — 2024년 7월 통합 예정 데이터베이스/API 서비스

---

## 🔍 Q&A 핵심

**Q: Layer 이름 중요?**
A: 네. 후속 프롬프트에서 정확히 참조 가능. AI "Rename Layers"로 자동화.

**Q: 멀티페이지 팁?**
A: 페이지당 1 프롬프트. Point and Edit 수정 용이.

**Q: 결정적?**
A: 아니오. 구체적 프롬프트 + 가이드라인으로 일관성 향상.

**Q: 접근성?**
A: 시스템 프롬프트에 포함. 향후 강화 예정.

**Q: API 연동?**
A: Supabase 2024년 7월.

**Q: Figma Design 통합?**
A: Phase 1 곧 출시 (나란히), Phase 2 개발 중 (완전 편집).

**Q: 모바일?**
A: 가능. 3개 브레이크포인트 첨부 권장. 6월 토글 출시.

**Q: 공유 보안?**
A: Play → 내부 (Figma 권한), Publish → 공개 (민감 정보 주의).

---

**작성자 노트**: AlphaView 프로젝트의 디자인 → 개발 워크플로우 개선 목적. Figma Make 도입 시 프로토타이핑 속도 10배 향상, 팀 커뮤니케이션 오류 감소 예상.
