# A Design System's Reach - 4 Levels of System Scope

> Original issue: shaun0927/stocktitan-crawler#583

## 📌 핵심 개념
- **시스템 범위의 4단계**: Team → Portfolio → Enterprise → Worldwide
- **Team Playbook**: 단일 팀의 HTML/CSS 플레이북, 깊은 문서화 불필요, 완전한 자율성
- **Portfolio Guide**: 2-10개 팀이 공유, 플랫폼별 운영, 소유권/역할/비용 질문 발생
- **Enterprise Language**: 모든 제품에 걸친 통합 디자인 언어, 플랫폼 교차(웹+네이티브), 대규모 투자 필요
- **Worldwide Standard**: 누구나 채택 가능, 오픈소스, Material Design/Bootstrap 수준

## 🎯 실무 노하우
- **시작 전 명확화**: "How broadly applicable is this system we are making?" 질문으로 범위 설정
- **적절한 투자 규모**:
  - Team: 2-3개월, 별도 투자 없음 (제품 팀 자체 작업)
  - Portfolio: 6-12개월, 파트타임 다수 또는 소규모 풀타임 팀
  - Enterprise: 12-24개월, 풀타임 전담 팀 필요
  - Worldwide: 수년, 대규모 조직 투자
- **범위에 맞는 기대치**: 작은 팀이 Enterprise 수준의 시스템을 만들려 하면 실패
- **단계적 성장**: Team → Portfolio → Enterprise로 자연스럽게 확장 가능
- **플랫폼 현실**: Portfolio 단계에서 이미 플랫폼별(iOS/Android/Web) 분리가 발생하는 경우 많음

## 📊 주요 구조
```
Worldwide (Material Design, Bootstrap)
    ↑
Enterprise (IBM, Salesforce, Google)
    ↑
Portfolio (2-10 teams, federated)
    ↑
Team (single product, autonomous)
```

## 💡 실무 적용
- **초기 스타트업**: Team 수준으로 시작, 과도한 문서화/중앙화 지양
- **성장 단계**: Portfolio로 전환 시 거버넌스/소유권 모델 확립
- **대기업**: Enterprise 투자 결정 시 경영진 동의 및 전담 리소스 확보 필수

---
> 출처: Nathan Curtis, Feb 4, 2016
> 원문: A Design System's Reach