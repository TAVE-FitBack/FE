import type { UserInfo } from './auth'

const ACCESS_TOKEN_KEY = 'fitback_access_token'
const REFRESH_TOKEN_KEY = 'fitback_refresh_token'
const CURRENT_USER_KEY = 'fitback_current_user'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getCurrentUser(): UserInfo | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserInfo
  } catch {
    return null
  }
}

export function setCurrentUser(user: UserInfo): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}
