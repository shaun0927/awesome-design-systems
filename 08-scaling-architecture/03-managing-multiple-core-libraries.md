# Managing Multiple Core Libraries

> Original issue: shaun0927/stocktitan-crawler#546

# 다중 코어 라이브러리를 가진 디자인 시스템 관리

## 📌 핵심 개념

- **코어 라이브러리**: 플랫폼/프레임워크별(Web, iOS, Android) 핵심 컴포넌트 구현
- **팀 모델**: Central Team(전담) vs Federated(독립팀) - 규모와 조직에 따라 선택
- **진실의 원천**: 디자인(Figma) + 코드(Reference Implementation) 동기화 필요
- **Release Individually, Communicate Collectively**: 독립 릴리스 + 통합 발표로 속도와 정렬 양립

## 🎯 실무 노하우

### 관리 복잡도 5가지 축
1. **Roadmap**: 팀 간 공유 로드맵 유지 노력
2. **Collaboration**: 플랫폼별 handoff 세러머니 관리
3. **API Alignment**: 플랫폼 간 컴포넌트/속성 이름 통일
4. **Designer VQA**: 플랫폼마다 분산된 검증 타이밍 조율
5. **Release Sync**: 독립 릴리스 vs 동기화 릴리스 전략

### 의사결정 가이드
- **단일→다중 라이브러리 전환**: 2개 이상 플랫폼 지원 필요 시
- **중앙팀 vs 연합팀**: 소규모(<500명) 중앙 / 대규모(>2000명) 하이브리드
- **릴리스 동기화**: 1-2개 라이브러리는 동기화, 3개 이상은 독립 + 집단 커뮤니케이션
- **API 정렬 전략**: 컴포넌트/속성 명명 통일 최우선, 플랫폼별 관례 허용 범위 합의

### IBM Carbon 성공 요인
- 명확한 Reference Implementation(React + Vanilla)
- 투명한 공개 리포지토리로 활동도 측정
- 각 라이브러리 독립 릴리스 허용
- Storybook으로 프레임워크 간 API 비교 가능

## 📊 라이브러리 우선순위 결정

```
Step 1: 사용량 측정 (제품 팀 수)
Step 2: 임팩트 vs 노력 매트릭스
Step 3: 리소스 할당 (중앙팀 vs 연합팀)
```

**리소스 예시**:
- 중앙팀 4명: Web(React) 3명(75%) + System Ops 1명
- 연합팀: iOS/Android 각 2명(50% 할당)

## ⚠️ 실패하는 연합 모델 징후

| 문제 | 결과 |
|------|------|
| 6개월째 업데이트 없음 | 메인테이너 우선순위 밀림 |
| 플랫폼마다 Button API 다름 | 개발자 학습 비용 증가 |
| 새 컴포넌트가 Web만 지원 | 플랫폼 간 기능 격차 확대 |

**교훈**: 연합 모델은 각 플랫폼에 최소 1명의 **전담** 메인테이너 필요. 부업으로는 불가능.

---
*출처: Nathan Curtis (EightShapes) - Managing Design Systems with Multiple Core Libraries*