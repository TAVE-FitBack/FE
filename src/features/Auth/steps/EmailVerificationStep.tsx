import { useState } from 'react'
import { Input } from '../../../components/common/input'
import { StepProgress } from '../StepProgress'

interface EmailVerificationStepProps {
  onNext: (email: string) => void
}

export function EmailVerificationStep({ onNext }: EmailVerificationStepProps) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  // 백엔드 이메일 인증 연동 전까지 임시로 API 호출 없이 무조건 통과시킴
  async function handleSend() {
    if (!email || sending) return
    setSending(true)
    setError('')
    setSent(true)
    setSending(false)
  }

  function handleReset() {
    setEmail('')
    setSent(false)
    setError('')
  }

  const active = sent || (email.length > 0 && !sending)

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col items-start justify-center gap-4 pt-2">
          <h2 className="text-subtitle-2 font-semibold text-gray-100">이메일 인증</h2>
          <StepProgress currentStep={2} totalSteps={3} />
        </div>
        <p className="text-body-3 text-white/50">
          {sent ? (
            <>
              입력하신 이메일로 링크를 보냈습니다.
              <br />
              메일을 확인해 주세요.
            </>
          ) : (
            '이메일 인증을 진행해 주세요.'
          )}
        </p>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-caption-3 text-gray-100">이메일 주소</label>
          <Input
            type="email"
            placeholder="example@google.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={sent}
          />
          {error && <p className="pl-2 text-caption-3 leading-none text-error">{error}</p>}
        </div>

        <button
          type="button"
          onClick={sent ? () => onNext(email) : handleSend}
          disabled={!sent && (!email || sending)}
          className={`h-[52px] w-full rounded-full text-button-3 font-medium transition-colors disabled:cursor-not-allowed ${
            active ? 'bg-lime text-black' : 'bg-gray-500 text-gray-600'
          }`}
        >
          {sent ? '인증 완료' : sending ? '전송 중...' : email ? '이메일 주소 인증' : '인증하기'}
        </button>
      </div>

      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={handleSend}
          disabled={!email || sending}
          className="text-body-3 font-medium text-gray-500 underline disabled:opacity-40"
        >
          이메일 재전송
        </button>
        <button type="button" onClick={handleReset} className="text-body-3 font-medium text-gray-500 underline">
          다른 이메일 사용
        </button>
      </div>
    </div>
  )
}
