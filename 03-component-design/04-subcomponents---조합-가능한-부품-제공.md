# Subcomponents - 조합 가능한 부품 제공

> Original issue: shaun0927/stocktitan-crawler#561

# Subcomponents: 통제를 내려놓고 구현자가 조합하게 하라

## 📌 핵심 개념

> **Subcomponent**: 특정 부모 컴포넌트나 컨텍스트 내에서만 사용하도록 의도된, 독립적으로 조합 가능한 UI 컴포넌트

**설정 vs 조합의 딜레마**:

| 옵션 | 설명 | 문제점 |
|------|------|--------|
| **설정 추가** | 필요한 prop을 계속 추가 | 끝없는 whac-a-mole 게임, 컴포넌트 복잡화 |
| **직접 구현** | 구현자가 처음부터 만들기 | 시간 부족, 토큰 활용법 미숙 |
| **서브컴포넌트** | 작지만 유용한 부품 제공 | ✅ 유연성, 자율성, 의존도 감소 |

## 🎯 실무 노하우

### 마인드셋 전환

**기존 원칙**:
1. 매우 흔한 것은 설정 가능하게 (configurable)
2. 덜 흔한 것은 시간이 허락하면 설정 가능하게

**새로운 원칙**:
1. 매우 흔한 것은 설정 가능하게 (configurable)
2. **흔하지 않은 것은 조합 가능하게 (composable)** ← 새로 추가
3. 덜 흔한 것은 시간이 허락하면 설정 가능하게

### 분해 프로세스

**Step 1: 안에서 밖으로 (Inside-out) - 청크 식별**

| 타입 | 설명 | 예시 |
|------|------|------|
| **Lockups** | 요소들을 결합하고 내부 간격 캡슐화 | `CardText` (title + description + metadata) |
| **Extensions** | 기존 컴포넌트를 확장/제한 | `CardImage` (Image 확장 + aspect ratio 제한) |
| **Combinations** | 승인된 조합을 열거 | `CardActions` (Button/Link/IconButton 조합) |
| **Repeaters** | 반복 항목 | `ListItem`, `CheckboxItem` |

**Step 2: 밖에서 안으로 (Outside-in) - 컨테이너 식별**

| 타입 | 설명 | 용도 |
|------|------|------|
| **Generic Container** | 범용 컨테이너 | `CardContainer` - 레이아웃, 간격, 배경색, 상태 |
| **Typed Container** | 특정 자식 기대 | `CardMedia`, `CardContent`, `CardActions` |
| **Interactive Container** | 인터랙션 래퍼 | `CardButton` - hover, focus 상태 |

### 조합 예시

**순서 변경 (Reordering)**:
```jsx
<CardContainer>
  <CardText />  {/* 위로 */}
  <CardImage /> {/* 아래로 */}
</CardContainer>
```

**가로 레이아웃 (Horizontal)**:
```jsx
<CardContainer>
  <CustomLayout--Orientation>
    <CardImage />
    <CardText />
  </CustomLayout--Orientation>
</CardContainer>
```

**요소 추가 (Adding elements)**:
```jsx
<CardContainer>
  <CustomLayout--Dismiss>
    <CardImage />
    <CardText />
    <DismissIcon /> {/* 절대 위치 */}
  </CustomLayout--Dismiss>
</CardContainer>
```

### 예상되는 반대 의견과 대응

| 반대 의견 | 대응 |
|-----------|------|
| "일관성과 품질이 위험해진다" | "구현자는 자신의 운명을 소유한다. 시스템은 통제보다는 장비 제공과 가속화를 위해 존재한다" |
| "구현자 작업이 늘어난다" | 대부분을 서브컴포넌트가 해결, 마지막 조합만 직접 수행 |
| "기술 부채가 생긴다" | 모든 구현자 작업은 동일한 부채 리스크를 가짐 |

## 📊 CardContainer 구조

```
CardContainer
├── CardMedia (zone)
│   └── Image / Icon / SpotIllustration
├── CardContent (zone)
│   └── CardText / 커스텀 레이아웃
└── CardActions (zone)
    └── Button / Link / IconButton
```

### API 분산 전략

**Top-level Component**:
```jsx
<Card
  size="medium"
  variant="primary"
  title="Title"
  imageSrc="..."
  actions={[...]}
/>
```

**Subcomponent Approach**:
```jsx
<CardContainer variant="primary" colorMode="light">
  <CardImage src="..." aspectRatio="16:9" />
  <CardText title="Title" description="Description" size="medium" />
  <CardActions>
    <Button>Action 1</Button>
    <Link>Action 2</Link>
  </CardActions>
</CardContainer>
```

## 철학적 전환

**기존 사고방식**:
> "시스템이 모든 것을 제공해야 한다"

**새로운 사고방식**:
> "구현자는 자신의 운명을 소유한다. 시스템은 통제하거나 막기보다는 장비를 제공하고 가속화하기 위해 존재한다"

---

*출처: Nathan Curtis (EightShapes), 2022-07*