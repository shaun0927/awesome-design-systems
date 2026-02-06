# Figma 컴포넌트 리뷰 가이드

> Original issue: shaun0927/stocktitan-crawler#545

# Figma 컴포넌트 리뷰 가이드

## 📌 핵심 개념

- **컴포넌트 테스팅의 중요성 증가**: Figma 기능 확장에 따라 효과적이고 오류 없는 적용을 보장하기 위한 투자 확대 필요
- **4단계 사이클**: Prepare → Review → Retest and Resolve → Complete
- **체크리스트 구조**: Pass/Fail/Not checked/Not applicable 상태 관리 시스템
- **9개 검증 영역**: Metadata, Anatomy, Color styles, Text styles, Properties, Content, Spacing, Layout, Composition

## 🎯 실무 노하우

### 1. 체크리스트 설계 원칙
- **구체성 유지**: "props 테스트" 대신 "각 텍스트 레이어가 정의된 텍스트 스타일과 연결되어 있는가?"
- **사용자 관점 표현**: "As a product designer, I can..." 형식으로 수용 기준 프레임

### 2. 상태 관리 모범 사례
- Figma 컴포넌트 활용: status 속성이 있는 서브컴포넌트 사용
- 페이지에 배치하여 작업 추적, 사이클 완료 시 컴포넌트 폐기

### 3. 검증 도구 활용
- **Layers 패널**: 컴포넌트 구조 검사, 레이어 이름 및 가시성 확인
- **Design 패널**: 색상 스타일, 텍스트 스타일, 속성 확인
- **Selection colors**: 여러 객체에 걸친 색상 스타일 일관성 추적

### 4. 팀 커스터마이징
- 팀이 가장 중요하게 여기는 기준 선택
- 기본부터 시작, 필요에 따라 확장
- 콤팩트하고 효과적으로 유지

## 📊 9개 검증 카테고리

1. **Metadata**: Name, Namespace, Description, Status
2. **Anatomy**: Layer name, Layer format, Layer shorthand, Nested component names, Default visibility
3. **Color styles**: Color accuracy, Color styles, Style specificity, Hardcoded colors, "Buried" colors
4. **Text styles**: Text styles, Non-text style properties
5. **Properties**: Property names/order, Option names/order, Default option
6. **Content**: Wrong/Just right/Too much/Too little/Missing content
7. **Spacing**: Padding around items, Alignment, Space between items
8. **Layout**: Element layout, Text layout
9. **Composition**: Subcomponent properties/content, Slot resize/content reflow

## 🚀 적용 가이드

### 시작 단계
1. 기본 체크리스트 구축 (Metadata, Anatomy, Color, Text부터 시작)
2. Figma 컴포넌트 제작 (Component Review Checklist)
3. 파일럿 테스트 (1-2개 컴포넌트로 워크플로우 테스트)
4. 확장 (Properties, Content, Spacing, Layout, Composition 추가)

### 성공 팁
- **명확한 소유권**: 빌더와 테스터 역할 명확히
- **정기적 업데이트**: Figma 기능 업데이트에 따라 기준 갱신
- **문서화**: 기준의 "왜"를 문서화하여 컨텍스트 제공
- **자동화**: 가능한 경우 Figma 플러그인으로 일부 검사 자동화

---
*출처: Nathan Curtis (EightShapes)*
*분석일: 2026-02-06*