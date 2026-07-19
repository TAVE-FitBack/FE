import { request } from './client'
import type { CustomerStatus, Gender, NonConversionReasonInfo } from './customerManagement'

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'CLOSED' | 'SUPERSEDED'
export type FollowUpBoardTab = 'TODAY' | 'SCHEDULED'
export type FollowUpEndedStatus = 'COMPLETED' | 'CLOSED'

// ---- Summary ----

export interface FollowUpSummaryResponse {
  todayPendingCount: number
  secondRoundPendingCount: number
  overdueCount: number
  thisMonthPendingCount: number
}

export function getFollowUpSummary(month?: string): Promise<FollowUpSummaryResponse> {
  return request<FollowUpSummaryResponse>(`/api/follow-ups/summary${buildQuery({ month })}`)
}

// ---- Board (오늘 연락 / 연락 예정) ----

export interface FollowUpBoardItem {
  followUpId: string
  customerId: string
  customerName: string
  phoneNum: string
  gender: Gender
  serviceName: string
  customerStatus: CustomerStatus
  followUpStatus: FollowUpStatus
  contactRound: number
  recommendContactDate: string
  memo: string
  hasReply: boolean
  repliedAt: string | null
  leadTemperature: string
  priorityScore: number
  nonConversionReasons: NonConversionReasonInfo[]
  nextBestActionTitle: string | null
  nextBestActionDescription: string | null
  latestMessageTemplateId: string | null
  latestMessageDeliveryStatus: string | null
  latestMessageGeneratedAt: string | null
}

export interface FollowUpBoardColumn {
  contactRound: number
  title: string
  count: number
  items: FollowUpBoardItem[]
}

export interface FollowUpBoardResponse {
  tab: FollowUpBoardTab
  baseDate: string
  columns: FollowUpBoardColumn[]
}

export interface FollowUpBoardQueryParams {
  tab: FollowUpBoardTab
  keyword?: string
  hasReply?: boolean
  contactRound?: number
}

export function getFollowUpBoard(params: FollowUpBoardQueryParams): Promise<FollowUpBoardResponse> {
  return request<FollowUpBoardResponse>(`/api/follow-ups/board${buildQuery(params)}`)
}

// ---- Ended (연락 종료) ----

export interface FollowUpEndedItem {
  followUpId: string
  customerId: string
  customerName: string
  phoneNum: string
  gender: Gender
  serviceName: string
  customerStatus: CustomerStatus
  followUpStatus: FollowUpStatus
  contactRound: number
  hasReply: boolean
  repliedAt: string | null
  latestMessageTemplateId: string | null
  latestMessageDeliveryStatus: string | null
  latestContactAt: string | null
  memo: string
  nonConversionReasons: NonConversionReasonInfo[]
  followUpCompleted: boolean
}

export interface FollowUpEndedListResponse {
  items: FollowUpEndedItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface FollowUpEndedQueryParams {
  keyword?: string
  followUpStatus?: FollowUpEndedStatus
  contactRound?: number
  hasReply?: boolean
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}

export function getEndedFollowUps(params: FollowUpEndedQueryParams = {}): Promise<FollowUpEndedListResponse> {
  return request<FollowUpEndedListResponse>(`/api/follow-ups/ended${buildQuery(params)}`)
}

// ---- Reply status ----

export interface FollowUpReplyUpdateResponse {
  followUpId: string
  hasReply: boolean
  repliedAt: string | null
}

export function updateFollowUpReply(followUpId: string, hasReply: boolean): Promise<FollowUpReplyUpdateResponse> {
  return request<FollowUpReplyUpdateResponse>(`/api/follow-ups/${followUpId}/reply`, {
    method: 'PATCH',
    body: { hasReply },
  })
}

function buildQuery<T extends object>(params: T): string {
  const entries = Object.entries(params as Record<string, string | number | boolean | undefined>).filter(
    ([, v]) => v !== undefined && v !== '',
  )
  if (entries.length === 0) return ''
  const search = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]))
  return `?${search.toString()}`
}
