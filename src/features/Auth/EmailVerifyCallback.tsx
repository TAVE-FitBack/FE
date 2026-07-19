import type { EmailVerifyStatus } from './useEmailVerifyCallback'
import { EmailVerifyCompletionFlow } from './EmailVerifyCompletionFlow'

export function EmailVerifyCallbackScreen({
  status,
  token,
}: {
  status: Exclude<EmailVerifyStatus, 'idle'>
  token: string | null
}) {
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

  // status === 'success' — 이 화면에서 바로 약관 동의~가입 완료까지 이어서 처리한다.
  // (다른 브라우저에서 링크를 열어 원래 탭과 localStorage를 공유하지 못하는 경우에도 가입이 끝까지 진행되도록)
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-center text-body-3 text-gray-100">
        인증 토큰을 찾을 수 없습니다. 인증 메일의 링크를 다시 클릭해 주세요.
      </div>
    )
  }

  return <EmailVerifyCompletionFlow token={token} />
}
