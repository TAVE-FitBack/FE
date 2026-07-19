import { request } from './client'
import { clearCurrentUser, clearTokens, getRefreshToken, setCurrentUser, setTokens } from './token'

export interface UserInfo {
  id: string
  nickname: string
  email: string
  role: 'OWNER' | 'STAFF'
  storeId: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserInfo
}

export interface SignupResponse {
  userId: string
  email: string
  nickname: string
}

export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface SignupRequest {
  token: string
  nickname: string
  password: string
  passwordConfirm: string
  agreeTerms: boolean
  agreeMarketing: boolean
}

export function sendVerificationEmail(email: string): Promise<void> {
  return request<void>('/api/auth/send-verification', {
    method: 'POST',
    body: { email },
    auth: false,
  })
}

export function verifyEmail(token: string): Promise<void> {
  return request<void>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'GET',
    auth: false,
  })
}

export function signup(req: SignupRequest): Promise<SignupResponse> {
  return request<SignupResponse>('/api/auth/signup', {
    method: 'POST',
    body: req,
    auth: false,
  })
}

export async function login(req: { email: string; password: string }): Promise<LoginResponse> {
  const data = await request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: req,
    auth: false,
  })
  setTokens(data)
  setCurrentUser(data.user)
  return data
}

export async function refreshAccessToken(): Promise<TokenRefreshResponse> {
  const refreshToken = getRefreshToken()
  const data = await request<TokenRefreshResponse>('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
  })
  setTokens(data)
  return data
}

export async function logout(): Promise<void> {
  try {
    await request<void>('/api/auth/logout', { method: 'POST' })
  } finally {
    clearTokens()
    clearCurrentUser()
  }
}
