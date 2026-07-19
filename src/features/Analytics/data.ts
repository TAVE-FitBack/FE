export type AnalyticsTab = 'all' | 'followup'

export const MONTH_LABELS = ['5월', '6월', '7월', '8월', '9월', '10월']

export type SeriesKey = 'total' | 'pt' | 'gym' | 'spinning'

export const SERIES_LABEL: Record<SeriesKey, string> = {
  total: '전체',
  pt: 'PT',
  gym: '헬스권',
  spinning: '스피닝',
}

export const SERIES_COLOR: Record<SeriesKey, string> = {
  total: 'var(--color-lime)',
  pt: 'var(--color-coral)',
  gym: 'var(--color-blue)',
  spinning: 'var(--color-gray-500)',
}

// 목업 데이터 — 실제 분석 API가 나오면 이 파일을 교체합니다.
export const TREND_DATA: Record<SeriesKey, number[]> = {
  total: [45, 58, 40, 50, 55, 60],
  pt: [40, 62, 35, 33, 45, 52],
  gym: [38, 45, 35, 33, 50, 53],
  spinning: [35, 40, 28, 25, 35, 40],
}

export const OVERALL_SUMMARY = {
  registrationRate: 60,
  newConsultationCount: 81,
  newRegistrationCount: 47,
  nonRegisteredCount: 34,
}

export interface ServiceStat {
  key: SeriesKey
  label: string
  registered: number
  total: number
}

export const SERVICE_CONSULT_STATUS: ServiceStat[] = [
  { key: 'pt', label: 'PT', registered: 21, total: 55 },
  { key: 'gym', label: '헬스권', registered: 21, total: 55 },
  { key: 'spinning', label: '스피닝', registered: 21, total: 55 },
]

export interface ConversionRate {
  key: SeriesKey
  label: string
  percent: number
  registered: number
  consulted: number
  color: 'coral' | 'lime' | 'blue'
}

export const CONVERSION_RATES: ConversionRate[] = [
  { key: 'pt', label: 'PT', percent: 60, registered: 21, consulted: 30, color: 'coral' },
  { key: 'spinning', label: '스피닝', percent: 17, registered: 3, consulted: 8, color: 'lime' },
  { key: 'gym', label: '헬스권', percent: 23, registered: 21, consulted: 40, color: 'blue' },
]

export interface MonthlyBreakdownRow {
  key: SeriesKey
  label: string
  percent: number
  count: number
}

export const SEPTEMBER_BREAKDOWN: MonthlyBreakdownRow[] = [
  { key: 'total', label: '9월 전체', percent: 60, count: 47 },
  { key: 'pt', label: 'PT', percent: 70, count: 6 },
  { key: 'gym', label: '헬스권', percent: 40, count: 8 },
  { key: 'spinning', label: '스피닝', percent: 23, count: 2 },
]

export const MONTH_OVER_MONTH_CHANGE = 13

export interface VisitPathRow {
  label: string
  registeredRate: number
  totalRate: number
}

export const VISIT_PATH_ROWS: VisitPathRow[] = [
  { label: '워크인', registeredRate: 80, totalRate: 80 },
  { label: '전화', registeredRate: 80, totalRate: 80 },
  { label: '네이버예약', registeredRate: 80, totalRate: 80 },
  { label: '네이버톡톡', registeredRate: 80, totalRate: 80 },
  { label: '지인소개', registeredRate: 80, totalRate: 80 },
  { label: '인스타', registeredRate: 80, totalRate: 80 },
  { label: '기타', registeredRate: 80, totalRate: 80 },
]
