# Dealing with Dependencies Inside Design Systems

> Original issue: shaun0927/stocktitan-crawler#574

## 📌 핵심 개념
- **Component dependency chain**: icon이 가장 많은 dependents를 가짐 (button, checkbox, select, alert 등에서 재사용)
- **Compositional hierarchy**: 예: menu = popover + list group, popover는 tooltip을 확장
- **Build sequence**: Small to large 순서로 구축 (icon → button → card), 하지만 design은 모든 레벨에서 동시 진행
- **Dependency types**: Component-to-component (명시적) + shared styles/behaviors (암묵적)
- **Subsystem dependencies**: Design tokens, documentation, page types 등도 dependency chain에 포함

## 🎯 실무 노하우
- Trace dependencies up the chain: icon 변경 시 모든 dependent components도 업데이트 필요
- Automate versioning tools: Release wizard로 impacted dependencies 자동 표시 및 version increment 결정
- Use scripts to highlight dependencies: Repository를 intelligent하게 trace하는 도구 활용
- Design tokens separation: Single source-of-truth로 분리하여 multiple systems 지원
- Breaking changes propagation: Icon이 major version increment 해도 모든 dependents가 major일 필요는 없음 (patch로 처리 가능)

## 📊 주요 구조/다이어그램
**Dependency levels:**
```
Level 1: icon (62 dependents - Atlassian 기준)
Level 2: button (42), avatar (19), modal (15)
Level 3: menu (depends on popover + list-group)
Level 4: popover (depends on tooltip)
```

**Shared style/behavior dependencies (layered components):**
- Shadow, notch, elevation, border-radius (visual)
- Opening/closing states, animation, collision detection (behavioral)

**System output dependencies:**
```
Build Tooling → Design Tokens → UI Components → 
Doc Components → Documentation Site
```

---
> 출처: Nathan Curtis (EightShapes)
> Series: Releasing Design Systems #5 of 6