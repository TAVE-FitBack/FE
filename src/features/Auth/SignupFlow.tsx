import { useState } from 'react'
import { RightPanel } from './RightPanel'
import { TermsStep, type TermsAgreements } from './steps/TermsStep'
import { EmailVerificationStep } from './steps/EmailVerificationStep'
import { InfoStep, type SignupInfo } from './steps/InfoStep'
import { signup } from '../../api/auth'
import { getVerificationToken, clearVerificationToken } from '../../api/verification'

type Step = 'terms' | 'email' | 'info'

interface SignupFlowProps {
  onBackToLogin: () => void
}

export function SignupFlow({ onBackToLogin }: SignupFlowProps) {
  const [step, setStep] = useState<Step>('terms')
  const [agreements, setAgreements] = useState<TermsAgreements | null>(null)

  async function handleInfoSubmit(info: SignupInfo) {
    const token = getVerificationToken()
    if (!token) throw new Error('이메일 인증이 만료되었습니다. 다시 인증해 주세요.')

    await signup({
      token,
      nickname: info.nickname,
      password: info.password,
      passwordConfirm: info.passwordConfirm,
      agreeTerms: agreements?.terms ?? false,
      agreeMarketing: false,
    })
    clearVerificationToken()
    onBackToLogin()
  }

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex w-full shrink-0 flex-col items-center justify-center px-6 py-12 lg:w-[48.3%]">
        <div className="w-full max-w-[392px]">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="pt-2 font-bold tracking-tight text-title-3 text-white">회원가입</h1>
            <p className="text-body-3 text-white/50">Fitback와 함께하는 스마트한 고객 관리의 시작</p>
          </div>

          {step === 'terms' && (
            <TermsStep
              onNext={(next) => {
                setAgreements(next)
                setStep('email')
              }}
            />
          )}

          {step === 'email' && <EmailVerificationStep onNext={() => setStep('info')} />}

          {step === 'info' && <InfoStep onNext={handleInfoSubmit} />}
        </div>
      </div>

      <RightPanel />
    </div>
  )
}
