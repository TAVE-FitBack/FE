import { useState } from 'react'
import { RightPanel } from './RightPanel'
import { TermsStep } from './steps/TermsStep'
import { EmailVerificationStep } from './steps/EmailVerificationStep'
import { InfoStep } from './steps/InfoStep'

type Step = 'terms' | 'email' | 'info'

interface SignupFlowProps {
  onBackToLogin: () => void
}

export function SignupFlow({ onBackToLogin }: SignupFlowProps) {
  const [step, setStep] = useState<Step>('terms')

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex w-full shrink-0 flex-col items-center justify-center px-6 py-12 lg:w-[48.3%]">
        <div className="w-full max-w-[392px]">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="pt-2 font-bold tracking-tight text-title-3 text-white">회원가입</h1>
            <p className="text-body-3 text-white/50">Fitback와 함께하는 스마트한 고객 관리의 시작</p>
          </div>

          {step === 'terms' && <TermsStep onNext={() => setStep('email')} />}

          {step === 'email' && <EmailVerificationStep onNext={() => setStep('info')} />}

          {step === 'info' && <InfoStep onNext={() => onBackToLogin()} />}
        </div>
      </div>

      <RightPanel />
    </div>
  )
}
