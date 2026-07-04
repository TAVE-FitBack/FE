import { useState, type FormEvent } from 'react'
import { Input } from '../components/common/input'
import { RightPanel } from '../features/Auth/RightPanel'
import { SignupFlow } from '../features/Auth/SignupFlow'

type Step = 'login' | 'signup'

interface LoginPageProps {
  onLogin: () => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<Step>('login')

  if (step === 'signup') {
    return <SignupFlow onBackToLogin={() => setStep('login')} />
  }

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex w-full shrink-0 flex-col items-center justify-center px-6 py-12 lg:w-[48.3%]">
        <div className="w-full max-w-[392px]">
          <LoginPanel onLogin={onLogin} onGoToSignup={() => setStep('signup')} />
        </div>
      </div>

      <RightPanel />
    </div>
  )
}

/* ── 로그인 패널 ── */
function LoginPanel({
  onLogin,
  onGoToSignup,
}: {
  onLogin: () => void
  onGoToSignup: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const emailHasSpace = email.includes(' ')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onLogin()
  }

  return (
    <>
      <div className="mb-[42px] flex flex-col gap-2">
        <h1 className="pt-2 font-bold tracking-tight text-title-3 text-white text-center">로그인</h1>
        <p className="text-body-3 text-white/50 text-center">Fitback와 함께하는 스마트한 고객 관리의 시작</p>
      </div>

      <GoogleButton label="Google 계정으로 로그인" />
      <Divider />

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-caption-3 text-gray-100">이메일 주소</label>
          <Input
            type="email"
            placeholder="example@google.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailHasSpace && (
            <p className="pl-2 text-caption-3 leading-none text-error">
              올바른 이메일 형식이 아니에요(공간만 확인)
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-caption-3 text-gray-100">비밀번호</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <div className="relative h-4 w-4 shrink-0">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="peer h-full w-full appearance-none rounded-[4px] border border-gray-500 bg-white"
              />
              <svg viewBox="0 0 16 16" fill="none" aria-hidden className="pointer-events-none absolute inset-0 opacity-0 peer-checked:opacity-100">
                <path d="M3 8l3 3 7-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-caption-1 text-gray-500">로그인 유지</span>
          </label>
          <div className="flex items-center text-caption-1 font-medium text-gray-500">
            <span>아이디</span>
            <span className="mx-1">·</span>
            <span>비밀번호 찾기</span>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 h-[54px] w-full rounded-full bg-lime font-medium tracking-tight text-button-3 text-black"
        >
          로그인
        </button>
      </form>

      <div className="mt-7 flex items-center justify-center gap-3 text-body-3">
        <span className="text-gray-500">아직 회원이 아니신가요?</span>
        <button type="button" onClick={onGoToSignup} className="flex items-center gap-2 font-medium text-gray-500">
          회원가입하기
          <ChevronRight />
        </button>
      </div>
    </>
  )
}

/* ── 공통 컴포넌트 ── */
function Divider() {
  return (
    <div className="my-6 flex items-center gap-6">
      <div className="h-px flex-1 bg-white/10" />
      <span className="tracking-tight text-caption-2 text-gray-500">또는</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  )
}

function GoogleButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex h-[54px] w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 font-medium text-button-3 text-white transition-colors hover:bg-white/10"
    >
      <GoogleIcon />
      {label}
    </button>
  )
}

function ChevronRight() {
  return (
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" aria-hidden>
      <path d="M1 1l4 5-4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M18.17 8.37H10v3.33h4.71A4.73 4.73 0 0 1 10 15a5 5 0 1 1 3.32-8.73l2.35-2.36A8.33 8.33 0 1 0 10 18.33c4.6 0 8.33-3.73 8.33-8.33 0-.56-.06-1.11-.16-1.63Z" fill="#FFC107" />
      <path d="m2.63 6.12 2.73 2A5 5 0 0 1 10 5a4.97 4.97 0 0 1 3.32 1.27l2.35-2.36A8.33 8.33 0 0 0 2.63 6.12Z" fill="#FF3D00" />
      <path d="M10 18.33a8.33 8.33 0 0 0 5.59-2.16l-2.58-2.18A5 5 0 0 1 5.3 11.69l-2.72 2.09A8.33 8.33 0 0 0 10 18.33Z" fill="#4CAF50" />
      <path d="M18.17 8.37H10v3.33h4.71a5.02 5.02 0 0 1-1.7 2.32l2.58 2.18C17.43 14.47 18.33 12.42 18.33 10c0-.56-.06-1.11-.16-1.63Z" fill="#1976D2" />
    </svg>
  )
}
