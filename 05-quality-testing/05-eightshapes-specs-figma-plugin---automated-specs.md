# EightShapes Specs Figma Plugin - Automated Specs

> Original issue: shaun0927/stocktitan-crawler#582

## 📌 핵심 개념
- **자동화 대상**: Anatomy(요소 마킹), Props(변형 비교), Layout and spacing(Autolayout 레드라인)
- **2초 실행**: 단순 컴포넌트 1~2초, 복잡한 컴포넌트(예: Github Primer Comment box) 최대 8~10초
- **Output 구조**: Title + Anatomy + Props(인스턴스만) + Layout and spacing(Autolayout 사용 시)
- **Props 자동 비교**: Variant props는 기본값 vs 각 대안 옵션 비교, Boolean props는 영향받는 레이어 하이라이트

## 🎯 실무 노하우
- **Anatomy 순회 중단**: 중첩 컴포넌트(예: Card 안의 CardText) 만나면 순회 멈춤 → 별도로 플러그인 재실행 권장
- **Compound Props 수동 조합**: Type + Color mode 같은 복합 속성은 플러그인 2회 실행 후 수동 조합
- **Redline 색상 체계**: 크롬 Inspector 색상 매핑 (Orange=margin, Green=padding, Blue=element)
- **Horizontal 재배치**: 자동 생성된 수직 배치를 수평으로 재배치하여 팀 선호도 반영
- **Style 커스터마이징**: ESDS Spec 텍스트/색상 스타일이 로컬에 있으면 자동 적용, 없으면 하드코딩

## 📊 주요 구조/다이어그램
**플러그인 실행 흐름**:
```
Select instance/frame → Run plugin → Processing 1-10s
  ↓
[Title] + [Anatomy] + [Props] + [Layout and spacing]
  ↓
Manual adjustments (orientation, dark mode background, compound props)
```

**Props 출력 구조**:
- Variant Props: 섹션(Type) → 옵션별 Exhibit(Basic/Error/Success/Warning)
- Boolean Props: 단순 display (default값 + 영향받는 레이어 블루 하이라이트)
- Compound Props: 수동 조합 (Type×ColorMode 등)

**Layout and spacing**:
- 레이어별 분해 (코드와 동일)
- 패딩/아이템스페이싱 레드라인 자동 생성
- 무관한 부분은 dim 처리

**스타일 자동 생성 여부**:
- 로컬에 ESDS Spec 스타일 있음 → 자동 적용
- 없음 → 하드코딩 (팀이 반대하여 기본 동작 변경)

---
> 출처: Nathan Curtis (EightShapes)
> Plugin: EightShapes Specs (Figma Community)