# GM의 UX 리서처가 Figma Make를 활용하는 방법 정리

> Original issue: shaun0927/stocktitan-crawler#535

# GM의 UX 리서처가 Figma Make를 활용하는 방법 정리

## 핵심 인사이트

### 1. 시각적 커뮤니케이션의 중요성
- **리서처의 주요 작업물은 언어(텍스트/구두)**이지만, **시각적 표현이 더 효과적**
- Figma 댓글이나 텍스트 피드백은 **해석의 여지**가 있음
- Figma Make를 통해 **추상적 아이디어를 구체적 비주얼로 전환** 가능
- "완벽한 디자인"이 아닌 **"아이디어 전달용 프로토타입"**으로 충분

### 2. AI 도구의 실전 활용 패턴
- **Copilot + Figma Make 조합**: 프롬프트 최적화 → 더 나은 결과물
- **반복 QC 프로세스**: 생성 → 검토 → 수정 지시 → 재생성
- **점진적 개선**: 한 번에 완벽한 결과를 기대하지 않고, 대화형으로 개선
- **구조화된 프롬프트**: 마크다운 포맷, 명확한 단계 구분 → AI가 더 잘 이해

### 3. 브랜드 일관성 유지 전략
- **프롬프트에 브랜드 가이드라인 명시 필수**: "Buick premium brand", "follow website design standards"
- **기존 스크린샷 활용**: 실제 UI를 참조 자료로 제공
- **디자인 시스템 부재 시 대응**: AI가 임의로 결정하지 않도록 명확한 지시

---

## UX 리서치 워크플로우

### 전통적 방식의 한계
```
텍스트 피드백 (Figma 댓글)
  → 디자이너가 해석
    → 오해 발생 가능
      → 추가 커뮤니케이션 필요
```

### Figma Make 활용 워크플로우
```
1. 디자인 리뷰 → 개선 아이디어 도출
2. 기존 UI 스크린샷 수집
3. Copilot으로 프롬프트 최적화
4. Figma Make로 프로토타입 생성
5. QC 후 수정 지시 (반복)
6. Slack으로 비동기 공유
7. 디자이너가 시각적으로 아이디어 이해
8. 다음 디자인 리뷰에 반영 확인
```

**핵심**: 동기 세션이 아닌 **비동기 커뮤니케이션**에 최적화

---

## Figma Make 활용법

### A. 디자인 피드백 시각화

#### 사례: GM Buick 서비스 예약 플로우 개선
**문제 상황**:
- 비즈니스 팀이 "홈 서비스" 기능을 강조 요청
- 하지만 일부 서비스만 홈에서 가능 (오일 교환 ○, 타이어 교체 ✗)
- 위치 선택을 먼저 할지, 서비스 선택을 먼저 할지 논쟁

**Laura의 해결책**:
1. 기존 다단계 플로우 스크린샷 수집
2. Copilot으로 프롬프트 최적화
3. Figma Make로 생성 후 QC
4. 부족한 부분 보완 (스텝 트래커 제거, 홈 서비스 아이콘 추가)
5. 최종 프로토타입을 Slack으로 공유

**결과**: 디자이너가 시각적으로 이해하고 다음 리뷰에 반영

#### 실전 QC 프로세스
- 요청한 플로우 구조가 맞는가?
- 브랜드 일관성이 유지되는가?
- 조건부 로직이 정확한가?
- 불필요한 요소가 있는가?

### B. 리서치 산출물 시각화

#### 사례: Horizontal vs Vertical Navigation 가이드
**문제 상황**:
- 디자인 팀이 가로/세로 네비게이션 논쟁 중
- 표 형식의 상세한 가이드 문서 → **너무 복잡하고 소화하기 어려움**

**리서처의 해결책**:
1. 표 데이터를 Copilot에 입력
2. 3개 컬럼 구조 (Horizontal / Hybrid / Vertical)
3. Figma Make로 생성 → **스캔 가능한 비주얼 아티팩트** 완성
4. 디자인 시스템에 리소스로 추가

**결과**: 다른 팀들도 이 프레임워크를 재사용

---

## GM 사례에서 배운 실전 팁

### 1. Copilot을 프롬프트 최적화 도구로 활용
**결과 비교**:
- Copilot 버전: 브랜드 일관성 ↑, 레이아웃 정렬 ○, 로고 정확
- 인간 버전: 브랜드 이탈, 시각적 정렬 문제, 로고 누락

**시간 절감**: 프롬프트 작성 시간 ↓, 반복 수정 횟수 ↓

### 2. 스크린샷을 참조 자료로 활용
- 프레임에 스크린샷 배치 → 선택 → "Send to Figma Make" 클릭
- AI가 기존 UI 스타일, 위치 정보, 딜러 정보 자동 추출

### 3. 요소 선택 기능 활용
- 삭제하고 싶은 요소를 화면에서 직접 선택
- "Remove this element" (용어 혼동 방지)

### 4. 반복 개선 마인드셋
- 첫 결과물에 완벽을 기대하지 않음
- QC → 수정 지시 → 재생성 → 반복

### 5. 파일 관리 위생
- Duplicate Project 또는 Copy Design으로 복제 후 수정
- 원본 파일을 건드리지 않고 독립적 수정

### 6. 비동기 커뮤니케이션에 최적화
- 라이브 세션에는 부적합
- Slack 비동기 공유가 최적

---

## 리서치 활용 시나리오

### 현재 활용 중
1. 디자인 피드백 시각화
2. 리서치 산출물 포맷팅
3. 빠른 컨셉 검증

### 향후 시도 예정
#### A. 공동 창작 연구 (Co-creation Study)
- FigJam 공동 작업 → Figma Make로 실시간 프로토타입 생성
- 참여자와 함께 디자인 수정

#### B. RITE (Rapid Iterative Testing and Evaluation)
- 재디자인 시간 단축 (하루 → 반나절)
- 전체 기간 단축 (5일 → 4일)

---

## 디자인 시스템 효율성 관점

### 1. 리서처의 역량 확장
- Figma Make로 중급 수준 프로토타입 생성 가능
- 디자이너 수준의 비주얼 커뮤니케이션

### 2. 디자인 시스템 리소스 축적
- 리서치 가이드 문서를 디자인 시스템에 통합
- 다른 팀들이 재사용 가능한 형태로 제공

### 3. 프로토타이핑 속도 향상
- 컨셉 검증 단계: 슬라이드 덱보다 프로토타입이 효과적
- 디자인 워크샵: 아이디어를 즉시 비주얼로 전환

### 4. 디자인 산출물의 품질 기준 조정
**리서처용 프로토타입**:
- Pixel-perfect 불필요
- 아이디어 전달 가능한 수준이면 충분

---

## 체크리스트

### Figma Make 프로젝트 시작 전
- 참조할 기존 UI 스크린샷 수집
- 브랜드 가이드라인 확인
- 전달하려는 핵심 아이디어 명확화
- Copilot에 초안 프롬프트 입력하여 최적화

### 프롬프트 작성 시
- 브랜드 가이드라인 명시
- 마크다운 포맷 사용
- 명확한 섹션 구분

### QC 수행 시
- 요청한 플로우/구조 구현 여부
- 브랜드 일관성 유지 여부
- 불필요한 요소 존재 여부

---

## AlphaView 적용 포인트

### 1. 리서치 아티팩트 시각화
- 사용자 여정 맵을 시각적 플로우로 변환
- A/B 테스트 결과를 비교 UI로 시각화

### 2. 빠른 UI 실험
- PM/개발자가 직접 초안 프로토타입 생성
- "AlphaView 톤&매너 유지" 프롬프트에 포함

### 3. 온보딩/도움말 시각화
- 단계별 온보딩 플로우 프로토타입 생성
- Alpha Score 해석 가이드를 인터랙티브 UI로 변환

### 4. 디자인 시스템 문서화
- "언제 LatestNewsGrid를 쓰고 언제 AlphaArticleGrid를 쓰는가?" 시각적 가이드 생성

### 5. 사용자 테스트 빠른 반복
- 전통적 2주 프로세스 → 2일로 단축

### 6. 비개발자 팀원 역량 강화
- PM, 마케팅, CS 팀원이 직접 프로토타입 생성

---

## 핵심 원칙 정리

1. **완벽보다 전달력**: Pixel-perfect보다 아이디어 명확성
2. **반복 개선**: 첫 결과물에 완벽 기대 ✗
3. **맥락 제공**: 브랜드 가이드라인 + 참조 스크린샷
4. **명확한 지시**: 구체적 요소/위치 지정
5. **비동기 최적화**: 라이브 세션보다 Slack 공유
6. **파일 위생**: 복제 후 수정, 원본 보존
7. **Copilot 활용**: 프롬프트 최적화로 시간 절약
8. **시각적 언어**: 텍스트보다 프로토타입이 효과적

---

## 참고 자료

- [Figma Make Documentation](https://help.figma.com/hc/en-us/articles/16686208127127) — 공식 사용 가이드
- [Microsoft Copilot](https://www.microsoft.com/en-us/microsoft-365/copilot) — 프롬프트 최적화 도구
- [UX Research Methods](https://www.nngroup.com/articles/which-ux-research-methods/) — Nielsen Norman Group, 리서치 방법론
- [RITE (Rapid Iterative Testing)](https://www.usability.gov/how-to-and-tools/methods/rapid-iterative-testing.html) — 신속 반복 테스트 기법
- [Co-creation in UX Research](https://www.nngroup.com/articles/co-creation/) — 참여형 디자인 리서치
- **출처**: Figma Deep Dive - How a UX researcher uses Figma Make at GM
- **발표자**: Laura (GM UX Researcher)
- **주요 도구**: Figma Make, Microsoft Copilot, Slack
- **적용 분야**: UX Research, Design Feedback, Research Artifact Creation

---

**태그**: #FigmaMake #UXResearch #DesignSystem #AITools #PromptEngineering #DesignEfficiency #GM #CaseStudy

**작성일**: 2026-02-05
**작성자**: ULTRAPILOT Worker [11/16]
