# Cards and Composability - 컴포저블 컴포넌트 설계

> Original issue: shaun0927/stocktitan-crawler#568

# 디자인 시스템에서 카드와 컴포저빌리티

## 📌 핵심 개념

**카드의 본질**:
- "스캔 가능한 객체의 핵심 정보 스냅샷"
- **목적**: 식별할 수 있을 만큼의 정보를 미리보여주고, 더 자세한 정보로 유도하는 진입점

**컴포저빌리티의 중요성**:
- **전환점**: 카드는 컴포넌트 라이브러리 성장의 중요한 분기점
- **시스템 성숙도 테스트**: 컴포저블 컴포넌트를 다루는 방식이 디자인 시스템의 성숙도를 보여줌

### 4가지 설계 영역

1. **구조 (Structure)**: 요소 구성과 관계
2. **콘텐츠 (Content)**: 미디어와 텍스트 처리
3. **스타일 (Style)**: 시각적 언어와 테마
4. **행동 (Behavior)**: 인터랙션과 클릭 가능 영역

## 🎯 실무 노하우

### 구조(Structure) 설계

#### 필수 요소 식별

**필수 요소**:
- Image (이미지)
- Title (제목, 보통 heading 스타일)
- Description (설명, "deck"이라고도 함)

**선택 요소**:
- Label/Type (카테고리 태그)
- Actions (버튼 또는 아이콘)
- Price, Ratings (전자상거래)
- Metadata (핵심 속성)

#### 요소 관계 정립

**중요 결정사항**:
- **Named Zones**: header, main, footer 또는 media, copy, actions
- **요소 순서**: 고정 vs 유연
- **서브그룹**: 재정렬 또는 숨김 가능 여부
- **조합 로직**: 어떤 조합이 금지되는가?

### 콘텐츠(Content) 설계

#### 실제 콘텐츠 기반 설계

**해결책**:
- 표준 종횡비 정의 (16:9 landscape + 정사각형 대안)
- 콘텐츠 팀의 이미지 제작 부담 감소
- 부산물: `thumbnail` 컴포넌트 (다른 컴포넌트에서도 재사용)

**Takeaway**:
> 컴포저블 컴포넌트일수록 콘텐츠 고려가 중요. 실제 콘텐츠로 스트레스 테스트하고, 콘텐츠 담당자와 협업하면 새로운 베스트 프렌드가 될 수 있다.

#### 텍스트 길이 제어

**Truncation 전략**:
- 찬성: 예측 불가능한 길이 보호
- 반대: 맥락 손상 위험
- **우선순위**: Description truncate > Title truncate
- **라인 수**: 2줄 이후 또는 3줄 이후

**Takeaway**:
> Truncation은 통제의 도구이지 만능 해결책이 아님. 유틸리티로 제공하되 남용 방지 가이던스 제공

#### 콘텐츠 누락 시 대응

**이미지 누락 시 옵션**:
- 배경색 + 아이콘으로 자산 유형 표시
- 사이트 아이덴티티 마크 오버레이
- 색상/아이콘 조합으로 콘텐츠 채널 표시

### 스타일(Style) 설계

#### 시각적 언어 확장

**카드가 촉발하는 시스템 수준 논의**:
- `border-radius`: 모서리 둥글기 표준
- `shadow`: 그림자 깊이 체계
- `background-color`: 카드와 캔버스 간 대비

**Takeaway**:
> 컴포저블 컴포넌트는 시스템의 시각적 톤을 설정하며, 이후 많은 디자인에 영향을 미침

#### 복잡한 접근 (Discovery Education Comet 사례)

- 라이트/다크 카드 × 다양한 캔버스 배경
- Mixin과 토큰으로 관리
- **계층 구조**: Text on Component BG on Canvas BG

### 행동(Behavior) 설계

#### 1) 전체 카드 클릭 (권장)

**장점**:
- 단순성
- `:hover`, `:focus` 이벤트 처리 명확
- 일관된 피드백

**적용 상황**: 카드가 단일 목적지로의 진입점일 때

#### 2) 다중 인터랙션 영역

**주의사항**:
- 마크업, 스타일, 행동 모두 복잡해짐
- **디자인 단계에서 엔지니어와 논의 필수**
- 구현 후 변경은 고통스러움

**Takeaway**:
> 디자인 핸드오프 전에 클릭 가능 영역과 이벤트 처리를 명확히 논의하라

## 📊 카드 컴포넌트 구성 예시

### 표준 구성
```jsx
<Card>
  {/* Media Zone */}
  <CardImage src="image.jpg" aspectRatio="16:9" />

  {/* Copy Zone */}
  <CardType icon="destination">DESTINATION</CardType>
  <CardTitle truncate={2}>Reynisfjara</CardTitle>
  <CardDescription truncate={3}>
    Travel to Vik, Iceland...
  </CardDescription>

  {/* Actions Zone */}
  <CardActions>
    <IconButton icon="heart" count={24} />
    <IconButton icon="bookmark" />
    <Menu />
  </CardActions>
</Card>
```

## 핵심 Takeaways

1. **컴포저빌리티는 시스템 성숙도의 시험대**
2. **실제 콘텐츠 중심 설계**: 가상 데이터가 아닌 실제 데이터로 테스트
3. **콘텐츠 팀과 협업**: 디자이너만의 결정이 아님
4. **"딱 충분한" 복잡성**: 모든 경우를 해결하려 하지 말고, 핵심 변형만 지원
5. **엔지니어와 조기 논의**: 특히 인터랙션 영역
6. **유연성 vs 통제**: Region으로 유연성 제공하되, 남용 방지 가이드
7. **시스템 언어 확장**: 카드 설계 과정에서 시스템 수준 결정 발생

**핵심 메시지**:
> "카드는 디자인 시스템이 성장하면서 만나는 첫 번째 복잡한 컴포넌트이며, 이를 어떻게 다루느냐가 시스템의 성숙도와 방향성을 결정한다"

---

*출처: Nathan Curtis (EightShapes), 2018-04*