import { useState } from 'react'
import { Input, InputWithCheck } from '../../../components/common/input'
import { StepProgress } from '../StepProgress'

export interface SignupInfo {
  nickname: string
  password: string
  passwordConfirm: string
}

interface InfoStepProps {
  onNext: (info: SignupInfo) => Promise<void>
}

export function InfoStep({ onNext }: InfoStepProps) {
  const [nickname, setNickname] = useState('')
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const passwordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm
  const canSubmit =
    nicknameStatus === 'valid' && password.length > 0 && passwordConfirm.length > 0 && !passwordMismatch

  function handleCheckNickname() {
    if (!nickname) return
    setNicknameStatus('valid')
  }

  function handleNicknameChange(value: string) {
    setNickname(value)
    setNicknameStatus('idle')
  }

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await onNext({ nickname, password, passwordConfirm })
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col items-start gap-4 pt-2">
        <h2 className="text-subtitle-2 font-semibold text-gray-100">정보 입력</h2>
        <StepProgress currentStep={3} totalSteps={3} />
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-caption-3 text-gray-100">이름</label>
          <InputWithCheck
            placeholder="이름을 작성해주세요"
            value={nickname}
            onChange={(e) => handleNicknameChange(e.target.value)}
            onCheck={handleCheckNickname}
            checkDisabled={nickname.length === 0}
            status={nicknameStatus}
          />
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

        <div className="flex flex-col gap-2">
          <label className="text-caption-3 text-gray-100">비밀번호 확인</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordMismatch && (
            <p className="pl-2 text-caption-3 leading-none text-error">비밀번호 불일치</p>
          )}
        </div>
        {error && <p className="pl-2 text-caption-3 leading-none text-error">{error}</p>}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className={`h-[52px] w-full rounded-full text-button-3 font-medium transition-colors disabled:cursor-not-allowed ${
          canSubmit && !submitting ? 'bg-lime text-black' : 'bg-gray-500 text-gray-600'
        }`}
      >
        {submitting ? '가입 중...' : '회원가입'}
      </button>
    </div>
  )
}
