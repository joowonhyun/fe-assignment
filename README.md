## 실행방법

```bash
pnpm install
pnpm run dev

# pnpm run dev 명령어 실행 시 json-server 와 Next.js 프로젝트가 함께 실행됩니다.
# Next.js : localhost:3000
# json-server : localhost:3001
```

## 기술 스택 선택 근거

- **Next.js (App Router)**: 서버 컴포넌트(RSC)를 통한 초기 로딩 성능 최적화 및 Parallel Routes를 활용한 독립적인 데이터 페칭/로딩 처리를 위해 도입했습니다.
- **Zustand**: 대시보드의 복잡한 전역 필터(`날짜`, `상태`, `매체`) 상태를 여러 차트와 테이블 간에 효율적으로 공유하고, 불필요한 리렌더링을 방지하기 위해 선택했습니다.
- **Tailwind CSS 4**: 유틸리티 우선(Utility-first) 접근 방식을 통해 빠른 스타일링과 일관된 디자인 시스템 구축이 가능하며, 최신 CSS 기능을 적극 활용하기 위해 사용했습니다.
- **Recharts**: 데이터 시각화를 위해 반응형 지원이 뛰어나고 선언적인 인터페이스를 제공하는 Recharts를 활용했습니다.
- **JSON Server**: 프론트엔드 개발 단계에서 실제 API와 유사한 환경(RESTful)을 빠르게 구축하여 데이터 흐름을 검증하기 위해 도입했습니다.

## 폴더 구조 및 아키텍처

애플리케이션의 확장성과 유지보수성을 위해 **기능 기반 아키텍처(Feature-based Architecture)**를 채택했습니다.

| 계층                      | 주요 경로                            | 역할                                                              |
| ------------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| **`features/campaign/`**  | `components/`, `hooks/`, `services/` | 캠페인 등록, 조회, 삭제 및 상태 관리 전담                         |
| **`features/dashboard/`** | `components/`, `hooks/`, `services/` | 지표 시각화(차트) 및 통계 데이터 관리 전담                        |
| **`features/filter/`**    | `components/`, `hooks/`, `store/`    | 전역 필터링 상태(Zustand) 및 데이터 필터링 비즈니스 로직 전담     |
| **`shared/`**             | `components/ui/`, `utils/`, `types/` | 도메인 독립적인 공통 UI 컴포넌트, 유틸리티 함수, 공통 타입 정의   |
| **`app/`**                | `layout.tsx`, `@charts/`, `@table/`  | Next.js Parallel Routes를 활용한 대시보드 레이아웃 구성 및 라우팅 |

## 컴포넌트 설계

- **관심사의 분리 (SoC)**: UI 컴포넌트는 오직 렌더링에만 집중하며, 복잡한 비즈니스 로직 및 상태 관리 로직은 커스텀 훅(`useCampaignTable`, `useFilteredData` 등)으로 추상화하여 관리합니다.
- **서버/클라이언트 컴포넌트 분리**: 데이터 페칭 및 정적인 구조는 서버 컴포넌트에서 처리하여 JS 번들 크기를 줄이고, 인터랙션이 필요한 필터 및 폼 영역만 클라이언트 컴포넌트로 구성했습니다.
- **복합 컴포넌트 패턴 (Compound Component)**: `Table` 컴포넌트 등을 `Table.Header`, `Table.Body`, `Table.Row` 등과 같이 설계하여 유연한 UI 구조와 코드 가독성을 확보했습니다.
- **병렬 라우팅 (Parallel Routes)**: 차트 영역(`@charts`)과 테이블 영역(`@table`)을 별도의 슬롯으로 분리하여 데이터 페칭 성능을 높이고 각각 독립적인 로딩 상태(`loading.tsx`)를 제공합니다.
