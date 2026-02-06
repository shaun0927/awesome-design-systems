# Reimagining Token Taxonomy - Audit to Implementation

> Original issue: shaun0927/stocktitan-crawler#577

## 📌 핵심 개념
- **토큰 재설계 프로세스**: 감사(Audit) → 워크숍(Workshop) → 결정(Decide) → 구현(Implement) 4단계
- **3-Tier 토큰 구조**: Generic (palette-red-50) → Semantic (color-alert-error) → Component (button-primary-background)
- **토큰 흐름 매핑**: Style Dictionary → 플랫폼별 transform → 유틸리티 → 컴포넌트 파일까지 전체 경로 추적
- **토큰 타입 다양성**: 색상 외 Typography, Space, Size, Shape, Elevation 등 모두 포함

## 🎯 실무 노하우
- **Figma Selection Colors로 감사**: 전체 변형 선택 → 색상별 적용 추적 → 의도/정밀도/오류 발견
- **Airtable로 제안 관리**: 토큰명(레벨별 컬럼), 타입, 값, 별칭, 설명을 구조화된 테이블로 관리
- **FigJam 워크숍 템플릿**: 시각 예제 + 토큰 구조 샘플 + 대안 스티커 투표 → 선택지 제거하며 의사결정
- **Spec 문서화**: 디자인 사양(swatch, 값, 이름, 별칭, Figma 스타일, 설명)을 단일 소스로 정리
- **코드 마이그레이션 샘플 제공**: 몇 개 컴포넌트에 before/after 라인별 비교, 패턴 확인 후 팀이 나머지 처리

## 📊 주요 구조/다이어그램
- **토큰 흐름 맵**: Style Dictionary → JSON compile → CSS variables/iOS swift/Android XML → Utility → Component
- **감사 스프레드시트**: as-is 토큰(이름, 위치, 설명) + 적용된 컴포넌트/속성 + 문제점 기록
- **워크숍 선택 보드**: 컨셉별 대안 스티커 → 투표 → 논의 → 빨강(제거)/초록(선택)
- **Alert 토큰 예시**: 5가지 타입(Basic/Error/Success/Warning/Informational) × Light/Dark 모드
- **코드 구현 흐름**: Spec → Style Dictionary → Figma Styles → Component Code → Documentation

---
> 출처: Nathan Curtis (EightShapes)