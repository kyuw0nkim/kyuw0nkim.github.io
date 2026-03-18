# Kyuwon Kim

## 페이지별 콘텐츠 수정 위치

- **홈(Home)**: `src/pages/Index.tsx`
  - 소개 문구, 섹션 구성(About/News/Latest Publication)
  - 뉴스/최신 논문 데이터는 `src/data/siteData.ts`
- **News 페이지**: `src/pages/News.tsx`
  - 목록 데이터는 `src/data/siteData.ts`의 `news`
- **Publications 페이지**: `src/pages/Publications.tsx`
  - 논문 데이터는 `src/data/siteData.ts`의 `publications`
- **Projects 목록**: `src/pages/Projects.tsx`
  - 프로젝트 데이터는 `src/data/siteData.ts`의 `projects`
- **Project 상세**: `src/pages/ProjectDetail.tsx`
  - 상세 텍스트는 `src/data/siteData.ts`의 `projects[].description`
- **CV 페이지**: `src/pages/CV.tsx`
  - CV 데이터는 `src/data/siteData.ts`의 `cv`
- **Blog 목록**: `src/pages/Blog.tsx` (`BlogList` 컴포넌트)
  - 블로그 포스트 데이터는 `src/data/blogPosts.ts`
- **Blog 상세**: `src/pages/Blog.tsx` (`BlogPost` 컴포넌트)
- **Analytics 페이지**: `src/pages/Analytics.tsx`
- **Design 갤러리**: `src/pages/Design.tsx`
  - 작업물 데이터는 `src/data/designData.ts`의 `designWorks` 배열
  - 이미지는 `public/design/` 폴더에 저장 후 `thumbnail: "/design/파일명.png"` 형식으로 입력
- **404 페이지**: `src/pages/NotFound.tsx`

> 데이터 중심으로 업데이트하고 싶다면 **`src/data/siteData.ts`**만 수정해도
> 여러 페이지가 동시에 갱신됩니다.

## 데이터 파일 구조

- `src/data/siteData.ts` — 프로필, 뉴스, 논문, 프로젝트, CV 데이터
- `src/data/blogPosts.ts` — 블로그 포스트 데이터
- `src/data/searchIndex.ts` — 검색 인덱스 (siteData + blogPosts 기반 자동 생성)
- `src/data/types.ts` — 공통 타입 정의 (`Profile`, `Publication`, `Project`, `NewsItem` 등)

## 네비게이션/페이지 구조

- 상단 네비게이션 항목은 `src/components/layout/TopNav.tsx`의 `navItems` 배열에서 수정합니다.
- 라우트 구성은 `src/App.tsx`에서 관리합니다.
  - Home / Publications / Projects / Projects/:id / News / CV / Blog / Blog/:id / Analytics / Design

## 프로필 사이드바(사진/소속/링크)

- 프로필 이미지 영역, 소속 정보, 이메일/소셜 링크는
  `src/components/layout/ProfileSidebar.tsx`에서 수정합니다.

## 컴포넌트 구조

- `src/components/layout/` — 전체 레이아웃, 네비게이션, 사이드바
  - `MainLayout.tsx` — 전체 레이아웃 및 기본 여백 (`py-12`, `gap-12`, `max-w-[800px]` 등)
  - `TopNav.tsx` — 상단 네비게이션
  - `ProfileSidebar.tsx` — 프로필 사이드바
- `src/components/cards/PublicationCard.tsx` — 논문 카드
- `src/components/ui/` — shadcn-ui 기반 공통 컴포넌트
- `src/components/NavLink.tsx` — 네비게이션 링크 컴포넌트

## 썸네일 이미지

- 논문/프로젝트 썸네일은 `public/thumbnails/`에 저장합니다.
- 파일명은 `pic.{타입}.{제목}.png` 형식으로 관리합니다.
  - 예: `pic.J.A Systematic.png`, `pic.C.FLIP.png`

## 색상/폰트/테마 수정

- 전체 색상 토큰(Primary/Secondary 등)과 다크 모드는
  `src/index.css`의 `:root` 및 `.dark` 변수에서 관리됩니다.
  - 예: `--primary`, `--background`, `--muted` 등
- 링크 색상, 연도 배지 색상 등도 같은 파일의 커스텀 토큰으로 제어됩니다.
- 공통 유틸리티 클래스는 `src/index.css`의 `@layer utilities`에 있습니다.
  - `container-academic`, `content-section`, `section-title` 등

### Main Color vs Sub Color

사이트의 색상은 **Main Color**(`--primary`)와 **Sub Color**(`--sub-color`) 두 가지로 구분됩니다.

| 변수 | 적용 범위 |
|------|----------|
| `--primary` | 네비게이션 활성 링크, 논문 카드의 primary 버튼(ACM DL·PDF), 스크롤 인디케이터, award 배지 테두리 등 UI 전반 |
| `--sub-color` | 프로필 소셜 아이콘, 연도 배지, CV 다운로드 버튼, Analytics 통계 숫자, 하이퍼링크 색상 |
| `--foreground` | **기본 본문 색상(Default Color)**. 특별한 강조 없이 일반 텍스트에 사용하는 색. 라이트 모드 기준 진한 회색(`hsl(220 20% 15%)`). Tailwind 클래스: `text-foreground` |

#### Sub Color 변경 방법

`src/index.css`에서 `--sub-color` 값만 바꾸면 위 요소들이 모두 한 번에 변경됩니다.

```css
/* src/index.css — :root (라이트 모드) */
--sub-color: 199 89% 48%;        /* HSL 값으로 입력 */
--sub-color-foreground: 0 0% 100%; /* 버튼 위 텍스트 색상 */

/* src/index.css — .dark (다크 모드) */
--sub-color: 199 89% 55%;
--sub-color-foreground: 220 20% 10%;
```

#### Main Color로 특정 요소만 바꾸고 싶을 때

특정 요소 하나만 main color(`--primary`)로 되돌리고 싶다면, 해당 Tailwind 클래스를 `text-sub` → `text-primary`, `bg-sub` → `bg-primary` 등으로 직접 수정합니다.

| 파일 | 요소 | 현재 클래스 → Main Color로 변경 |
|------|------|-------------------------------|
| `src/pages/Analytics.tsx` | 통계 숫자 | `text-sub` → `text-primary` |
| `src/pages/CV.tsx` | 다운로드 버튼 | `bg-sub text-sub-foreground` → `bg-primary text-primary-foreground` |
| `src/index.css` | 소셜 아이콘 | `.social-icon`의 `text-sub` → `text-primary` |
| `src/index.css` | 연도 배지 | `--year-color: var(--sub-color)` → `--year-color: var(--primary)` |
| `src/index.css` | 하이퍼링크 | `--link-color: var(--sub-color)` → `--link-color: var(--primary)` |

## 여백/레이아웃 수정

- 전체 레이아웃과 기본 여백은 `src/components/layout/MainLayout.tsx`에서 조정합니다.
  - `py-12`, `gap-12`, `max-w-[800px]` 등의 Tailwind 클래스가 기본 간격을 결정합니다.

## 개발 실행

```sh
npm install
npm run dev
```

또는 bun 사용 시:

```sh
bun install
bun run dev
```

## 빌드

```sh
npm run build
```

## 배포 (GitHub Pages)

- GitHub Actions로 배포하도록 `.github/workflows/deploy.yml` 워크플로우가 설정되어 있습니다.
- GitHub 설정에서 **Settings → Pages → Source = GitHub Actions**로 선택해야 배포됩니다.
- `HashRouter` 기반 라우팅을 사용하므로 별도의 서버 설정 없이 정적 호스팅에서 동작합니다.
