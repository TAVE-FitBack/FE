import { useEffect, useState } from 'react'
import { verifyEmail } from '../../api/auth'
import { setVerificationToken } from '../../api/verification'

export type EmailVerifyStatus = 'idle' | 'verifying' | 'success' | 'error'

export interface EmailVerifyCallbackState {
  status: EmailVerifyStatus
  token: string | null
}

function getTokenFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('token')
}

export function useEmailVerifyCallback(): EmailVerifyCallbackState {
  const [token] = useState(getTokenFromUrl)
  const [status, setStatus] = useState<EmailVerifyStatus>(() => (getTokenFromUrl() ? 'verifying' : 'idle'))

  useEffect(() => {
    if (!token) return
    verifyEmail(token)
      .then(() => {
        // 같은 브라우저의 다른 탭에서 가입을 이어가는 기존 경로도 계속 지원(로컬 스토리지 공유 시 자동 인식).
        setVerificationToken(token)
        setStatus('success')
      })
      .catch(() => setStatus('error'))
      .finally(() => {
        window.history.replaceState({}, '', window.location.pathname)
      })
  }, [token])

  return { status, token }
}
