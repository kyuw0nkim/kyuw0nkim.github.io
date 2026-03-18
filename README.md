# Kyuwon Kim — Personal Academic Site

대부분의 업데이트는 **`src/data/siteData.ts`** 하나만 수정하면 됩니다.
컴포넌트나 스타일 변경이 필요한 경우에만 아래 가이드를 참고하세요.

---

## 콘텐츠 업데이트

### siteData.ts 구조

`src/data/siteData.ts` 안의 항목별 수정 위치:

| 항목 | 필드 | 반영 페이지 |
|------|------|------------|
| 프로필 이름/소속/소개글/소셜 링크 | `profile` | Home, 사이드바 |
| 뉴스 | `news` | Home, News |
| 논문 | `publications` | Home(최신 1편), Publications |
| 프로젝트 | `projects` | Projects, Projects/:id |
| CV (학력/경력/수상/스킬) | `cv` | CV |

### 텍스트 링크 작성법 (TextPart)

소개글(`bioParagraphs`)과 뉴스(`news[].title`)에서 텍스트 안에 링크를 삽입할 때:

```ts
// 일반 텍스트
"안녕하세요, "

// 링크
{ text: "IDL Lab", href: "https://idlearning.org" }

// 링크 + 호버 툴팁
{ text: "IDL Lab", href: "https://idlearning.org", tooltip: "Visit our lab! 🏫" }
```

`tooltip`을 생략하면 해당 링크에는 툴팁이 표시되지 않습니다.

### 썸네일 이미지

논문/프로젝트 썸네일은 `public/thumbnails/`에 저장한 뒤 `siteData.ts`에서 파일명을 입력합니다.

```ts
{ id: "p2025-c1", thumbnail: "pic.C.FLIP.png", ... }
```

파일명 규칙: `pic.{타입}.{제목}.png` (예: `pic.J.A Systematic.png`, `pic.C.FLIP.png`)

### 블로그/디자인

- 블로그 포스트: `src/data/blogPosts.ts`
- 디자인 갤러리: `src/data/designData.ts`의 `designWorks` 배열
  - 이미지는 `public/design/`에 저장 후 `thumbnail: "/design/파일명.png"`으로 입력

---

## 페이지 구조

| 페이지 | 파일 | 데이터 |
|--------|------|--------|
| Home | `src/pages/Index.tsx` | `siteData.ts` |
| News | `src/pages/News.tsx` | `siteData.ts` → `news` |
| Publications | `src/pages/Publications.tsx` | `siteData.ts` → `publications` |
| Projects | `src/pages/Projects.tsx` | `siteData.ts` → `projects` |
| Project 상세 | `src/pages/ProjectDetail.tsx` | `projects[].description` |
| CV | `src/pages/CV.tsx` | `siteData.ts` → `cv` |
| Blog | `src/pages/Blog.tsx` | `src/data/blogPosts.ts` |
| Design | `src/pages/Design.tsx` | `src/data/designData.ts` |
| Analytics | `src/pages/Analytics.tsx` | — |

- 네비게이션 항목 순서/이름: `src/components/layout/TopNav.tsx`의 `navItems`
- 라우트 추가/삭제: `src/App.tsx`

---

## UI 커스터마이징

### 색상

색상 토큰은 `src/index.css`의 `:root`(라이트)와 `.dark`(다크)에서 관리합니다.

사이트의 핵심 색상은 두 가지입니다:

| 변수 | 역할 | 적용 범위 |
|------|------|----------|
| `--primary` | Main Color | 네비 활성 링크, 버튼, 스크롤 인디케이터, award 배지 |
| `--sub-color` | Sub Color | 소셜 아이콘, 연도 배지, CV 버튼, Analytics 숫자, 하이퍼링크, 호버 툴팁 |

**Sub Color 전체 변경:** `src/index.css`에서 `--sub-color` 값만 수정하면 됩니다.

```css
/* :root (라이트 모드) */
--sub-color: 44 100% 55%;           /* HSL 값 */
--sub-color-foreground: 220 20% 15%;

/* .dark (다크 모드) */
--sub-color: 44 100% 55%;
--sub-color-foreground: 220 20% 15%;
```

**특정 요소만 Main Color로 되돌리기:**

| 파일 | 요소 | 수정 방법 |
|------|------|---------|
| `src/pages/Analytics.tsx` | 통계 숫자 | `text-sub` → `text-primary` |
| `src/pages/CV.tsx` | 다운로드 버튼 | `bg-sub text-sub-foreground` → `bg-primary text-primary-foreground` |
| `src/index.css` | 소셜 아이콘 | `.social-icon`의 `text-sub` → `text-primary` |
| `src/index.css` | 연도 배지 | `--year-color: var(--sub-color)` → `--year-color: var(--primary)` |
| `src/index.css` | 하이퍼링크 | `--link-color: var(--sub-color)` → `--link-color: var(--primary)` |

### 레이아웃 / 여백

전체 레이아웃과 기본 여백은 `src/components/layout/MainLayout.tsx`에서 조정합니다.
`py-12`, `gap-12`, `max-w-[800px]` 등의 Tailwind 클래스가 간격을 결정합니다.

### 프로필 사이드바

프로필 이미지, 소속 텍스트, 소셜 아이콘 레이아웃은 `src/components/layout/ProfileSidebar.tsx`에서 수정합니다.
내용(이름/소속/링크)은 `siteData.ts`의 `profile`에서 관리합니다.

### 호버 툴팁

요소에 마우스를 올리면 나타나는 Sub Color(앰버) 말풍선 컴포넌트입니다.

```tsx
import { HoverTooltip } from "@/components/ui/HoverTooltip";

// 기본
<HoverTooltip content="툴팁 메시지">
  <a href="...">링크</a>
</HoverTooltip>

// 위치 변경 (기본값: "top")
<HoverTooltip content="메시지" side="bottom">
  <button>버튼</button>
</HoverTooltip>

// 생략 — content 없이 쓰면 툴팁 없이 children만 렌더링
<HoverTooltip>
  <a href="...">링크</a>
</HoverTooltip>
```

바이오/뉴스 링크의 툴팁은 `siteData.ts`에서 `tooltip` 필드로 바로 설정합니다 (위 TextPart 섹션 참고).

---

## 개발 / 빌드 / 배포

```sh
# 개발 서버
npm install && npm run dev

# 빌드
npm run build
```

bun 사용 시: `bun install && bun run dev`

**배포 (GitHub Pages)**
- `.github/workflows/deploy.yml`로 GitHub Actions 자동 배포
- GitHub 설정: **Settings → Pages → Source = GitHub Actions**
- `HashRouter` 기반이므로 별도 서버 설정 없이 정적 호스팅에서 동작
