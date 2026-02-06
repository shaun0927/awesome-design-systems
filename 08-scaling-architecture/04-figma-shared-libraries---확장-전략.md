# Figma Shared Libraries - 확장 전략

> Original issue: shaun0927/stocktitan-crawler#565

# Figma Shared Libraries - 디자인 시스템 확장 전략

## 📌 핵심 개념

디자인 시스템은 단일 중앙집중식 라이브러리에서 **계층적 생태계**로 진화

```
Core Library (코어 라이브러리)
    ↓ 의존
Shared Library (공유 라이브러리)
    ↓ 의존
Local Library (로컬 라이브러리)
    ↓ 사용
Project Files (프로젝트 파일)
```

### Shared Library (공유 라이브러리) ⭐

- **정의**: 많은 팀이 필요로 하는 기능으로, 코어 라이브러리를 확장
- **관리**: 디자인 시스템 코어 팀이 아닌 **기여자**가 제작 및 유지관리
- **판단기준**: **3개 이상의 팀**에서 **12개월 이상** 사용

## 🎯 실무 노하우

### 라이브러리 생명주기 (6단계)

#### 1. Setup (설정) 🔴🔶
- 누가 라이브러리 생성을 결정하는가?
- Figma 팀, 프로젝트, 파일 소유권은?
- Main Branch의 편집자는?

#### 2. Plan (계획) ⚠️
- 라이브러리에 들어갈 기능 우선순위 결정
- **우선순위 결정 요소**:
  1. Urgency (긴급성)
  2. Near term shared need (단기 공유 필요)
  3. Long term shared need (장기 공유 필요)
  4. Maker availability (제작자 가용성)
  5. Maintainer availability (유지관리자 가용성)

#### 3. Produce (제작) ✅🔶
- 기능 명명 및 범위 결정
- 기존 패턴 감사 (Audit)
- Figma 컴포넌트 빌드
- **네임스페이스 사용**:
```
ESDS Editor / Button        (공유 라이브러리)
ESDS / Button                (코어 라이브러리)
MyTeam / Button              (로컬 라이브러리)
```

#### 4. Review (검토) ⚠️
- **Branching 워크플로우 권장**:
  - Main Branch: Maintainer만 작업
  - Feature Branches: 기여자가 작업
- **품질 기준 설정**: "How good must it be?" 워크샵

#### 5. Publish (발행) ⚠️🔴
- 라이브러리 스타일 및 UI 컴포넌트 발행
- 사용자에게 변경사항 커뮤니케이션
- 공유 라이브러리에서 코어 라이브러리로 승격 (필요시)

#### 6. Monitor & Maintain (모니터링 및 유지) ⚠️✅
- Figma 분석을 통한 사용량 모니터링
- 개선 및 수정 요청 대응
- **중요**: "발행 후 선반에 올려두지 마라"

### 역할 및 책임

| 아이콘 | 역할 | 수행 가능 작업 |
|--------|------|---------------|
| ✅ | **Any Contributor** | 디자인, 빌드, 스펙, 문서화 |
| ⚠️ | **Library Maintainer** | 승인, 발행, 우선순위 결정 |
| 🔶 | **Coordinated with Core Team** | 명명, 범위 결정, 코어 승격 |
| 🔴 | **Core Team Steward** | 소유권, 권한 관리 |

**Library Maintainer의 핵심 역할**:
> "Maintainer는 단순히 만드는 사람이 아니라, **유지관리하고 운영**하는 사람이다."

### 배치 전략: 코로케이션 (Co-location)

**시각적 배치**:
```
Figma 라이브러리 다이얼로그

┌─────────────────────┐
│ ESDS CORE           │ ← 코어 (동일 브랜딩)
│ Tokens              │
└─────────────────────┘

┌─────────────────────┐
│ ESDS SHARED LIBRARY │ ← 공유 (동일 브랜딩 + "SHARED" 표시)
│ Editor              │
└─────────────────────┘

┌─────────────────────┐
│ ESDS SHARED LIBRARY │ ← 공유
│ Help                │
└─────────────────────┘
```

**기대 효과**:
- 기여자와 사용자 모두 공유 라이브러리를 "신뢰할 수 있는 확장"으로 인식
- 합리적인 엄격함과 지원으로 제작되었다는 기대

### 공유 라이브러리 유형

#### A. 복잡한 기능
- **Editor 키트**: 리치텍스트 편집기
- **Card & Media Object 키트**
- **Global Navigation** (가장 흔함)

#### B. 플랫폼별
- **iOS Navigation**
- **Android Components**
- **CMS 컴포넌트** (AEM, Drupal용)

#### C. 프레임워크별
- **React 전용**
- **Vue 전용**
- **Web Components 전용**

## 📊 라이브러리 파일 템플릿 구조

```
Pages
├─ Cover (표준 커버 페이지)
├─ About the library (라이브러리 소개)
├─ Component status (컴포넌트 상태)
├─ Version history (버전 히스토리)
├─ Foundation Extensions
│  └─ {Foundation extension name}
├─ Components
│  └─ {UI component name}
└─ Patterns
   └─ {Pattern name}
```

## 성공의 핵심

> "코어 팀이 모든 것을 만드는 것이 아니라, 다른 사람들이 잘 만들 수 있도록 활성화하는 것"

**최종 조언**:
- 템플릿을 개선하라
- 사람들을 참여시켜라
- 모든 것을 혼자 하지 마라
- 명확한 기대치를 설정하라
- "만들어주기"가 아닌 "활성화"에 집중하라

---

*출처: Nathan Curtis (EightShapes), 2022-05*