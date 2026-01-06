# Academic Showcase

이 프로젝트는 Vite + React + Tailwind CSS 기반의 개인 연구/포트폴리오 사이트입니다.
아래 안내는 **각 페이지의 콘텐츠, 색상, 여백 등을 수정하려면 어디를 편집해야 하는지**를
중심으로 정리했습니다.

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
- **Blog 목록/상세**: `src/pages/Blog.tsx`
- **404 페이지**: `src/pages/NotFound.tsx`

> 데이터 중심으로 업데이트하고 싶다면 **`src/data/siteData.ts`**만 수정해도
> 여러 페이지가 동시에 갱신됩니다.

## 네비게이션/페이지 구조

- 상단 네비게이션 항목은 `src/components/layout/TopNav.tsx`의 `navItems` 배열에서 수정합니다.
- 라우트 구성은 `src/App.tsx`에서 관리합니다.

## 프로필 사이드바(사진/소속/링크)

- 프로필 이미지 영역, 소속 정보, 이메일/소셜 링크는
  `src/components/layout/ProfileSidebar.tsx`에서 수정합니다.

## 색상/폰트/테마 수정

- 전체 색상 토큰(Primary/Secondary 등)과 다크 모드는
  `src/index.css`의 `:root` 및 `.dark` 변수에서 관리됩니다.
  - 예: `--primary`, `--background`, `--muted` 등
- 링크 색상, 연도 배지 색상 등도 같은 파일의 커스텀 토큰으로 제어됩니다.

## 여백/레이아웃 수정

- 전체 레이아웃과 기본 여백은 `src/components/layout/MainLayout.tsx`에서 조정합니다.
  - `py-12`, `gap-12`, `max-w-[800px]` 등의 Tailwind 클래스가 기본 간격을 결정합니다.
- 공통 유틸리티 클래스는 `src/index.css`의 `@layer utilities`에 있습니다.
  - `container-academic`, `content-section`, `section-title` 등

## 카드/컴포넌트 디자인

- 논문/프로젝트 카드 스타일은 `src/components/cards/` 아래에서 수정합니다.
- shadcn-ui 기반 컴포넌트는 `src/components/ui/`에 있습니다.

## 개발 실행

```sh
npm install
npm run dev
```

## 빌드

```sh
npm run build
```

## 배포 (GitHub Pages)

- GitHub Actions로 배포하도록 워크플로우가 설정되어 있습니다.
- GitHub 설정에서 **Settings → Pages → Source = GitHub Actions**로 선택해야 배포됩니다.
