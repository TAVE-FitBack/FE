<img width="1191" height="1684" alt="A2 _ 420x594 mm" src="https://github.com/user-attachments/assets/3b16567f-a985-487e-b92c-cc2c07c68d12" />

<br>

# FitBack — Frontend

> 피트니스 센터에서 **상담 후 등록하지 않은 잠재 고객**을 AI가 분석하고, 사장님이 놓치지 않고 후속 관리할 수 있도록 돕는 서비스

**TAVE 프로젝트** · [배포 사이트](https://fitback-sigma.vercel.app) · [Backend Repository](https://github.com/TAVE-FitBack/BE)

<br>

## 📌 서비스 소개

피트니스 센터는 상담을 받고도 바로 등록하지 않는 고객이 많지만, 대부분은 메모나 기억에 의존해 후속 연락을 놓치곤 합니다.
FitBack은 상담 내용을 입력하면 AI가 **미등록 사유와 고객 성향을 분석**하고, **다음에 취해야 할 최적 액션과 후속 메시지**까지 제안합니다.
이 레포지토리는 사장님이 매일 사용하는 **웹 클라이언트(프론트엔드)** 입니다.

<br>

## ✨ 주요 화면 / 기능

| 화면 | 설명 |
|---|---|
| **회원가입 · 로그인** | 이메일 인증 기반 회원가입(약관 → 이메일 인증 → 정보 입력), 인증 메일 링크 콜백 처리 |
| **매장 설정** | 가입 직후 업종·서비스·운영 정보·이벤트를 단계별로 입력하는 온보딩 플로우 |
| **고객 관리** | 상담·문의 고객 목록 / 필터 / 통계 요약, 상담·문의 등록 모달, 상담 상세(고객 정보·AI 분석·메모·활동 타임라인·메시지 초안) |
| **후속 관리** | 연락 회차(1~3차)별 보드·테이블 뷰, 답장 여부 · 발송 처리, AI 추천 메시지 |
| **스케줄러** | 월간 캘린더 · 미니 캘린더 · 일정 추가, 체크리스트(할 일) 패널 |
| **분석 리포트** | 전체 리포트(전환율 · 월별 추이 · 유입경로 · 서비스별 현황)와 후속관리 리포트(전환 흐름 그래프 · 미등록 사유 · AI 추천) |

<br>

## 🙋 담당 역할 (Frontend)

프론트엔드 전반의 설계와 구현을 담당했습니다.

- **디자인 시스템 구축** — Figma 디자인을 토큰(컬러 · 타이포그래피 · 반경)으로 `@theme`에 정의하고, 하드코딩 없이 토큰 기반 Tailwind 클래스로만 UI를 구현
- **반응형 레이아웃** — 1440px 기준 캔버스에서 `lg`(1024px)를 fold 지점으로 삼아 모바일 드로어 ↔ 데스크톱 사이드바(72px ↔ 196px 펼침, 본문이 밀려나는 구조)로 전환. 우측 패널은 `calc(400/1440*100vw)`처럼 Figma 원본 px 값을 남긴 유동 스케일 적용
- **인증 · 토큰 관리** — `fetch` 기반 API 클라이언트를 직접 구현하고, 401 응답 시 refresh 토큰으로 자동 재발급 후 원 요청을 1회 재시도(무한 루프 방지)
- **회원가입 / 매장 설정 플로우** — 다단계 스텝 폼, 이메일 인증 콜백 화면, 로그인 상태에 따른 화면 분기(로그인 → 매장 설정 → 메인)
- **고객 관리 · 상담 상세** — 고객 테이블 / 필터 / 등록 모달, 상담 상세 모달의 탭 구성(AI 분석 · 메모 · 타임라인) 및 검색 결과에서 상세 모달 바로 열기
- **후속 관리 보드** — 차수별 연락 카드/테이블, 발송 처리 및 AI 메시지 초안 패널
- **스케줄러** — 월간 캘린더 그리드, 일정/체크리스트 CRUD 연동
- **분석 리포트 시각화** — 차트 라이브러리 없이 SVG/CSS로 직접 구현한 추이 차트 · 게이지 · 전환 흐름 그래프(상담 → 후속 n차 → 최종 등록/이탈)
- **백엔드 API 연동** — 공통 응답 포맷(`success / code / message / data`) 처리와 에러 코드 기반 예외 처리

<br>

## 🔮 Tech Stack

<div>
  <img src="https://img.shields.io/badge/React 19-61DAFB?style=flat-square&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite 8-646CFF?style=flat-square&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind CSS v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white">
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white">
</div>

<br>

- **React 19 + TypeScript** — 컴포넌트 기반 UI, 타입 안정성
- **Vite 8** — 개발 서버 및 빌드
- **Tailwind CSS v4** — `@tailwindcss/vite` 플러그인 방식, `tailwind.config.ts` 없이 CSS 안에서 토큰 설정
- **Pretendard / Wanted Sans** — 한국어 / 영문 폰트
- **최소 의존성** — 런타임 의존성은 React · Tailwind · Pretendard 뿐. 라우터 · HTTP 클라이언트 · 차트 · 상태관리 라이브러리 없이 구현

### 설계 포인트

- **상태 기반 화면 전환** — 별도 라우터 없이 `App.tsx`의 인증 상태(`loggedOut` / `needsStoreSetup` / `loggedIn`)와 현재 페이지 상태로 화면을 전환
- **자체 API 클라이언트** — `src/api/client.ts` 한 곳에서 인증 헤더, 공통 응답 언래핑, 토큰 갱신을 처리하고, 도메인별 API 파일(`auth`, `store`, `consultations`, `followUps`, `schedules`, `analysisReport` …)이 이를 사용
- **토큰 기반 디자인 시스템** — 색 · 폰트 크기 · 반경은 `src/styles/tokens`의 CSS 변수에서만 가져오고, Figma 값은 임의값(`text-[16px]`, `bg-[#FF6553]`) 대신 토큰 클래스로 변환
- **기능 단위 폴더 구조** — 화면별 UI·로직을 `features/*`에 모으고 `pages/*`는 조합만 담당

<br>

## 🧩 전체 서비스 구조

프론트엔드는 Spring Boot 백엔드의 REST API와 통신하며, AI 분석(FastAPI · GPT-4o mini · Neo4j)은 백엔드를 거쳐 제공됩니다.

<img width="60%" alt="FitBack System Architecture" src="https://github.com/user-attachments/assets/f59fd315-9975-4018-95e8-3a13de1c40ba" />

| 영역 | 기술 |
|---|---|
| **Frontend** (이 레포) | React 19, TypeScript, Vite, Tailwind CSS v4 — Vercel 배포 |
| **Backend** | Java 21, Spring Boot, Spring Security + JWT, PostgreSQL, Redis, Spring Data JPA |
| **AI** | FastAPI, OpenAI GPT-4o mini, Neo4j AuraDB |
| **Infra** | AWS EC2 · RDS, Docker, Nginx, GitHub Actions |

백엔드 도메인: `Auth` · `Store` · `Customer & Consultation` · `Inquiry` · `Follow-up` · `Schedule & Checklist` · `Message Template` · `Analysis Report`
→ 자세한 내용은 [Backend Repository](https://github.com/TAVE-FitBack/BE) 참고

<br>

## 🚀 실행 방법

```bash
npm install
npm run dev
```

`.env.example`을 복사해 `.env`를 만들고 API 서버 주소(`VITE_API_BASE_URL`)를 채워주세요.

```bash
npm run build     # 타입 체크 + 프로덕션 빌드
npm run lint      # 린트
npm run format    # 포맷팅
```

<br>

## 📁 폴더 구성

```
src
├── api          # API 요청, 토큰/인증 로직 (도메인별 파일 + 공통 client)
├── components   # 공용 컴포넌트, 레이아웃(사이드바 · 헤더 · 우측 패널)
├── features     # 화면별 기능 단위 (Auth, Store, Clients, ConsultationDetail,
│                #   FollowUp, Scheduler, Analytics)
├── pages        # 페이지 (features 조합)
├── styles/tokens# 컬러 · 그레이스케일 · 타이포그래피 · 반경 토큰
└── assets       # 아이콘, 로고, 이미지, 폰트
```

디자인 관련 세부 컨벤션(토큰, 반응형 규칙 등)은 [`CLAUDE.md`](./CLAUDE.md)에 정리해두었습니다.

<br>

## 📜 Convention

- **Commit** — `feat` · `fix` · `docs` · `style` · `refactor` · `chore` · `ci` 타입 prefix 사용 (예: `fix: 화면 세부 디자인 수정`)
- **Branch** — 기능 단위 브랜치(`feat/*`, `fix/*`)에서 작업 후 PR → `main`
