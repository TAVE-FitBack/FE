import { request } from './client'
import type { CustomerInfo } from './inquiries'
import type { ManagementStage, NonConversionReasonInfo } from './customerManagement'
import type { AiCheckPreview, AiCheckPreviewKey } from './aiCheckPreview'

// ---- GET /api/customers/{customerId}/detail ----

export interface LatestConsultation {
  consultationId: string
  sessionNo: number
  consultedAt: string
  consultedServiceId: string
  consultedServiceName: string
  userId: string
  counselorName: string
  stage: ManagementStage
  sourceType: 'DIRECT' | 'IMPORT' | 'INQUIRY'
  rawText: string
  summary: string
}

export interface AiInsight {
  leadTemperature: string
  temperatureBasis: string
  priorityScore: number
  analyzedAt: string
}

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'CLOSED' | 'SUPERSEDED'

export interface ActiveFollowUp {
  followUpId: string
  consultationId: string
  recommendContactDate: string
  status: FollowUpStatus
  memo: string
}

export interface NextBestAction {
  title: string
  description: string
  persuasionPoint: unknown
  cautionNote: string
  actionBasis: unknown
}

export interface LatestMessageTemplate {
  messageTemplateId: string
  content: string
  tonePreset: string
  versionType: string
  deliveryStatus: string
  generatedAt: string
}

export type TimelineActivityType =
  | 'CONSULTATION_CREATED'
  | 'RECONSULTATION_CREATED'
  | 'INQUIRY_CONVERTED_TO_CONSULTATION'
  | 'AI_ANALYSIS_COMPLETED'
  | 'AI_ANALYSIS_FAILED'
  | 'AI_ANALYSIS_MANUALLY_UPDATED'
  | 'NEXT_ACTION_CREATED'
  | 'NEXT_ACTION_REGENERATED'
  | 'CUSTOMER_STATUS_CHANGED'
  | 'FOLLOW_UP_CREATED'
  | 'MESSAGE_TEMPLATE_CREATED'
  | 'MESSAGE_TEMPLATE_COPIED'
  | 'MESSAGE_SENT'
  | 'FOLLOW_UP_COMPLETED'

interface TimelineDetailBase {
  heading: string
  body: string
  editable: boolean
  editTargetType?: string
  editTargetId?: string
}

export interface ConsultationTimelineDetail extends TimelineDetailBase {
  type: 'CONSULTATION'
  consultationId?: string
  sessionNo?: number
  consultedAt?: string
  consultedServiceId?: string
  consultedServiceName?: string
  counselorId?: string
  counselorName?: string
  sourceType?: string
  stage?: string
}

export interface MessageTemplateTimelineDetail extends TimelineDetailBase {
  type: 'MESSAGE_TEMPLATE'
  messageTemplateId?: string
  followUpId?: string
  tonePreset?: string
  versionType?: string
  deliveryStatus?: string
  generatedAt?: string
  sentAt?: string | null
}

export interface AiAnalysisTimelineDetail extends TimelineDetailBase {
  type: 'AI_ANALYSIS'
  consultationId?: string
  summary?: string
  leadTemperature?: string
  temperatureBasis?: string
  priorityScore?: number
  primaryReasonType?: string
  nonConversionReasons?: NonConversionReasonInfo[]
  nextBestAction?: { title: string; description: string }
  followUpId?: string
  status?: string
  errorCode?: string | null
}

export interface FollowUpTimelineDetail extends TimelineDetailBase {
  type: 'FOLLOW_UP'
  followUpId?: string
  consultationId?: string
  recommendContactDate?: string
  status?: string
  contactRound?: number
  memo?: string
  nextActionTitle?: string
  nextActionDescription?: string
  persuasionPoint?: unknown
  cautionNote?: string
  actionBasis?: unknown
}

export interface StatusChangeTimelineDetail extends TimelineDetailBase {
  type: 'STATUS_CHANGE'
  beforeStatus?: string
  afterStatus?: string
  followUpAction?: string
}

export interface InquiryConversionTimelineDetail extends TimelineDetailBase {
  type: 'INQUIRY_CONVERSION'
  inquiryId?: string
  customerId?: string
  consultationId?: string
  sessionNo?: number
  newCustomerCreated?: boolean
}

export type TimelineDetail =
  | ConsultationTimelineDetail
  | MessageTemplateTimelineDetail
  | AiAnalysisTimelineDetail
  | FollowUpTimelineDetail
  | StatusChangeTimelineDetail
  | InquiryConversionTimelineDetail

export interface TimelineItem {
  timelineId: string
  activityType: TimelineActivityType
  title: string
  description: string
  summary: string
  relatedType: 'CUSTOMER' | 'CONSULTATION' | 'INQUIRY' | 'FOLLOW_UP' | 'MESSAGE_TEMPLATE'
  relatedId: string
  beforeValue?: Record<string, unknown>
  afterValue?: Record<string, unknown>
  occurredAt: string
  detail?: TimelineDetail
}

export interface ConsultationSignalItem {
  key: AiCheckPreviewKey
  label: string
  confirmed: boolean
  value?: string
}

export interface ConsultationSignalSnapshot {
  consultationId: string
  items: ConsultationSignalItem[]
}

export interface CustomerDetailResponse {
  customer: CustomerInfo
  latestConsultation: LatestConsultation | null
  aiAnalysisStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED'
  aiInsight: AiInsight | null
  nonConversionReasons: NonConversionReasonInfo[]
  activeFollowUp: ActiveFollowUp | null
  nextBestAction: NextBestAction | null
  latestMessageTemplate: LatestMessageTemplate | null
  timeline: TimelineItem[]
  consultationSignalSnapshot?: ConsultationSignalSnapshot
}

export function getConsultationDetail(customerId: string): Promise<CustomerDetailResponse> {
  return request<CustomerDetailResponse>(`/api/customers/${customerId}/detail`)
}

// ---- PATCH /api/customers/{customerId}/status ----

export type ReconsultationStatus = 'REGISTERED' | 'PENDING' | 'SCHEDULED' | 'LOST'
export type CustomerDetailStatus = ReconsultationStatus | 'NO_SHOW'

export interface CustomerStatusUpdateRequest {
  status: CustomerDetailStatus
  registeredServiceId?: string
}

export interface CustomerStatusUpdateResponse {
  customerId: string
  status: CustomerDetailStatus
  followUpAction: string
  nextActionRegenerationAvailable: boolean
}

export function updateConsultationStatus(
  customerId: string,
  req: CustomerStatusUpdateRequest,
): Promise<CustomerStatusUpdateResponse> {
  return request<CustomerStatusUpdateResponse>(`/api/customers/${customerId}/status`, { method: 'PATCH', body: req })
}

// ---- POST /api/customers/{customerId}/next-action/regenerate ----

export interface NextActionRegenerateRequest {
  reason?: string
}

export interface NextActionRegenerateResponse {
  customerId: string
  oldFollowUpId: string
  oldFollowUpStatus: FollowUpStatus
  newFollowUpId: string
  newFollowUpStatus: FollowUpStatus
  contactRound: number
  recommendContactDate: string
  priorityScore: number
}

export function regenerateNextAction(
  customerId: string,
  req: NextActionRegenerateRequest = {},
): Promise<NextActionRegenerateResponse> {
  return request<NextActionRegenerateResponse>(`/api/customers/${customerId}/next-action/regenerate`, { method: 'POST', body: req })
}

// ---- GET /api/customers/{customerId}/message-template/options ----

export type MessageTone = 'FRIENDLY' | 'PROFESSIONAL' | 'SOFT'
export type MessageVersionType = 'SHORT' | 'STANDARD'

export interface TonePresetOption {
  tonePreset: MessageTone
  label: string
}

export interface VersionTypeOption {
  versionType: MessageVersionType
  label: string
}

export interface EventOption {
  eventId: string
  title: string
  eventType: string
  description: string
  discountRate: number
  startDate: string
  endDate: string
}

export interface MessageTemplateOptionsResponse {
  tonePresets: TonePresetOption[]
  versionTypes: VersionTypeOption[]
  events: EventOption[]
}

export function getMessageTemplateOptions(customerId: string): Promise<MessageTemplateOptionsResponse> {
  return request<MessageTemplateOptionsResponse>(`/api/customers/${customerId}/message-template/options`)
}

// ---- POST /api/customers/{customerId}/message-templates ----

export interface MessageTemplateCreateRequest {
  followUpId: string
  tonePreset: MessageTone
  versionType: MessageVersionType
  eventId?: string
  additionalInstruction?: string
}

export interface MessageTemplateCreateResponse {
  messageTemplateId: string
  customerId: string
  followUpId: string
  content: string
  versionType: MessageVersionType
  tonePreset: MessageTone
  deliveryStatus: 'DRAFT' | 'SENT'
  generatedAt: string
}

export function generateMessageDraft(
  customerId: string,
  req: MessageTemplateCreateRequest,
): Promise<MessageTemplateCreateResponse> {
  return request<MessageTemplateCreateResponse>(`/api/customers/${customerId}/message-templates`, { method: 'POST', body: req })
}

// ---- POST /api/message-templates/{messageTemplateId}/mark-sent ----

export interface MessageTemplateMarkSentResponse {
  messageTemplateId: string
  deliveryStatus: 'DRAFT' | 'SENT'
  sentAt: string
  followUpId: string
  followUpStatus: FollowUpStatus
  contactRound: number
}

export function markMessageTemplateSent(messageTemplateId: string, sentAt?: string): Promise<MessageTemplateMarkSentResponse> {
  return request<MessageTemplateMarkSentResponse>(`/api/message-templates/${messageTemplateId}/mark-sent`, {
    method: 'POST',
    body: sentAt ? { sentAt } : {},
  })
}

// ---- POST /api/customers/{customerId}/consultations (재상담 등록) ----

export interface ReconsultationInfo {
  consultedServiceId: string
  consultedAt: string
  userId: string
  rawText: string
}

export interface ReconsultationCreateRequest {
  consultation: ReconsultationInfo
  registrationStatus: ReconsultationStatus
  registeredServiceId?: string
  aiCheckPreview?: AiCheckPreview
}

export interface ReconsultationCreateResponse {
  customerId: string
  consultationId: string
  sessionNo: number
  registrationStatus: ReconsultationStatus
  registeredServiceId?: string
  followUpAction: string
  followUpConversionCreated: boolean
  aiAnalysisStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED'
}

export type ReconsultationCheckPreviewResponse = AiCheckPreview

export function checkReconsultationPreview(
  customerId: string,
  consultation: ReconsultationInfo,
): Promise<ReconsultationCheckPreviewResponse> {
  return request<ReconsultationCheckPreviewResponse>(`/api/customers/${customerId}/consultations/check-preview`, {
    method: 'POST',
    body: { consultation },
  })
}

/** materials: 상담 자료 첨부 — .txt만 허용, 최대 3개, 파일당 1MB 이하 (AI 중간점검엔 첨부되지 않음) */
export function createReconsultation(
  customerId: string,
  req: ReconsultationCreateRequest,
  materials: File[] = [],
): Promise<ReconsultationCreateResponse> {
  const formData = new FormData()
  formData.append('request', new Blob([JSON.stringify(req)], { type: 'application/json' }))
  for (const file of materials) {
    formData.append('materials', file)
  }
  return request<ReconsultationCreateResponse>(`/api/customers/${customerId}/consultations`, { method: 'POST', body: formData })
}
