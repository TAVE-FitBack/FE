import { request } from './client'
import type { CustomerInfo } from './inquiries'
import type { CustomerStatus } from './customerManagement'
import type { AiCheckPreview } from './aiCheckPreview'

export interface ConsultationCustomerSearchResponse {
  exists: boolean
  customer: CustomerInfo | null
  redirectUrl: string | null
}

export function searchConsultationCustomerByPhone(phone: string): Promise<ConsultationCustomerSearchResponse> {
  return request<ConsultationCustomerSearchResponse>(`/api/consultations/search?phone=${encodeURIComponent(phone)}`)
}

export interface ConsultationInfo {
  consultedServiceId: string
  consultedAt: string
  userId: string
  registrationStatus: CustomerStatus
  rawText: string
  visitPurpose?: string
  experienceNote?: string
  positiveSignal?: string
  extraNote?: string
}

export interface ConsultationCreateRequest {
  customer: CustomerInfo
  consultation: ConsultationInfo
  aiCheckPreview?: AiCheckPreview
}

export interface ConsultationCreateResponse {
  consultationId: string
  customerId: string
  sessionNo: number
  redirectUrl: string
}

export type ConsultationCheckPreviewResponse = AiCheckPreview

export function checkConsultationPreview(req: ConsultationCreateRequest): Promise<ConsultationCheckPreviewResponse> {
  return request<ConsultationCheckPreviewResponse>('/api/consultations/check-preview', { method: 'POST', body: req })
}

/** materials: 상담 자료 첨부 — .txt만 허용, 최대 3개, 파일당 1MB 이하 (AI 중간점검엔 첨부되지 않음) */
export function createConsultation(req: ConsultationCreateRequest, materials: File[] = []): Promise<ConsultationCreateResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }))
  for (const file of materials) {
    formData.append('materials', file)
  }
  return request<ConsultationCreateResponse>('/api/consultations', { method: 'POST', body: formData })
}
