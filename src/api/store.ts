import { request } from './client'

export type StoreType = 'GYM' | 'OTHER'

export interface StoreSetupRequest {
  name: string
  storeType: StoreType
  phone?: string
  businessNumber?: string
  address?: string
}

export interface StoreSetupResponse {
  storeId: string
  name: string
  storeType: StoreType
}

export function setupStore(req: StoreSetupRequest): Promise<StoreSetupResponse> {
  return request<StoreSetupResponse>('/api/store', { method: 'POST', body: req })
}
