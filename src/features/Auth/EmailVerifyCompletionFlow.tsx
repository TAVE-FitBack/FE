import { useState } from 'react'
import { RightPanel } from './RightPanel'
import { TermsStep, type TermsAgreements } from './steps/TermsStep'
import { InfoStep, type SignupInfo } from './steps/InfoStep'
import { signup } from '../../api/auth'

type Step = 'terms' | 'info' | 'done'

interface EmailVerifyCompletionFlowProps {
  token: string
}

/**
 * 이메일 인증 링크를 클릭해서 연 탭에서 바로 약관 동의~가입 완료까지 처리한다.
 * (원래 가입 탭과 브라우저/저장소가 달라 localStorage로 인증 상태를 넘길 수 없는 경우의 대비 경로)
 */
export function EmailVerifyCompletionFlow({ token }: EmailVerifyCompletionFlowProps) {
  const [step, setStep] = useState<Step>('terms')
  const [agreements, setAgreements] = useState<TermsAgreements | null>(null)

  async function handleInfoSubmit(info: SignupInfo) {
    await signup({
      token,
      nickname: info.nickname,
      password: info.password,
      passwordConfirm: info.passwordConfirm,
      agreeTerms: agreements?.terms ?? false,
      agreeMarketing: false,
    })
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="text-body-3 text-gray-100">
            가입이 완료되었습니다.
            <br />
            로그인해 주세요.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="h-[52px] rounded-full bg-lime px-8 text-button-3 font-medium text-black"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex w-full shrink-0 flex-col items-center justify-center px-6 py-12 lg:w-[48.3%]">
        <div className="w-full max-w-[392px]">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="pt-2 font-bold tracking-tight text-title-3 text-white">회원가입</h1>
            <p className="text-body-3 text-white/50">이메일 인증이 완료됐어요. 이어서 가입을 완료해 주세요.</p>
          </div>

          {step === 'terms' && (
            <TermsStep
              onNext={(next) => {
                setAgreements(next)
                setStep('info')
              }}
            />
          )}

          {step === 'info' && <InfoStep onNext={handleInfoSubmit} />}
        </div>
      </div>

      <RightPanel />
    </div>
  )
}
