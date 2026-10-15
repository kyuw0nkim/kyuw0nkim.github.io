# Kyuwon Kim — Portfolio (`/portfolio/`)

학술 사이트(`/`)와 분리된 시각 중심 포트폴리오입니다. 같은 저장소·같은 빌드로 배포되지만
학술 사이트 내비게이션에는 연결되어 있지 않습니다. 주소: `https://kyuwonkim.com/portfolio/`
(= `kyuw0nkim.github.io/portfolio/`).

- 진입 HTML: `portfolio/index.html` → 빌드 시 `dist/portfolio/index.html`
- 소스: `src/portfolio/`
- three.js 3D 씬은 별도 청크로 지연 로드되어 학술 사이트 번들에는 포함되지 않습니다.

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
| `/portfolio/#/` | Intro — 3D 씬 + Tracing/Shaping 헤드라인 |
| `#/tracing`, `#/shaping` | Explore — 해당 관점의 프로젝트 목록 |
| `#/works` | 전체 프로젝트 |
| `#/works/<id>` | 프로젝트 상세(케이스 스터디) |
| `#/about`, `#/contact` | 소개 / 연락처 |

쿼리 옵션: `?no3d` → 2D 대체 씬 강제, `?3d` → 소프트웨어 렌더러에서도 3D 강제(테스트용).
예: `/portfolio/?no3d#/`

---

## 콘텐츠 수정

대부분은 **`src/portfolio/data/projects.ts`** 하나만 고치면 됩니다.

| 필드 | 설명 |
|------|------|
| `id` | URL 슬러그 (`#/works/<id>`) |
| `title`, `subtitle`, `summary` | 목록·미리보기·상세에 쓰이는 문구 |
| `year` | 모르면 `null` → "TBD"로 표시 |
| `category` | 목록에 보이는 짧은 분류 |
| `modes` | `["tracing"]`, `["shaping"]`, 또는 둘 다 |
| `role`, `organization`, `collaborators` | 비워두면 "To be added"로 표시 |
| `hero`, `thumbnail` | 대표 이미지 (`Media`) |
| `sections` | Context / Process / Outcome 등 자유 구성 (`body`, `points`, `media`, `placeholder`) |
| `outcomes` | **검증된** 성과만 (게재, 수상 등) |
| `publications` | `src/data/publications.generated.ts`의 논문 id → 제목·학회·링크·수상이 자동 표시 |
| `links` | 데모, GitHub, 프리프린트 등 |
| `draft` | 내용이 아직 대부분 비어 있는 프로젝트 표시 |

- **순서**: 배열 순서가 곧 목록 순서와 번호(01, 02…)입니다.
- **추가/삭제**: 배열에 객체를 추가·삭제하면 목록, 개수, 이전/다음 링크가 모두 자동 반영됩니다.
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
| Tracing / Shaping 정의와 활동 목록 | `src/portfolio/data/modes.ts` |
| 색·폰트·여백 토큰 | `src/portfolio/styles/tokens.css` |
| 헤드라인 전환 간격 | `src/portfolio/components/KineticHeadline.tsx`의 `INTERVAL` |

---

## 히어로 씬 (2.5D 레이어) — 현재 기본값

투명 PNG 26장(`public/hero-assets/`)을 원본 히어로 이미지의 좌표계(1448 × 1086)에 겹쳐 그립니다.

| 파일 | 역할 |
|------|------|
| `public/hero-assets/manifest.json` | 에셋 목록·그룹·클릭 대상(원본 패키지 그대로) |
| `src/portfolio/hero2d/scene-layout.json` | **레이어 위치 보정값** (x, y, scale, rotation, z, opacity, visible) + `framing.hero`(항상 보여야 하는 영역) |
| `src/portfolio/hero2d/HeroScene.tsx`, `SceneLayer.tsx` | 레이어 렌더링, 무대 크기에 맞춘 그룹 스케일 |
| `src/portfolio/hero2d/hitTest.ts` | PNG 알파 기반 선택(투명 영역은 클릭되지 않음) |
| `src/portfolio/hero2d/editor/` | 개발 전용 위치 편집기 |

- 좌표는 각 레이어의 **중심점** 기준이며, scale·rotation도 중심을 기준으로 적용됩니다.
- 위치값은 컴포넌트에 하드코딩하지 않고 `scene-layout.json`에만 둡니다.
- `npm run check:hero`: manifest ↔ 실제 파일(픽셀 크기) ↔ layout이 일치하는지 검사합니다.
- 렌더러 전환: 기본은 2.5D, `/portfolio/?scene=3d`로 기존 3D 씬을 볼 수 있습니다(이전 완료 후 제거 예정).

### 위치 편집기 (개발 전용)

```sh
npm run dev
# http://localhost:8080/portfolio/?editor
```

- 레이어 선택(캔버스 클릭 / Alt+클릭으로 겹친 레이어 순환 / 목록), 드래그 이동, x·y·scale·rotation·z·opacity 입력
- 레이어 표시/숨김, 잠금(배경 3장은 기본 잠금 — 클릭이 벽에 걸리지 않도록), Solo, 그룹 단위 이동
- 원본 이미지 오버레이(투명도, Normal/Difference) — `src/portfolio/hero2d/reference/`에 원본을 넣으면 자동 로드(git 제외), 또는 "Load reference image…"
- 데스크톱/모바일 무대에서 실제로 잘리는 영역(Stage crops) 미리보기
- **Save to project**: `scene-layout.json`에 바로 저장(개발 서버에서만 동작) · Download/Copy/Load JSON · 실행 취소/다시 실행 · 브라우저에 임시 저장(새로고침해도 유지)
- 단축키: 화살표 1px(Shift 10px), +/− 크기, Alt+휠 크기, Shift+휠 회전, [ ] z순서, H 숨김, 휠 확대, Space+드래그 이동, ⌘/Ctrl+S 저장

편집기 코드는 프로덕션 빌드에 포함되지 않습니다.

---

## 3D 씬 (이전 구현 — `?scene=3d`)

`src/portfolio/scene/`

| 파일 | 역할 |
|------|------|
| `SceneStage.tsx` | WebGL 확인, 지연 로드, 2D 대체, 창문·식물 배경 레이어 |
| `Scene3D.tsx` | Canvas, 조명, 카메라 샷(`SHOTS`), 성능 모니터 |
| `Characters.tsx` / `cast.ts` | 캐릭터 4종(형태·애니메이션) / 위치 |
| `Furniture.tsx` | 테이블, 노트북, 의자 |
| `Effects.tsx` | Tracing 대화선, Shaping 블록·링, 호버 라벨 |
| `Backdrop.tsx` / `SceneFallback.tsx` | 2D 배경 / WebGL 미지원용 2D 씬 |

- 캐릭터는 기본 도형(구, 회전체, 돌출 별)으로 만든 **절차적 모델**입니다. 참고 이미지는 평면 이미지라
  3D 에셋이 없기 때문입니다.
- **GLB 모델로 교체**: `public/portfolio/models/clover.glb`를 넣고 `Characters.tsx`에서 해당
  몸체 컴포넌트를 바꾸면 됩니다. `CharacterRig`(호흡·호버·클릭 이벤트)는 그대로 유지됩니다.

  ```tsx
  import { useGLTF } from "@react-three/drei";
  function Clover() {
    const { scene } = useGLTF("/portfolio/models/clover.glb");
    return <primitive object={scene} />;
  }
  ```

- 캐릭터 클릭 → Tracing, 테이블·노트북 클릭 → Shaping. 같은 선택은 오른쪽 패널의 버튼/탭으로도
  가능해서(키보드·터치·스크린리더), 3D 없이도 모든 기능을 쓸 수 있습니다.

### 성능과 대체 동작

- 하드웨어 가속 없는 소프트웨어 WebGL(SwiftShader 등)에서는 자동으로 2D 씬을 보여줍니다.
- 실행 중 프레임이 떨어지면 해상도·그림자를 낮추고, 그래도 매우 느리면 2D로 전환합니다.
- 화면 밖으로 스크롤되면 렌더링을 멈춥니다.
- `prefers-reduced-motion`: 헤드라인 자동 전환·캐릭터 움직임·카메라 이동이 꺼지고, 화살표 버튼으로만
  단어를 바꿉니다. 헤드라인 왼쪽 화살표 버튼은 자동 전환을 멈추는 역할도 합니다.
