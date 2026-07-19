import { request } from './client'
import type { Gender, InquiryStatus } from './customerManagement'

export type PreferredContactChannel = 'SMS' | 'PHONE' | 'KAKAO'

export interface CustomerInfo {
  name: string
  gender: Gender
  birthDate: string
  phoneNum: string
  preferredContactChannel: PreferredContactChannel
  inflowPathId: string
}

export interface InquiryInfo {
  serviceId: string
  userId: string
  inquiryStatus: InquiryStatus
  inquiredAt: string
  visitScheduledAt?: string
  rawText: string
}

export interface InquiryCreateRequest {
  customer: CustomerInfo
  inquiry: InquiryInfo
}

export interface InquiryCreateResponse {
  inquiryId: string
  redirectUrl: string
}

export type InquiryCheckPreviewResponse = Record<string, unknown>

export interface InquiryConvertToConsultationResponse {
  customerId: string
  consultationId: string
  sessionNo: number
  inquiryId: string
  inquiryStatus: InquiryStatus
  aiAnalysisStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  redirectUrl: string
}

export function createInquiry(req: InquiryCreateRequest, materials: File[] = []): Promise<InquiryCreateResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }))
  materials.forEach((file) => formData.append('materials', file))
  return request<InquiryCreateResponse>('/api/inquiries', { method: 'POST', body: formData })
}

export function checkInquiryPreview(req: InquiryCreateRequest): Promise<InquiryCheckPreviewResponse> {
  return request<InquiryCheckPreviewResponse>('/api/inquiries/check-preview', { method: 'POST', body: req })
}

export function convertInquiryToConsultation(inquiryId: string): Promise<InquiryConvertToConsultationResponse> {
  return request<InquiryConvertToConsultationResponse>(`/api/inquiries/${inquiryId}/convert-to-consultation`, {
    method: 'POST',
  })
}

export function deleteInquiry(inquiryId: string): Promise<void> {
  return request<void>(`/api/inquiries/${inquiryId}`, { method: 'DELETE' })
}
