import { request } from './client'

export interface AnalysisReportSummary {
  newRegistrationRate: number
  newConsultationCount: number
  newRegistrationCount: number
  nonRegisteredCount: number
}

export interface ServiceConsultationStat {
  serviceId: string
  serviceName: string
  consultedCustomerCount: number
  totalNewConsultationCount: number
  consultationRate: number
}

export interface RegistrationTrendPoint {
  month: string
  rate: number
  consultedCount: number
  registeredCount: number
}

export interface RegistrationTrendSeries {
  key: string
  name: string
  points: RegistrationTrendPoint[]
}

export interface RegistrationTrend {
  months: string[]
  selectedMonthRate: number
  previousMonthRate: number
  monthOverMonthChangePoint: number
  direction: string
  series: RegistrationTrendSeries[]
}

export interface InflowPathStat {
  inflowPathId: string
  inflowPathName: string
  newConsultationCompositionRate: number
  registeredCompositionRate: number
  newConsultationCount: number
  registeredCount: number
}

export interface AnalysisReportTotalResponse {
  month: string
  summary: AnalysisReportSummary
  serviceConsultations: ServiceConsultationStat[]
  registrationTrend: RegistrationTrend
  inflowPaths: InflowPathStat[]
}

export function getAnalysisReportTotal(month?: string): Promise<AnalysisReportTotalResponse> {
  return request<AnalysisReportTotalResponse>(`/api/analysis-report/total${month ? `?month=${encodeURIComponent(month)}` : ''}`)
}

// ---- 후속관리 탭 ----

export interface FollowUpRegistrationChange {
  beforeRate: number
  currentRate: number
  changePoint: number
}

export interface NonConversionReasonStat {
  reasonType: string
  displayName: string
  count: number
  rate: number
}

export interface AiRecommendation {
  title: string
  description: string
}

export interface ConversionRoundStat {
  contactRound: number
  registeredCount: number
  sentCount: number
  pendingCount: number
}

export interface ConversionGraph {
  /** 상담 후 등록보류로 후속관리에 진입한 인원 */
  initialNonRegisteredCount: number
  rounds: ConversionRoundStat[]
  /** 최종 등록 총합(즉시등록 + 각 차수 등록성사) */
  finalRegisteredCount: number
  /** 최종 미등록/이탈 */
  nonRegisteredOrLostCount: number
  /** 후속관리 거치지 않고 상담 직후 바로 등록된 인원(즉시등록) */
  unattributedRegisteredCount: number
}

/** /api/analysis-report/total의 summary(AnalysisReportSummary)와 필드가 다름 — 후속관리 탭 전용 요약 */
export interface FollowUpSummaryStats {
  targetCustomerCount: number
  pendingFollowUpCount: number
  completedFollowUpCount: number
  followUpRegistrationConversionRate: number
  registeredAfterFollowUpCount: number
}

export interface AnalysisReportFollowUpResponse {
  month: string
  summary: FollowUpSummaryStats
  registrationChange: FollowUpRegistrationChange
  conversionGraph: ConversionGraph
  nonConversionReasons: NonConversionReasonStat[]
  aiRecommendations: AiRecommendation[]
}

export function getAnalysisReportFollowUp(month?: string): Promise<AnalysisReportFollowUpResponse> {
  return request<AnalysisReportFollowUpResponse>(`/api/analysis-report/follow-up${month ? `?month=${encodeURIComponent(month)}` : ''}`)
}
