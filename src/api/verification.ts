const VERIFICATION_TOKEN_KEY = 'fitback_email_verification_token'

export function getVerificationToken(): string | null {
  return localStorage.getItem(VERIFICATION_TOKEN_KEY)
}

export function setVerificationToken(token: string): void {
  localStorage.setItem(VERIFICATION_TOKEN_KEY, token)
}

export function clearVerificationToken(): void {
  localStorage.removeItem(VERIFICATION_TOKEN_KEY)
}
