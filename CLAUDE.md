# FitBack FE — 디자인 시스템 규칙

## 반응형 그리드 규칙

- **기준 캔버스**: 1440 × 1020px (모든 Figma 디자인 기준)
- **fold 포인트**: `lg` (1024px) — 이 지점에서 레이아웃이 전환됨
- **우측 사이드바**: 반응형 적용 제외 — 항상 현재 상태 유지
- **전략**: mobile-first Tailwind 클래스 사용

### 브레이크포인트별 동작

| 화면 | 좌측 사이드바 | 콘텐츠 영역 | 우측 사이드바 |
|---|---|---|---|
| `< lg` (< 1024px) | 드로어 오버레이 (기본 숨김) | 전체 너비, `p-4` | 변경 없음 |
| `≥ lg` (≥ 1024px) | 항상 표시, 기본 `w-[72px]` → hover 시 `w-[240px]` | `lg:ml-[72px]`, `p-8` | 변경 없음 |

> 좌측 사이드바는 데스크톱에서 항상 아이콘만 보이는 72px 레일로 시작하고, `group-hover:`로 240px까지 확장됩니다. 콘텐츠 영역의 마진은 축소 상태 기준인 `lg:ml-[72px]`을 사용합니다 (`Sidebar.tsx`, `AppLayout.tsx` 참고).

### 반응형 클래스 작성 규칙

```tsx
// 여백 — 모바일 작게, 데스크톱 크게
className="p-4 lg:p-8"
className="px-6 sm:px-[80px] lg:px-[120px]"

// 사이드바 마진 (축소 상태 72px 기준)
className="flex min-h-screen lg:ml-[72px]"

// 사이드바 노출 (트랜지션 포함)
className="fixed ... -translate-x-full transition-transform duration-300 lg:translate-x-0"

// 모바일 전용 요소 (햄버거 버튼 등)
className="lg:hidden"

// 데스크톱 전용
className="hidden lg:flex"
```

### 고정 너비 요소의 반응형 처리

```tsx
// 고정 → 반응형
// 변경 전: className="w-[625px]"
// 변경 후: className="w-full max-w-[625px]"
```

### 유동 반응형 (fold 없이 화면 폭에 비례해 계속 스케일)

`lg` 브레이크포인트로 전환되는 게 아니라 화면 폭에 비례해 연속적으로 커지고 작아져야 하는 요소(예: `RightSidebar`)는 `calc()` 안에 **Figma 원본 px 값을 그대로 남겨서** 작성합니다. 미리 계산한 `vw` 퍼센트만 적어두면 코드만 보고 Figma 값과 일치하는지 확인할 수 없기 때문입니다.

```tsx
// 금지: 미리 계산된 값만 남음 — Figma에서 몇 px였는지 코드로 알 수 없음
className="w-[27.78vw]"

// 사용: Figma px 값이 코드에 그대로 보임, 1440 기준 캔버스로 나눠서 vw로 스케일
className="w-[calc(400/1440*100vw)]"
```

- 분모는 항상 기준 캔버스 값(가로 스케일은 `1440`)을 사용합니다.
- 반올림 오차가 없고, Figma 값이 바뀌면 분자 숫자만 바꾸면 됩니다.
- `Sidebar`/`Header`처럼 fold 지점에서만 전환되고 그 사이에는 고정 크기를 유지해야 하는 요소는 이 방식을 쓰지 않고 `lg:` 브레이크포인트 + 고정 `px` 값을 그대로 사용합니다.

---

## 기술 스택

- **프레임워크**: React 19 + TypeScript 6
- **스타일링**: Tailwind CSS v4 (`@tailwindcss/vite` 플러그인 사용 — `tailwind.config.ts` 없음)
- **번들러**: Vite 8
- **폰트**: Pretendard Variable (한국어 기본, `pretendard` npm 패키지로 로드), Wanted Sans Variable (영문, `src/assets/fonts/WantedSansVariable.ttf` 로컬 `@font-face`로 로드)
- **경로 별칭**: 미설정 — `@/` 없음, 반드시 상대 경로 사용 (`../../assets/icons`)

---

## 토큰 정의

토큰은 CSS `@theme` 블록으로 정의되며, `src/index.css`에서 한꺼번에 임포트됩니다.

| 파일 | 내용 |
|---|---|
| `src/styles/tokens/color.css` | 브랜드 컬러 (coral, lime, blue) |
| `src/styles/tokens/grayscale.css` | 그레이스케일 (white → black, gray-100–900) |
| `src/styles/tokens/typography.css` | 폰트 패밀리 + 텍스트 스케일 |
| `src/styles/tokens/radius.css` | 보더 반경 |

### 컬러

```css
/* 브랜드 */
--color-coral: #FF6553        --color-coral-light: #F3A3B4
--color-lime:  #CCFF00        --color-lime-light:  #EBFF87
--color-blue:  #2478F5        --color-blue-light:  #77C4FB

/* 그레이스케일 */
--color-white: #FFFFFF         --color-black: #000000
--color-gray-100: #F7F7F7
--color-gray-200: #ECECEC
--color-gray-300: #DEDEDE
--color-gray-400: #BCBCBC
--color-gray-500: #7E7E7E
--color-gray-600: #484848
--color-gray-700: #313131
--color-gray-800: #1A1A1A
--color-gray-900: #0D0D0D
```

Tailwind 유틸리티로 사용: `bg-coral`, `text-gray-500`, `border-blue-light` 등

### 타이포그래피

```css
/* Title — semibold */
--text-title-1: 64px   --text-title-2: 50px   --text-title-3: 32px

/* Subtitle — semibold */
--text-subtitle-1: 24px   --text-subtitle-2: 22px

/* Body — regular, 행간 160% */
--text-body-1: 20px   --text-body-2: 18px   --text-body-3: 16px

/* Button — medium */
--text-button-1: 20px   --text-button-2: 18px   --text-button-3: 16px

/* Caption — regular */
--text-caption-1: 15px   --text-caption-2: 13px
```

Tailwind 유틸리티로 사용: `text-title-1`, `text-body-3` 등

### 폰트

```css
--font-sans: 'Pretendard Variable', Pretendard, system-ui, sans-serif  /* body 기본값 — 명시 불필요 */
--font-en:  'Wanted Sans', sans-serif                                   /* 영문 인라인 스팬에만 */
```

실제로 사용되는 클래스는 `font-en` 하나뿐입니다 (`font-sans`가 body 기본값이라 별도 클래스 지정이 불필요). `typography.css`에 `--font-pretendard` / `--font-wanted-sans` 변수가 정의되어 있지만 현재 코드에서 사용되지 않으므로 새 코드에서도 `font-sans` / `font-en`을 사용합니다.

```tsx
<span className="font-en text-[11px] leading-none text-gray-400">Sales Admin</span>
```

### 반경

```css
--radius: 30px
```

사용: `rounded` (`--radius`에 매핑됨)  
작은 반경이 필요할 때는 Tailwind 기본값 사용 (`rounded-lg`, `rounded-full` 등)

> 현재 코드베이스에는 `rounded` 클래스 실사용 예가 없습니다 (모두 `rounded-lg` / `rounded-full` / `rounded-[4px]` 사용). Figma에서 30px 반경 요소를 만나면 `rounded`를 사용하되, 실제 렌더링을 확인하세요.

---

## 아이콘 시스템

- **위치**: `src/assets/icons/`
- **포맷**: PNG
- **네이밍**: 내비게이션 아이콘은 상태별 두 파일 쌍으로 존재 — `ic-{이름}-idle.png` (비활성) / `ic-{이름}-selected.png` (활성)
- **진입점**: `src/assets/icons/index.ts` — 항상 이 파일에서 임포트 (named export 배럴)

```ts
// 상대 경로 사용 (@ 별칭 미설정)
import { icHomeIdle, icHomeSelected } from '../../assets/icons'
```

### 아이콘 목록

6개 내비게이션 항목 × {idle, selected} = 12개 파일:

`chart`, `comment`, `home`, `message`, `note`, `schedule` — 각각 `-idle` / `-selected` 접미사

> 새 아이콘을 추가할 때 위 목록에 없는 이름이 필요하면, 먼저 `src/assets/icons/`에 파일이 있는지 확인 후 `index.ts`에 export를 추가합니다.

### 아이콘 사용 패턴

**색상 변경이 필요 없는 단일 아이콘:**
```tsx
import { icHomeIdle } from '../../assets/icons'
<img src={icHomeIdle} alt="홈" className="w-6 h-6" />
```

**활성/비활성 상태 전환 (실사용 패턴 — CSS mask 아님):**

`Sidebar.tsx`의 내비게이션 아이템은 idle/selected 두 개의 사전 채색된 PNG를 `src` 조건부 교체로 전환합니다:
```tsx
<img
  src={isActive ? item.selected : item.idle}
  alt={item.label}
  className="h-6 w-6 shrink-0"
/>
```
동적으로 임의의 색상을 입혀야 하는 경우가 아니라면 CSS `mask-image` 기법은 사용하지 않습니다 (현재 코드베이스에 그런 패턴은 없습니다).

---

## 로고 / 기타 에셋

`src/assets/logo/`에 3개 파일이 있으며 용도가 다릅니다:

| 파일 | 용도 |
|---|---|
| `header_logo.png` | Sidebar 확장(hover) 상태의 와이드 로고 |
| `logo-icon.png` | Sidebar 축소(기본) 상태의 아이콘 로고 |
| `logo-full.png` | LoginPage 비주얼 패널의 풀 로고 |

```ts
import logoUrl from '../../assets/logo/header_logo.png'
<img src={logoUrl} alt="Fitback" className="h-[22px] w-auto" />
```

이미지는 Vite가 URL로 처리하므로 `import` 후 `src`에 전달합니다.

`src/assets/images/login-bg.jpg`는 LoginPage 배경 이미지로 사용되는 별도 폴더입니다 (로고/아이콘과 구분).

---

## 스타일링 방식

- **방법**: Tailwind CSS v4 유틸리티 클래스만 사용 — CSS Modules, Styled Components 사용 안 함
- **전역 스타일**: `src/index.css` (폰트 임포트, `box-sizing`, body 기본값)
- **토큰 추가**: `src/styles/tokens/` 내 해당 파일에 추가
- 토큰이 존재하는 값은 인라인 스타일이나 Tailwind 임의값(`text-[16px]`) 사용 **금지**

### Arbitrary value `[...]` 허용 기준

| 허용 | 이유 | 예시 |
|---|---|---|
| 레이아웃 고정 치수 | Figma 프레임에서 온 구조적 값 | `w-[72px]`, `h-[72px]`, `lg:ml-[72px]` |
| 유동 반응형 (fold 없음) | 화면 폭에 비례해 계속 스케일 | `w-[calc(400/1440*100vw)]` |
| **금지** | 디자인 토큰으로 대체해야 함 | `text-[16px]` → `text-body-3`, `bg-[#FF6553]` → `bg-coral` |

`text-*`, `bg-*`, `border-*`, `rounded-*` 계열은 반드시 토큰 클래스를 사용합니다.

---

## 프로젝트 구조

```
src/
├── assets/
│   ├── fonts/          # WantedSansVariable.ttf
│   ├── icons/          # PNG 아이콘 (idle/selected 쌍) + index.ts 배럴
│   ├── images/         # login-bg.jpg 등 배경 이미지
│   └── logo/           # header_logo.png, logo-icon.png, logo-full.png
├── components/
│   └── layout/
│       ├── AppLayout.tsx    # 3열 레이아웃 래퍼
│       ├── Sidebar.tsx      # 왼쪽 고정 내비게이션 (72px → hover 시 240px)
│       ├── Header.tsx       # 상단 스티키 헤더 (72px)
│       └── RightSidebar.tsx # 오른쪽 사이드바 (27.78vw)
├── pages/
│   └── LoginPage.tsx   # 로그인/이메일 인증/회원가입 3단계 플로우
├── styles/
│   └── tokens/         # color.css, grayscale.css, typography.css, radius.css
├── index.css           # 전역 스타일 + 토큰 임포트
├── main.tsx            # 진입점
└── App.tsx             # 루트 컴포넌트 (isLoggedIn 상태로 라우팅)
```

> `src/styles/compoents/atoms/`(오타, "components" 아님) 아래 `button.css`, `input.css`와 `src/App.css`는 비어 있고 어디서도 import되지 않는 미사용 파일입니다. 새 스타일은 여기에 추가하지 말고 `src/styles/tokens/`를 사용하세요.

### 레이아웃 아키텍처

현재 앱은 3열 구조입니다:

```
┌──────────┬──────────────────────┬──────────────┐
│ Sidebar  │  Header              │              │
│ (72px→   ├──────────────────────┤ RightSidebar │
│  240px   │  main content        │  (27.78vw)   │
│  hover)  │  (flex-1)            │  sticky      │
└──────────┴──────────────────────┴──────────────┘
```

- `Sidebar`: `fixed left-0 top-0 h-screen w-[72px] hover:w-[240px] overflow-x-hidden transition-[width] duration-300 bg-gray-800` (데스크톱), 모바일에서는 `-translate-x-full` / `lg:translate-x-0`으로 드로어 전환
- `Header`: `sticky top-0 h-[72px] bg-gray-900/80 backdrop-blur-md`
- `RightSidebar`: `sticky top-0 h-screen w-[calc(400/1440*100vw)] bg-gray-800` — props 없음, fold 전환 없이 화면 폭에 비례해 계속 스케일
- 콘텐츠 래퍼: `lg:ml-[72px]` (축소된 Sidebar 폭 기준)
- `body background`: `bg-gray-900`

---

## 컴포넌트 패턴

### Props 타입

```tsx
// 타입을 같은 파일(Sidebar.tsx)에 정의 후 재내보내기 (AppLayout.tsx에서 re-export)
export type Page = 'home' | 'scheduler' | 'clients' | 'followup' | 'analytics' | 'tasks'

interface AppLayoutProps {
  activePage: Page
  onNavigate: (page: Page) => void
  onLogout?: () => void
  children?: ReactNode
}
```

### 내비게이션 아이템 배열

반복되는 내비게이션 항목은 배열로 선언합니다. 아이콘은 활성/비활성 상태별로 별도 필드를 둡니다 (단일 `icon` 필드가 아님):

```tsx
const NAV_ITEMS: { page: Page; idle: string; selected: string; label: string }[] = [
  { page: 'home', idle: icHomeIdle, selected: icHomeSelected, label: '홈' },
  // ...
]
```

### 조건부 스타일

```tsx
className={`base-classes ${isActive ? 'active-classes' : 'default-classes'}`}
```

---

## Figma → 코드 매핑

| Figma 토큰 | CSS 변수 | Tailwind 클래스 |
|---|---|---|
| Coral / 주 컬러 | `--color-coral` | `bg-coral` / `text-coral` |
| Lime / 강조 컬러 | `--color-lime` | `bg-lime` / `text-lime` |
| Blue | `--color-blue` | `bg-blue` / `text-blue` |
| Gray 100–900 | `--color-gray-{n}` | `bg-gray-{n}` / `text-gray-{n}` |
| Title 1 / 2 / 3 | `--text-title-{n}` | `text-title-1` / `text-title-2` / `text-title-3` |
| Body 3 | `--text-body-3` | `text-body-3` |
| Button 2 | `--text-button-2` | `text-button-2` |
| Caption 1 | `--text-caption-1` | `text-caption-1` |
| Radius | `--radius` | `rounded` |
| 폰트 한국어 | `--font-sans` | (body 기본값, 클래스 지정 불필요) |
| 폰트 영문 | `--font-en` | `font-en` |

Figma 디자인 구현 시 항상 토큰 기반 Tailwind 클래스를 사용합니다. 토큰에 해당하는 값을 hex나 px로 하드코딩하지 않습니다.

### Figma MCP 사용 시 주의사항

- `get_design_context` 또는 `get_screenshot`으로 디자인 읽기
- 컬러 HEX → 위 매핑 테이블로 토큰 클래스 변환 (절대 hex 하드코딩 금지)
- 폰트 크기 → `text-body-3` 등 타이포그래피 토큰으로 변환
- 반경 → `rounded` (30px 기본) 또는 `rounded-lg` / `rounded-full` 사용
- 아이콘은 `src/assets/icons/index.ts`에서 이미 있는지 확인 후 임포트
