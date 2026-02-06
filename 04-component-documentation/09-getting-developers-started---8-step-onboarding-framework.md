# Getting Developers Started - 8-Step Onboarding Framework

> Original issue: shaun0927/stocktitan-crawler#588

## 📌 핵심 개념
- **8단계 온보딩 프레임워크**: Install → What's Included → Apply Visual Style → Use Component → Extend Component → Configure → Learn More → Engage Community
- **첫인상이 전부**: Getting Started 문서는 시스템 성공의 핵심 - 개발자가 막히면 시스템 신뢰도 붕괴
- **빠르고 고통 없는 경험**: 개발자는 몇 분 안에 설치부터 첫 컴포넌트 사용까지 완료하며 자신감을 얻어야 함
- **플랫폼별 가이드 제공**: Web vs React Native vs Android 등 플랫폼별 설치/통합 방법 명시
- **"Hello World" 컴포넌트 예제**: 단 하나의 sensitizing example로 import → integrate → configure 전체 흐름 보여주기

## 🎯 실무 노하우
- **설치 가이드 절대 간소화 금지**: "yarn install" 한 줄로 끝내지 말고, 인증 필요 여부/플랫폼 선택/프레임워크 선택(React vs Vue vs Vanilla) 등 상세 단계 제공
- **폴더 구조 다이어그램 필수**: dist/ 아래 components/, styles/, tokens/, icons/, fonts/ 등 어디에 뭐가 있는지 시각적으로 보여주기
- **Design Tokens 통합 가이드**: 토큰을 library에 통합된 파일로 쓸지, 별도 dependency로 consume할지 명시
- **컴포넌트 확장 가이드**: 시스템이 모든 문제를 해결하지 못함을 인정 - Design Tokens + Primitive Components(Icon, Button)로 커스텀 구성하는 법 안내
- **커뮤니티 연결로 마무리**: 도움 요청/버그 신고/기능 요청/기여 방법 등 CTA로 고립되지 않도록 유도

## 📊 주요 구조/다이어그램
**8단계 Getting Started 프레임워크:**
```
1. Installation
   - 패키지 설치 방법 (yarn/npm/bower/gulp)
   - 인증 필요 시 repository 접근 방법
   - 플랫폼 선택 (Web/React Native/Android/iOS)
   - 프레임워크 선택 (React/Vue/Vanilla HTML&CSS)

2. What's Included
   - 폴더 계층 다이어그램 또는 테이블
   - Components, Styles, Tokens, Icons, Fonts 위치

3. Apply Visual Style
   - Main CSS <link> 참조
   - Icon assets (SVG 등) 참조
   - Web fonts 로드
   - Design tokens 통합
   - Sass mixins 등 전처리 도구

4. Use a Component
   - Import statement + folder path
   - Element markup 추가
   - BEM modifier/props로 설정
   - Functions/macros 사용 (copy-paste 지양)
   - Sample reference application

5. Override/Extend Component
   - Markup/style/script 확장 방법
   - Design tokens + primitive components 활용
   - 시스템 아키텍처에 일관된 composition 모델

6. Configure & Optimize
   - Theme 적용
   - Asset consumption 최적화 (CSS/icon SVG)

7. Learn More
   - Architecture 원칙
   - 지원 브라우저/접근성 표준
   - BEM CSS 등 방법론
   - Dependencies (jQuery, polyfills 등)

8. Engage Community
   - Get help
   - Report defects
   - Request features
   - Contribute
```

**문서 작성 타이밍:**
- Launch 전 beta 기간에 작성 시작
- 핵심 파트너와 온보딩 테스트
- 광범위 채택 전 polish

---
> 출처: Nathan Curtis (EightShapes)
> 원문: "Getting Developers Started with a Design System" (May 2018)