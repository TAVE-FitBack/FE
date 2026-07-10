import { useEffect, useState } from 'react'
import { verifyEmail } from '../../api/auth'
import { setVerificationToken } from '../../api/verification'

type Status = 'idle' | 'verifying' | 'success' | 'error'

export function useEmailVerifyCallback(): Status {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')
    if (!token) return

    setStatus('verifying')
    verifyEmail(token)
      .then(() => {
        setVerificationToken(token)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
      .finally(() => {
        window.history.replaceState({}, '', window.location.pathname)
      })
  }, [])

  return status
}

export function EmailVerifyCallbackScreen({ status }: { status: Exclude<Status, 'idle'> }) {
  if (status === 'verifying') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-center text-body-3 text-gray-100">
        이메일 인증 확인 중...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-center text-body-3 text-gray-100">
        이메일 인증에 실패했습니다. 다시 시도해 주세요.
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-center">
      <p className="text-body-3 text-gray-100">
        이메일 인증이 완료되었습니다.
        <br />
        원래 탭으로 돌아가 가입을 이어서 진행해 주세요. 이 탭은 닫으셔도 됩니다.
      </p>
    </div>
  )
}
