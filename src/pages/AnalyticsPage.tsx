import { useEffect, useState } from 'react'
import { GaugeCard } from '../features/Analytics/Total/GaugeCard'
import { ServiceStatusCard, type ServiceStat } from '../features/Analytics/Total/ServiceStatusCard'
import { TrendChart } from '../features/Analytics/Total/TrendChart'
import { MonthlyBreakdownPanel, type MonthlyBreakdownRow } from '../features/Analytics/Total/MonthlyBreakdownPanel'
import { ConversionRateCard, type ConversionRate } from '../features/Analytics/Total/ConversionRateCard'
import { VisitPathBreakdownCard, type VisitPathRow } from '../features/Analytics/Total/VisitPathBreakdownCard'
import {
  getAnalysisReportTotal,
  getAnalysisReportFollowUp,
  type AnalysisReportTotalResponse,
  type AnalysisReportFollowUpResponse,
} from '../api/analysisReport'
import { getServiceBarColor } from '../features/Analytics/Total/serviceColors'
import { FollowUpStatCards } from '../features/Analytics/FollowUp/FollowUpStatCards'
import { RegistrationChangeCard } from '../features/Analytics/FollowUp/RegistrationChangeCard'
import { NonConversionReasonsCard } from '../features/Analytics/FollowUp/NonConversionReasonsCard'
import { AiRecommendationsCard } from '../features/Analytics/FollowUp/AiRecommendationsCard'
import { ConversionFlowGraph } from '../features/Analytics/FollowUp/ConversionFlowGraph'
import { ApiError } from '../api/client'

type AnalyticsTab = 'all' | 'followup'

const TAB_LABEL: Record<AnalyticsTab, string> = {
  all: '전체',
  followup: '후속관리',
}

const TAB_ORDER: AnalyticsTab[] = ['all', 'followup']

function formatMonth(monthIndex: number): string {
  const year = 2026 + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  return `${year}-${String(month).padStart(2, '0')}`
}

function currentMonthIndex(): number {
  const now = new Date()
  return (now.getFullYear() - 2026) * 12 + now.getMonth()
}

function monthNumberOf(monthStr: string): number {
  return Number(monthStr.split('-')[1])
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

function MonthNav({ monthIndex, onChange }: { monthIndex: number; onChange: (next: number) => void }) {
  const year = 2026 + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1

  return (
    <div className="flex items-center gap-4 rounded-full bg-gray-800 p-1">
      <button
        type="button"
        onClick={() => onChange(monthIndex - 1)}
        aria-label="이전 달"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gray-800 text-gray-300 hover:bg-white/5"
      >
        <ChevronIcon direction="left" />
      </button>
      <span className="text-button-1 text-gray-100">
        {year}년 {month}월
      </span>
      <button
        type="button"
        onClick={() => onChange(monthIndex + 1)}
        aria-label="다음 달"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gray-800 text-gray-300 hover:bg-white/5"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  )
}

/** registrationTrend.series 중 "전체"를 찾음 — 서버가 표시 순서를 안 보장하니 이름으로 찾고, 못 찾으면 첫 번째 시리즈로 폴백 */
function findTotalSeriesKey(report: AnalysisReportTotalResponse): string {
  const total = report.registrationTrend.series.find((s) => s.name === '전체')
  return (total ?? report.registrationTrend.series[0])?.key ?? ''
}

export function AnalyticsPage() {
  const [monthIndex, setMonthIndex] = useState(currentMonthIndex)
  const [tab, setTab] = useState<AnalyticsTab>('all')
  const [report, setReport] = useState<AnalysisReportTotalResponse | null>(null)
  const [followUpReport, setFollowUpReport] = useState<AnalysisReportFollowUpResponse | null>(null)
  const [error, setError] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const month = formatMonth(monthIndex)

  useEffect(() => {
    getAnalysisReportTotal(month)
      .then((res) => {
        setReport(res)
        setActiveIndex(res.registrationTrend.months.length - 1)
      })
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '분석 리포트를 불러오지 못했습니다.'))
  }, [month])

  useEffect(() => {
    getAnalysisReportFollowUp(month)
      .then(setFollowUpReport)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '후속관리 분석 리포트를 불러오지 못했습니다.'))
  }, [month])

  const totalSeriesKey = report ? findTotalSeriesKey(report) : ''
  const totalSeries = report?.registrationTrend.series.find((s) => s.key === totalSeriesKey)

  const breakdownRows: MonthlyBreakdownRow[] = report
    ? report.registrationTrend.series.map((s) => {
        const point = s.points[activeIndex]
        return {
          key: s.key,
          label: s.key === totalSeriesKey ? `${monthNumberOf(point?.month ?? report.month)}월 전체` : s.name,
          percent: point?.rate ?? 0,
          count: point?.registeredCount ?? 0,
        }
      })
    : []

  const momChange =
    totalSeries && activeIndex > 0 ? totalSeries.points[activeIndex].rate - totalSeries.points[activeIndex - 1].rate : null

  const serviceStats: ServiceStat[] =
    report?.serviceConsultations.map((s) => ({
      key: s.serviceId,
      label: s.serviceName,
      registered: s.consultedCustomerCount,
      total: s.totalNewConsultationCount,
    })) ?? []

  const conversionRates: ConversionRate[] =
    report?.serviceConsultations.map((s, i) => ({
      key: s.serviceId,
      label: s.serviceName,
      percent: s.consultationRate,
      color: getServiceBarColor(s.serviceName, i),
    })) ?? []

  const visitPathRows: VisitPathRow[] =
    report?.inflowPaths.map((p) => ({
      label: p.inflowPathName,
      registeredRate: p.registeredCompositionRate,
      totalRate: p.newConsultationCompositionRate,
    })) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-subtitle-2 font-semibold text-gray-200">분석</h1>
        <MonthNav monthIndex={monthIndex} onChange={setMonthIndex} />
      </div>

      <div className="flex items-center border-b border-gray-700">
        {TAB_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative px-8 py-3 text-button-2 transition-colors ${
              tab === t ? 'text-lime' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {TAB_LABEL[t]}
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-lime" />}
          </button>
        ))}
      </div>

      {error && <p className="text-caption-3 text-coral">{error}</p>}

      {tab === 'followup' ? (
        !followUpReport ? (
          <p className="py-16 text-center text-body-3 text-gray-500">불러오는 중...</p>
        ) : (
          <div className="flex flex-col gap-3">
            <FollowUpStatCards
              totalCount={followUpReport.summary.targetCustomerCount}
              inProgressCount={followUpReport.summary.pendingFollowUpCount}
              completedCount={followUpReport.summary.completedFollowUpCount}
              successRate={followUpReport.summary.followUpRegistrationConversionRate}
            />

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[339fr_954fr]">
              <RegistrationChangeCard
                beforeRate={followUpReport.registrationChange.beforeRate}
                currentRate={followUpReport.registrationChange.currentRate}
              />
              <ConversionFlowGraph
                immediateRegistered={followUpReport.conversionGraph.unattributedRegisteredCount}
                pendingTotal={followUpReport.conversionGraph.initialNonRegisteredCount}
                rounds={followUpReport.conversionGraph.rounds}
                finalNonRegistered={followUpReport.conversionGraph.nonRegisteredOrLostCount}
                finalRegisteredTotal={followUpReport.conversionGraph.finalRegisteredCount}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[600fr_628fr]">
              <NonConversionReasonsCard reasons={followUpReport.nonConversionReasons} />
              <AiRecommendationsCard items={followUpReport.aiRecommendations} />
            </div>
          </div>
        )
      ) : !report ? (
        <p className="py-16 text-center text-body-3 text-gray-500">불러오는 중...</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[435fr_734fr]">
            <div className="flex h-full flex-col gap-3">
              <GaugeCard
                registrationRate={report.summary.newRegistrationRate}
                newConsultationCount={report.summary.newConsultationCount}
                newRegistrationCount={report.summary.newRegistrationCount}
                nonRegisteredCount={report.summary.nonRegisteredCount}
              />
              <div className="flex-1">
                <ServiceStatusCard stats={serviceStats} />
              </div>
            </div>

            <div className="grid h-full grid-cols-1 gap-3 rounded-[28px] border border-gray-700 bg-gray-800 p-6 md:grid-cols-[1fr_200px]">
              <TrendChart
                months={report.registrationTrend.months}
                series={report.registrationTrend.series}
                totalSeriesKey={totalSeriesKey}
                activeIndex={activeIndex}
                onActiveIndexChange={setActiveIndex}
              />
              <MonthlyBreakdownPanel rows={breakdownRows} momChange={momChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[435fr_734fr]">
            <ConversionRateCard rates={conversionRates} />
            <VisitPathBreakdownCard rows={visitPathRows} />
          </div>
        </div>
      )}
    </div>
  )
}
