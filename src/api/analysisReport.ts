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
