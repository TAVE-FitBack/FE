import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './token'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T
}

export class ApiError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.code = code
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
  /** internal: prevents infinite refresh loops */
  isRetry?: boolean
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, isRetry = false } = options

  const isFormData = body instanceof FormData
  const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' }
  if (auth) {
    const accessToken = getAccessToken()
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
  })

  if (res.status === 401 && auth && !isRetry && getRefreshToken()) {
    const refreshed = await tryRefresh()
    if (refreshed) return request<T>(path, { ...options, isRetry: true })
    clearTokens()
  }

  if (res.status === 204) {
    if (!res.ok) throw new ApiError('요청에 실패했습니다.', String(res.status))
    return undefined as T
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !json || !json.success) {
    throw new ApiError(json?.message ?? '요청에 실패했습니다.', json?.code ?? String(res.status))
  }

  return json.data
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const json = (await res.json().catch(() => null)) as ApiResponse<{
      accessToken: string
      refreshToken: string
    }> | null
    if (!res.ok || !json?.success) return false
    setTokens(json.data)
    return true
  } catch {
    return false
  }
}
