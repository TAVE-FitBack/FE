# FitBack FE

TAVE FitBack 프로젝트의 프론트엔드입니다.

배포: https://fitback-sigma.vercel.app

## 기술 스택

- **React 19 + TypeScript** — 컴포넌트 UI, 타입 안정성
- **Vite 8** — 개발 서버 및 빌드 도구
- **Tailwind CSS v4** — `@tailwindcss/vite` 플러그인 방식으로 사용 (별도 `tailwind.config.ts` 없이 CSS 안에서 설정)
- **ESLint + Prettier** — 코드 스타일 검사 및 자동 포맷팅
- **Pretendard / Wanted Sans** — 각각 한국어/영문 폰트, `src/styles`와 `src/assets/fonts`에서 로드
- 별도 라우터 라이브러리 없이 `App.tsx`의 상태값으로 화면 전환 (로그인 여부, 현재 페이지)
- API 통신은 axios 같은 라이브러리 없이 fetch 기반 자체 클라이언트(`src/api/client.ts`)로 처리, 인증 토큰 갱신(refresh) 로직 포함

## 실행 방법

```bash
npm install
npm run dev
```

`.env.example`을 복사해 `.env`를 만들고 API 서버 주소(`VITE_API_BASE_URL`)를 채워주면 됩니다.

그 외 스크립트:

```bash
npm run build     # 빌드
npm run lint       # 린트
npm run format     # 포맷팅
```

## 폴더 구성

- `src/api` — API 요청, 토큰/인증 관련 로직
- `src/components` — 공용 컴포넌트, 레이아웃(사이드바, 헤더 등)
- `src/features` — 로그인/회원가입, 고객 목록 등 화면별 기능 단위
- `src/pages` — 실제 페이지
- `src/styles/tokens` — 컬러/타이포그래피 등 디자인 토큰
- `src/assets` — 아이콘, 로고, 이미지, 폰트

## 기타

디자인 관련 세부 컨벤션(토큰, 반응형 규칙 등)은 `CLAUDE.md`에 정리해두었습니다.
