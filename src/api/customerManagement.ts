import { request } from './client'

export type Gender = 'MALE' | 'FEMALE'

export interface ServiceInfo {
  serviceId: string
  name: string
}

export interface InflowPathInfo {
  inflowPathId: string
  name: string
  displayOrder: number
}

export interface CounselorInfo {
  userId: string
  name: string
}

export interface InquiryStatusInfo {
  status: InquiryStatus
  label: string
}

// ---- Summary ----

export interface ServiceConsultationRate {
  serviceId: string
  serviceName: string
  count: number
  rate: number
}

export interface InflowPathRate {
  inflowPathId: string
  inflowPathName: string
  count: number
  rate: number
}

export interface CustomerManagementSummaryResponse {
  month: string
  registrationRate: number
  newConsultationCount: number
  newRegistrationCount: number
  nonRegisteredCount: number
  serviceConsultationRates: ServiceConsultationRate[]
  inflowPathRates: InflowPathRate[]
}

export function getCustomerManagementSummary(month?: string): Promise<CustomerManagementSummaryResponse> {
  return request<CustomerManagementSummaryResponse>(`/api/customer-management/summary${buildQuery({ month })}`)
}

// ---- Inquiries (문의) ----

export type InquiryStatus = 'RECEIVED' | 'VISIT_SCHEDULED' | 'VISIT_CANCELED' | 'CONVERTED'
export type InquiryFilterStatus = 'RECEIVED' | 'VISIT_SCHEDULED' | 'VISIT_CANCELED'

export interface InquiryItem {
  inquiryId: string
  name: string
  phoneNum: string
  gender: Gender
  birthDate: string
  serviceId: string
  serviceName: string
  inflowPathId: string
  inflowPathName: string
  memo: string
  inquiryStatus: InquiryStatus
  inquiryStatusName: string
  inquiredAt: string
  visitScheduledAt: string | null
  counselorId: string
  counselorName: string
  converted: boolean
  convertedCustomerId: string | null
  convertedConsultationId: string | null
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}

export interface InquiryQueryParams {
  month?: string
  keyword?: string
  gender?: Gender
  serviceId?: string
  inflowPathId?: string
  inquiryStatus?: InquiryFilterStatus
  counselorId?: string
  page?: number
  size?: number
}

export function getInquiries(params: InquiryQueryParams = {}): Promise<PagedResponse<InquiryItem>> {
  return request<PagedResponse<InquiryItem>>(`/api/customer-management/inquiries${buildQuery(params)}`)
}

export interface InquiryNewResponse {
  services: ServiceInfo[]
  inflowPaths: InflowPathInfo[]
  counselors: CounselorInfo[]
  inquiryStatuses: InquiryStatusInfo[]
}

export function getInquiryFilterOptions(): Promise<InquiryNewResponse> {
  return request<InquiryNewResponse>('/api/inquiries/new')
}

// ---- Consultations (상담) ----

export type ManagementStage = 'CONSULTATION' | 'FIRST_FOLLOW_UP' | 'SECOND_FOLLOW_UP' | 'TRIAL' | 'FINAL_DECISION'
export type CustomerStatus = 'REGISTERED' | 'PENDING' | 'SCHEDULED' | 'LOST' | 'NO_SHOW'
export type LeadTemperature = 'HOT' | 'WARM' | 'HOLD' | 'COLD' | 'LOST'
export type FollowUpStageType = 'ROUND' | 'COMPLETED' | 'CLOSED' | 'NONE'
export type FollowUpFilterStage = 'ROUND_1' | 'ROUND_2' | 'ROUND_3' | 'COMPLETED' | 'CLOSED' | 'NONE'

export interface FollowUpManagementStageResponse {
  type: FollowUpStageType
  contactRound: number | null
  label: string
}

export interface NonConversionReasonInfo {
  reasonType: string
  role: string
  reasonBasis: string
  confidence: string
}

export interface ConsultationItem {
  customerId: string
  name: string
  phoneNum: string
  gender: Gender
  birthDate: string
  serviceId: string
  serviceName: string
  inflowPathId: string
  inflowPathName: string
  managementStage: ManagementStage
  followUpManagementStage: FollowUpManagementStageResponse
  latestMemo: string
  nonConversionReasons: NonConversionReasonInfo[]
  leadTemperature: string
  customerStatus: CustomerStatus
  latestConsultAt: string
  counselorId: string
  counselorName: string
}

export interface ConsultationQueryParams {
  month?: string
  keyword?: string
  gender?: Gender
  serviceId?: string
  inflowPathId?: string
  stage?: ManagementStage
  reasonType?: string
  status?: CustomerStatus
  leadTemperature?: LeadTemperature
  managementStage?: FollowUpFilterStage
  counselorId?: string
  page?: number
  size?: number
}

export function getConsultations(params: ConsultationQueryParams = {}): Promise<PagedResponse<ConsultationItem>> {
  return request<PagedResponse<ConsultationItem>>(`/api/customer-management/consultations${buildQuery(params)}`)
}

export interface ConsultationNewResponse {
  services: ServiceInfo[]
  inflowPaths: InflowPathInfo[]
  counselors: CounselorInfo[]
}

export function getConsultationFilterOptions(): Promise<ConsultationNewResponse> {
  return request<ConsultationNewResponse>('/api/consultations/new')
}

function buildQuery<T extends object>(params: T): string {
  const entries = Object.entries(params as Record<string, string | number | boolean | undefined>).filter(
    ([, v]) => v !== undefined && v !== '',
  )
  if (entries.length === 0) return ''
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))
  return `?${search.toString()}`
}
