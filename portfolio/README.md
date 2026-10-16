# Kyuwon Kim — Portfolio (`/portfolio/`)

학술 사이트(`/`)와 분리된 시각 중심 포트폴리오입니다. 같은 저장소·같은 빌드로 배포되지만
학술 사이트 내비게이션에는 연결되어 있지 않습니다. 주소: `https://kyuwonkim.com/portfolio/`
(= `kyuw0nkim.github.io/portfolio/`).

- 진입 HTML: `portfolio/index.html` → 빌드 시 `dist/portfolio/index.html`
- 소스: `src/portfolio/`
- 히어로는 투명 이미지 레이어를 겹친 2.5D 장면입니다(WebGL·3D 라이브러리 없음).

---

## 개발 / 빌드

```sh
npm install
npm run dev        # http://localhost:8080/portfolio/
npm run build      # dist/ 와 dist/portfolio/ 를 함께 생성
npm run preview    # 빌드 결과 확인: http://localhost:4173/portfolio/
```

배포는 기존 GitHub Actions(`.github/workflows/deploy.yml`)가 `main` push 시 그대로 처리합니다.

### 주소 구조 (HashRouter)

| 주소 | 화면 |
|------|------|
| `/portfolio/#/` | Intro — 히어로 장면 + Tracing/Shaping 헤드라인 |
| `#/tracing`, `#/shaping` | Explore — 해당 관점의 프로젝트 카드(좌우로 넘기는 레일) |
| `#/works` | 전체 프로젝트 카드(2열 그리드) |
| `#/works/<id>` | 프로젝트 상세(케이스 스터디) |
| `#/about`, `#/contact` | 소개 / 연락처 |

---

## 콘텐츠 수정

대부분은 **`src/portfolio/data/projects.ts`** 하나만 고치면 됩니다.

| 필드 | 설명 |
|------|------|
| `id` | URL 슬러그 (`#/works/<id>`) |
| `title`, `subtitle`, `summary` | 카드·상세에 쓰이는 문구 |
| `year` | 모르면 `null` → "TBD"로 표시 |
| `category` | 카드에 보이는 짧은 분류 |
| `modes` | `["tracing"]`, `["shaping"]`, 또는 둘 다 |
| `role`, `organization`, `collaborators` | 비워두면 "To be added"로 표시 |
| `hero`, `thumbnail` | 대표 이미지 (`Media`). 카드에는 `thumbnail`(없으면 `hero`)이 쓰이고, 둘 다 없으면 테마 색 위에 이모지와 "Image to come" 표시 |
| `sections` | Context / Process / Outcome 등 자유 구성 (`body`, `points`, `media`, `placeholder`) |
| `outcomes` | **검증된** 성과만 (게재, 수상 등) |
| `publications` | `src/data/publications.generated.ts`의 논문 id → 제목·학회·링크·수상이 자동 표시 |
| `links` | 데모, GitHub, 프리프린트 등 |
| `draft` | 내용이 아직 대부분 비어 있는 프로젝트 표시 |

- **순서**: 배열 순서가 곧 카드 순서와 번호(01, 02…)입니다.
- **추가/삭제**: 배열에 객체를 추가·삭제하면 카드, 개수, 이전/다음 링크가 모두 자동 반영됩니다.
- **플레이스홀더**: 아직 없는 이미지는 `pending("설명")`, 아직 쓰지 않은 글은 섹션의
  `placeholder: "..."`로 둡니다. 화면에 "Placeholder / To be added"로 명확히 표시됩니다.
  확인되지 않은 결과나 수치는 넣지 마세요.

### 이미지 넣기

1. `public/portfolio/projects/<id>/` 에 파일을 넣습니다 (예: `screen-01.png`).
2. `projects.ts`에서 참조합니다.

```ts
hero: {
  kind: "image",
  src: "/portfolio/projects/raim-volunteer-scheduling/dashboard.png",
  alt: "주간 자원봉사 일정을 보여주는 대시보드 화면",
  caption: "Weekly schedule view.",
  aspect: "16 / 10",
  frame: "bleed",   // 스크린샷·사진: "bleed", 작은 연구 그림: "figure"
},
```

- 동영상: `kind: "video"` (+ `poster`), 외부 데모: `kind: "embed"` (iframe URL)
- 학술 사이트의 논문 썸네일(`public/thumbnails/`)은 `thumb("파일명.png")`로 재사용합니다.
  현재 연구 그림은 600×400 썸네일이라 크게 보면 흐릿합니다 → 고해상도 원본으로 교체를 권장합니다.

### 그 밖의 문구 / 디자인

| 바꿀 것 | 파일 |
|---------|------|
| 인트로·About·Contact 문구 | `src/portfolio/data/site.ts` (이메일·소셜·스킬은 학술 사이트 `siteData.ts`에서 자동으로 가져옴) |
| Tracing / Shaping 정의, 활동 목록, 이모지(💭 / 🛠️) | `src/portfolio/data/modes.ts` |
| 색·폰트·여백 토큰 | `src/portfolio/styles/tokens.css` |
| 헤드라인 전환 간격 | `src/portfolio/components/KineticHeadline.tsx`의 `INTERVAL` |

---

## 히어로 씬 (2.5D 레이어)

투명 스프라이트 26장을 원본 히어로 이미지의 좌표계(1448 × 1086)에 겹쳐 그립니다.

| 파일 | 역할 |
|------|------|
| `portfolio/hero-source/` | **원본 PNG 패키지**(21MB) + `manifest.json`(에셋 목록·그룹·클릭 대상). 배포되지 않습니다 |
| `public/hero-assets/` | 사이트가 실제로 불러오는 **WebP**(약 1.3MB). `npm run optimize:hero`로 생성 |
| `scripts/optimize-hero-assets.py` | 원본 → WebP 변환(Pillow 필요: `pip install pillow`) |
| `src/portfolio/hero2d/scene-layout.json` | **레이어 위치 보정값** (x, y, scale, rotation, z, opacity, visible) + `framing.hero`(항상 보여야 하는 영역) |
| `src/portfolio/hero2d/HeroScene.tsx`, `SceneLayer.tsx` | 레이어 렌더링, 무대 크기에 맞춘 그룹 스케일 |
| `src/portfolio/hero2d/hitTest.ts` | 알파 기반 선택(투명 영역은 클릭되지 않음) |
| `src/portfolio/hero2d/editor/` | 개발 전용 위치 편집기 |

- 좌표는 각 레이어의 **중심점** 기준이며, scale·rotation도 중심을 기준으로 적용됩니다.
- 위치값은 컴포넌트에 하드코딩하지 않고 `scene-layout.json`에만 둡니다.
- `npm run check:hero`: manifest ↔ 원본 PNG(픽셀 크기) ↔ layout ↔ WebP가 일치하는지 검사합니다.

### 에셋 교체 / 용량

- 각 스프라이트는 화면에 그려지는 크기(`width × scale`)의 **2.5배 해상도**까지만 남기고 줄입니다.
  레티나(2×) 화면에서 Tracing/Shaping으로 가장 크게 확대해도 선명한 수준입니다.
  흐린 레이어(바닥 그림자, 앞쪽 식물)는 1.25배로 충분합니다.
- 원본을 바꾸거나 편집기에서 레이어를 크게 키웠다면 `npm run optimize:hero`를 다시 실행하세요.
  `npm run check:hero`가 해상도가 부족해진 레이어를 경고합니다.
- 좌표·크기(`width`, `height`)는 항상 원본 PNG 기준입니다. WebP가 더 작아도 화면 배치는 그대로입니다.

### 인터랙션

| 상태 | 계기 | 카메라 | 글로우 |
|------|------|--------|--------|
| Hero | 기본 / `#/` / Esc | `framing.hero`가 항상 보이도록 무대에 맞춤 | — |
| Tracing | 캐릭터 4종 클릭 → `#/tracing` | `framing.tracing`으로 확대·이동 | 캐릭터(몸통+앞발) |
| Shaping | 테이블·노트북 클릭 → `#/shaping` | `framing.shaping`으로 확대·이동 | 테이블·노트북 |

- **카메라**: `translate + scale`만 사용하는 2D 가상 카메라입니다(`src/portfolio/hero2d/useCamera.ts`). 어떤 화면 크기에서도 장면 밖(빈 영역)이 보이지 않도록 이동·확대 범위를 제한합니다. 목표 사각형은 `scene-layout.json`의 `framing`에 있고 편집기 "Camera"에서 바꿀 수 있습니다.
  - 샷이 바뀔 때만 움직입니다(창 크기 변경은 즉시 맞춤). 화면에서 고정되는 한 점을 중심으로 줌하고, 배율은 로그 스케일로 고르게 변해서 그림이 미끄러지는 대신 카메라가 다가가는 것처럼 보입니다.
  - 길이·이징: `sceneMotion.ts`의 `CAMERA.durationMs`(1.4초), `CAMERA.ease`(부드럽게 출발해 길게 멈춤).
  - 움직이는 동안에만 깊이감: 가까운 그룹(식물·스툴·캐릭터)이 먼 그룹보다 조금 더 커지고 더 이동합니다(`CAMERA.depthScale`, `depthLead`). 멈추면 0이 되어 보정된 배치가 그대로 유지됩니다. 마우스가 있는 기기에서만 켜지고, 터치 기기에서는 카메라 이동만 합니다.
- **패럴랙스**: 그룹별 깊이(`src/portfolio/hero2d/sceneMotion.ts`의 `PARALLAX_DEPTH`, 단위 px). 같은 그룹(의자+캐릭터, 테이블+노트북)은 같은 깊이라 서로 어긋나지 않습니다. 마우스/펜에서만 동작하고, 터치·동작 줄이기 설정에서는 꺼집니다. 프레임이 계속 느리면(소프트웨어 합성 등) 자동으로 패럴랙스와 카메라 애니메이션을 끕니다.
- **클릭 판정**: PNG 알파 기반입니다. 투명한 부분은 클릭되지 않고, 앞쪽 식물은 통과하며, 앞에 있는 의자·스툴은 뒤의 캐릭터를 가립니다.
- **호버**: 캐릭터를 벗어나도 잠깐(`HOVER_GRACE_MS`) 유지되어 캐릭터 사이 틈을 지날 때 글로우가 깜빡이지 않고, 카메라가 멈추면 가만히 있는 포인터 아래를 다시 확인합니다. 캐릭터 하나에 올리면 헤드라인이 Tracing으로 바뀌고 **캐릭터 4종이 함께** 빛납니다. 테이블이나 노트북에 올리면 Shaping으로 바뀌고 테이블·노트북이 함께 빛납니다. 글로우 색은 테마 색입니다 — Tracing은 창가의 노란빛, Shaping은 바다의 파란빛(`tokens.css`의 `--pf-tracing`, `--pf-shaping`; 카드의 강조색과 이미지 없는 카드 배경에도 쓰임). 오른쪽 Tracing/Shaping 버튼에 올려도 같습니다. 테이블 앞 테두리(`table_front_rim`)는 빛이 상판 위로 번지지 않도록 아래쪽으로만 빛납니다(`sceneMotion.ts`의 `GLOW_BELOW_LAYERS`).
- 레이어는 `flipX`/`flipY`로 좌우·상하 반전할 수 있습니다(편집기 Flip H / Flip V).

### 위치 편집기 (개발 전용)

```sh
npm run dev
# http://localhost:8080/portfolio/?editor
```

- 레이어 선택(캔버스 클릭 / Alt+클릭으로 겹친 레이어 순환 / 목록), 드래그 이동, x·y·scale·rotation·z·opacity 입력
- 레이어 표시/숨김, 잠금(배경 3장은 기본 잠금 — 클릭이 벽에 걸리지 않도록), Solo, 그룹 단위 이동
- 원본 이미지 오버레이(투명도, Normal/Difference) — `src/portfolio/hero2d/reference/`에 원본을 넣으면 자동 로드(git 제외), 또는 "Load reference image…"
- 데스크톱/모바일 무대에서 실제로 잘리는 영역(Stage crops) 미리보기 — Hero/Tracing/Shaping 샷별
- Camera: Tracing/Shaping 카메라 목표 사각형 편집, Flip H/V
- **Save to project**: `scene-layout.json`에 바로 저장(개발 서버에서만 동작) · Download/Copy/Load JSON · 실행 취소/다시 실행 · 브라우저에 임시 저장(새로고침해도 유지)
- 단축키: 화살표 1px(Shift 10px), +/− 크기, Alt+휠 크기, Shift+휠 회전, [ ] z순서, H 숨김, 휠 확대, Space+드래그 이동, ⌘/Ctrl+S 저장

편집기 코드는 프로덕션 빌드에 포함되지 않습니다.

---

## 성능과 접근성

- 캐릭터 클릭 → Tracing, 테이블·노트북 클릭 → Shaping. 같은 선택은 오른쪽 패널의 버튼/탭으로도
  가능해서(키보드·터치·스크린리더) 장면 없이도 모든 기능을 쓸 수 있습니다.
- 프레임이 계속 느린 기기에서는 패럴랙스와 카메라 애니메이션을 자동으로 끕니다.
- `prefers-reduced-motion`: 헤드라인 자동 전환·패럴랙스·카메라 이동이 꺼집니다.
- 헤드라인 자동 전환은 마우스를 헤드라인에 올리면 멈추고, 키보드 사용자는 Tab으로 나타나는
  "Pause word animation" 버튼으로 멈출 수 있습니다(WCAG 2.2.2).
