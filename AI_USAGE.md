# AI 활용 내역 (AI_USAGE.md)

## 1. 사용한 AI 도구

| 도구                                         | 용도                                               |
| -------------------------------------------- | -------------------------------------------------- |
| **Antigravity (Claude Sonnet 4.6 Thinking)** | 코드 리팩토링, 컴포넌트 분리, utils 함수 설계 전반 |

IDE 내에 통합된 AI 코딩 어시스턴트를 활용하였으며, **설계 판단과 관심사 분리** 위주로 사용했습니다.
전체 구현(라우팅, 상태 관리, 서비스 레이어 등)은 직접 작성했고, AI는 완성된 코드의 리팩토링 및 개선에 집중적으로 활용했습니다.

---

## 2. AI 결과물을 직접 수정한 판단 사례

### 사례 1: 하이브리드 렌더링 최적화를 위한 "use client" 남용 제거

[문제 상황]
AI는 모든 page.tsx와 하위 컴포넌트에 "use client"를 기본으로 생성했습니다. 이는 Next.js의 핵심인 **서버 컴포넌트(RSC)**의 이점을 포기하고 전체 애플리케이션을 클라이언트 사이드 렌더링(CSR)으로 강제하는 비효율적인 구조였습니다.

[수정 및 판단]

서버/클라이언트 역할 분리: 데이터 페칭은 서버 컴포넌트에서 수행하여 JS 번들 크기를 줄이고, 필터링 및 상태 변경이 필요한 컴포넌트만 클라이언트 컴포넌트로 분리했습니다.

성능 및 SEO 확보: 초기 로딩 시 서버에서 완성된 HTML을 전달함으로써 FCP(First Contentful Paint)를 개선하고 검색 엔진 최적화를 도모했습니다.

### 사례2 : 클라이언트 라우터 캐시(Client Router Cache) 동기화 오류 해결

[문제 상황]
AI를 통해 Form 관련 로직을 리팩토링한 후, 서버 데이터는 정상 갱신되지만 UI 리스트가 즉각 업데이트되지 않는 현상을 발견했습니다. AI가 제안한 리팩토링 코드가 Server Action의 서버측 무효화(revalidateTag)에는 충실했지만, 브라우저의 클라이언트 라우터 캐시(Client Router Cache) 갱신까지는 고려하지 못했음을 파악했습니다.

[수정 및 판단]
useCampaignForm.ts의 제출 성공 핸들러에 useRouter().refresh()를 직접 추가하여, 서버의 변경사항이 클라이언트 UI에 즉각 반영되도록 강제했습니다.

### 사례 3: 기본에 충실한 UI/UX 개선

[문제 상황]
AI는 금액 입력 필드에 input type="number"를 적용하고, 버튼의 활성/비활성 상태에 따른 시각적 피드백(cursor)을 누락하는 등 실제 사용자가 체감하는 디테일한 UX 설계를 간과했습니다.

[수정 및 판단]

숫자 입력 경험 최적화: 가독성이 떨어지는 기본 숫자 필드 대신 type="text"와 inputMode="numeric" 조합을 선택했습니다. 상태값(State)은 순수 숫자 문자열로 유지하되, 뷰(View)에서는 천 단위 콤마가 포함된 포맷팅을 실시간 적용하여 오입력을 방지했습니다.

명확한 상태 피드백 제공: CampaignTable의 일괄 적용 버튼, 페이지네이션 등에 cursor-pointer 및 cursor-not-allowed 클래스를 정밀하게 적용했습니다. 이를 통해 사용자가 인터랙션 가능 여부를 즉각 인지할 수 있도록 보완했습니다.

---

## 3. 확장 가능한 아키텍처 설계 의사결정

### 3-1. Compound Component 패턴 — `Table` 컴포넌트

`Table`, `Table.Header`, `Table.Body`, `Table.Row`, `Table.Head`, `Table.Cell`을 Compound Component 패턴으로 구성했습니다. 단순히 props를 내려받는 단일 컴포넌트 대신, 네임스페이스 방식으로 하위 컴포넌트를 조합하게 함으로써 다음을 달성했습니다.

- **유연성**: 테이블 구조를 사용처에서 자유롭게 구성 가능. 빈 상태 행(colSpan)·헤더 정렬 등 다양한 케이스 대응
- **캡슐화**: `TableHeader` 등 5개의 내부 컴포넌트를 named export에서 제거해 외부 API를 `Table` 하나로 축소
- **일관성**: 모든 테이블 UI가 동일한 스타일 시스템과 dark mode 처리를 공유

`GlobalFilter` 역시 날짜·상태·매체·초기화 각 필터 항목을 독립적으로 구성할 수 있는 구조로 설계해, 추후 필터 항목 추가 시 기존 코드를 수정하지 않고 확장 가능하도록 했습니다.

### 3-2. Layered Architecture

관심사 분리를 위해 아래 4계층 구조를 일관되게 유지했습니다.

| 계층          | 파일                      | 역할                                                |
| ------------- | ------------------------- | --------------------------------------------------- |
| **Data**      | `services/actions.ts`     | API 통신 (json-server CRUD), `revalidateTag` 처리   |
| **Store**     | `store/useFilterStore.ts` | Zustand 기반 글로벌 필터 상태 (SSOT)                |
| **Hook**      | `hooks/use*.ts`           | 비즈니스 로직 (검색·정렬·페이지네이션·폼 유효성 등) |
| **Component** | `components/**/*.tsx`     | UI 렌더링만 담당, 로직은 hook에서 주입받음          |

이 구조 덕분에, 예를 들어 검색 로직을 변경할 때 컴포넌트를 건드리지 않고 `useCampaignTable.ts`만 수정하면 됩니다.

---

## 4. 상태 관리 및 실시간 동기화 설계 의사결정

### 4-1. Global Filter Sync — Zustand SSOT

필터 상태(`dateRange`, `status[]`, `platform[]`)를 `useFilterStore`(Zustand)에 단일 진실 공급원으로 관리했습니다.

- 글로벌 필터 변경 → `useFilteredData` hook이 `useFilterStore`를 구독 → 차트·테이블 모두 즉시 반응
- `PlatformDonutChart`의 도넛 클릭 → `useFilterStore`의 `platform` 필터를 직접 토글 → 상단 `GlobalFilter` UI와 모든 차트·테이블이 양방향 연동
- 필터 초기화 버튼은 `useFilterStore`의 `reset()` 액션 하나로 전체 상태 복구

Zustand를 선택한 이유는, Context API 대비 불필요한 리렌더링 없이 구독 단위를 selector로 세분화할 수 있고, 보일러플레이트 없이 전역 상태 접근이 가능하기 때문입니다.

### 4-2. 캠페인 등록 후 즉시 반영 — `revalidateTag`

캠페인 등록 모달에서 새 캠페인을 저장하면, `router.refresh()`를 통해 Next.js의 서버 캐시를 무효화하고 목록을 즉시 갱신합니다. 별도 새로고침 없이 테이블과 대시보드 차트 모두 신규 캠페인을 반영합니다.

- 서버 액션(`createCampaignAction`)에서 응답 성공 시 `revalidateTag('campaigns')` 호출
- 클라이언트에서 `router.refresh()`로 재렌더링 트리거
- 신규 캠페인은 `daily_stats`가 없으므로 지표(CTR, CPC, ROAS)는 0 또는 `-`으로 표시

### 4-3. 차트 렌더링 성능 — Parallel Routes

대시보드의 차트 영역(`@charts`)과 테이블 영역(`@table`)을 Next.js **Parallel Routes**로 분리했습니다.

```
app/
├── @charts/
│   ├── page.tsx      ← 차트 서버 컴포넌트 (독립 렌더링)
│   └── loading.tsx   ← 차트 전용 로딩 UI
├── @table/
│   ├── page.tsx      ← 테이블 서버 컴포넌트 (독립 렌더링)
│   └── loading.tsx   ← 테이블 전용 로딩 UI
└── layout.tsx        ← 두 슬롯을 병렬로 수신
```

Parallel Routes를 적용한 이유:

- 차트와 테이블의 데이터 fetching이 **병렬**로 실행되어 전체 로딩 시간 단축
- 한 쪽의 로딩이 다른 쪽을 블로킹하지 않으므로, 테이블이 느릴 때도 차트를 먼저 표시 가능
- 각 슬롯이 독립적인 `loading.tsx`와 `error.tsx`를 가져 세밀한 UX 제어 가능
