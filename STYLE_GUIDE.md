# Kyuwon Kim — Personal Style Guide

> PPT, 웹사이트, 포스터 등 모든 시각 결과물에 공통으로 적용할 디자인 원칙 정리.

---

## 1. 철학 / Design Philosophy

- **학술적 명료함 우선** — 장식보다 정보 구조가 먼저. 읽는 흐름을 방해하는 요소는 제거.
- **Calm & Confident** — 화려하지 않되 자신감 있는 톤. 컬러 포인트는 소수의 역할에만 사용.
- **콘텐츠 중심 레이아웃** — 여백과 타이포그래피로 위계를 만들고, 그래픽 요소는 최소화.
- **다크모드 호환** — 라이트/다크 양쪽에서 동일한 인상을 유지.

---

## 2. 색상 / Color Palette

### 메인 팔레트

| 역할 | 이름 | HSL | HEX (근사) | 용도 |
|------|------|-----|-----------|------|
| Primary | Sky Blue | `199 89% 48%` | `#0DAEE8` | 내비게이션 활성, 소셜 아이콘, 강조 테두리, 연도 배지 |
| Sub / Accent | Golden Amber | `44 100% 55%` | `#FFBC0D` | 링크 밑줄, 어워드 배지, CV 버튼, 저자명 강조 |
| Background | White | `0 0% 100%` | `#FFFFFF` | 페이지 배경 |
| Foreground | Cool Dark Gray | `220 20% 20%` | `#2B2E3B` | 본문 텍스트 |
| Muted BG | Light Gray | `210 20% 96%` | `#F1F3F6` | 카드 배경, 태그, 썸네일 플레이스홀더 |
| Muted Text | Mid Gray | `220 10% 50%` | `#777D8E` | 부제목, 날짜, 레이블 |
| Border | Subtle Gray | `220 13% 90%` | `#E2E5EC` | 구분선, 인풋 테두리 |

### 다크모드 오버라이드 (주요 값)

| 역할 | HSL |
|------|-----|
| Background | `220 20% 10%` |
| Foreground | `210 20% 95%` |
| Primary | `199 89% 55%` (밝게 조정) |
| Card | `220 20% 13%` |

### 컬러 사용 원칙

- **Sky Blue** — 인터랙티브 요소(링크, 버튼, 아이콘)의 "신뢰" 신호. 텍스트에 직접 사용 지양.
- **Golden Amber** — 링크 hover, 수상/하이라이트 등 "주목"이 필요한 곳에만. 면적 사용 최소화.
- 두 포인트 컬러는 한 슬라이드/섹션에서 병용하지 않는 것을 원칙으로 함.

---

## 3. 타이포그래피 / Typography

### 폰트 패밀리

| 역할 | 폰트 |
|------|------|
| 영문 헤딩 | **Poppins** (SemiBold 600) |
| 한/영 본문 | **Pretendard** |
| 인용·모토 | **Noto Serif** Italic Medium |

### 스케일

| 레벨 | 사이즈 | 스타일 | 용도 |
|------|--------|--------|------|
| H1 | 30px (`text-3xl`) | Poppins SemiBold, tracking-tight | 페이지 제목 |
| H2 | 24px (`text-2xl`) | Poppins SemiBold | 섹션 제목 |
| H3 | Base (16px) | Pretendard SemiBold | 카드 제목, 논문 제목 |
| Body | 16px | Pretendard Regular | 본문 단락 |
| Small | 14px (`text-sm`) | Pretendard Regular | 저자, 날짜, 레이블 |
| XSmall | 12px (`text-xs`) | Pretendard Medium | 태그, 버튼 |
| Quote | 16px | Noto Serif Italic | 개인 모토, 인용 |

### 타이포 원칙

- 본문은 `leading-relaxed` (line-height ≈ 1.625), `text-justify` (양끝정렬).
- 헤딩에 `tracking-tight` 적용 — Poppins의 자간을 좁혀 단정한 느낌 유지.
- 영문 헤딩/레이블은 Poppins, 한국어 섞인 문장은 Pretendard로 자연스럽게 fallback.

---

## 4. 레이아웃 / Layout

### 기본 구조

```
┌────────────── Fixed TopNav (60px) ──────────────┐
│                                                   │
│  ┌── Sidebar (290px) ──┐  ┌── Main Content ────┐  │
│  │  Profile Photo       │  │  max-width: 800px  │  │
│  │  Name / Affiliation  │  │                    │  │
│  │  Social Icons        │  │  Sections...       │  │
│  │  (sticky)            │  │                    │  │
│  └──────────────────────┘  └────────────────────┘  │
│                                                   │
└───────────────────────────────────────────────────┘
```

- 전체 컨테이너 최대 폭: `max-w-6xl` (1152px), 좌우 패딩 `px-6`
- 사이드바는 `sticky top` — 스크롤해도 프로필 고정
- 모바일(<768px): 사이드바가 상단에 쌓이고 햄버거 메뉴로 전환

### 섹션 간격

- 섹션 하단 마진: `mb-12` (48px)
- 섹션 내 요소 간격: `space-y-3` (12px)
- 카드 간 구분: `divide-y divide-border` (1px 선)

### PPT 레이아웃 응용 제안

- 슬라이드 여백: 상하 40px, 좌우 56px (16:9 기준)
- 콘텐츠 영역을 좌우로 분리할 때 비율: 3:7 (사이드바:본문 비율 유지)
- 제목 영역은 슬라이드 상단 20% 이내로 제한

---

## 5. 컴포넌트 / UI Components

### 링크 버튼 (`link-btn`)

```
bg: Muted Gray  border: Border Gray  text: Secondary
hover → bg: Golden/15  border: Golden/50  text: Golden
```

- 아이콘(12px) + 텍스트 레이블의 소형 pill 버튼
- PDF, DOI, ACM DL, arXiv 등 외부 링크에 사용
- PPT 슬라이드에서는 이와 동일한 스타일의 회색 라운드 박스로 링크 표시

### 태그 (`tag-pill`)

- `bg-muted`, `text-muted-foreground`, 둥근 모서리
- `#태그명` 형식으로 표기
- PPT에서는 연구 키워드 표시용으로 동일 스타일 적용

### 어워드 배지 (`award-badge-highlight`)

- Golden Amber 배경, 흰 텍스트, Award 아이콘 포함
- 수상 내역에만 사용 — 희소성 유지

### 연도/섹션 뱃지 (`year-badge`)

- `text-xl`, Poppins SemiBold, `text-foreground`
- 논문 목록의 연도 구분자로 사용
- PPT에서는 챕터 구분용 타임라인 레이블로 활용 가능

### 카드 호버 효과

- `hover:-translate-y-1` + `hover:shadow-lg`
- 0.2s ease 트랜지션
- 클릭 가능한 카드에 일관되게 적용

### 텍스트 링크 (`.text-link`)

- 색상은 원래 텍스트 색 유지 (색 변경 없음)
- 하단 밑줄: Golden Amber 2px, `text-underline-offset: 2px`
- hover 시 Golden/22% 배경이 아래서 올라오는 fill 애니메이션 (0.2s ease)
- 외부 링크에만 사용, 내비게이션 링크에는 미적용

### 저자 강조 (`.author-highlight`)

- 본인 이름에만 적용: `font-semibold` + Golden Amber 밑줄
- 논문 저자 목록에서 자신의 위치를 명확히 표시

---

## 6. 내비게이션 / Navigation

- 높이 60px, 배경 `bg-background`, 하단 `border-b`
- 좌측: 이름 (Poppins SemiBold, Primary 색)
- 우측: 텍스트 링크들 + 검색 아이콘 + 다크모드 토글
- 활성 링크: Primary(Sky Blue) 색, 비활성: Muted Gray
- 모바일: 검색은 생략, 햄버거 메뉴로 전환

---

## 7. 인터랙션 & 애니메이션 / Motion

- **페이지 전환**: 0.15s `opacity 0→1` (fade-in) — 빠르고 절제된 전환
- **카드 hover**: `translateY -4px` + `shadow-lg`, 0.2s ease
- **텍스트 링크**: Golden 배경 fill, 0.2s ease
- **버튼/아이콘**: `transition-colors`, 0.15s — 색상 전환만
- 원칙: 애니메이션은 기능적 피드백 목적에만. 장식적 움직임 사용하지 않음.

---

## 8. 아이콘 / Icons

- 라이브러리: **Lucide Icons** (일관성 유지)
- 기본 크기: `w-5 h-5` (20px) — 버튼/툴바 내
- 소형: `w-3 h-3` (12px) — 링크 버튼 내부
- 소셜 아이콘: `w-6 h-6` (24px), Primary 색
- 커스텀 SVG(Google Scholar, ResearchGate, LinkedIn)도 동일 크기/색 규칙 적용

---

## 9. PPT 적용 가이드

### 슬라이드 타입별 권장 스타일

| 슬라이드 | 제목 폰트 | 배경 | 포인트 색 |
|---------|---------|------|---------|
| 표지 | Poppins Bold 36pt | White or `#0DAEE8` | Golden |
| 섹션 구분 | Poppins SemiBold 28pt | Muted Gray | Sky Blue |
| 본문 | Pretendard 16pt | White | — |
| 데이터/결과 | Pretendard | White | Sky Blue 그래프 |
| 수상/강조 | Pretendard SemiBold | Golden badge | — |

### 금지 사항

- 클립아트, 무료 스톡 일러스트 사용 금지
- 3가지 이상 컬러를 포인트로 동시 사용 금지
- 글자 그림자, 워드아트 스타일 효과 금지
- 슬라이드 배경에 그라디언트 남용 금지 (단, 표지 1장에 Sky Blue solid 배경은 허용)

---

## 10. 보이스 & 톤 / Writing Tone

- 영어 기준: 학술적이되 딱딱하지 않은 3인칭 또는 1인칭 서술
- 모토: *"Always go with the choice that scares you the most"* — 리스크와 성장 지향 정체성
- 한국어 사용 시: 격식체(습니다), 과도한 미사여구 지양
- 논문 제목은 원제 그대로, 번역 병기 최소화
