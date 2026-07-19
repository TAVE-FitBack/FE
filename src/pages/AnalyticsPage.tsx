import { useState } from 'react'
import { GaugeCard } from '../features/Analytics/GaugeCard'
import { ServiceStatusCard } from '../features/Analytics/ServiceStatusCard'
import { TrendChart } from '../features/Analytics/TrendChart'
import { MonthlyBreakdownPanel } from '../features/Analytics/MonthlyBreakdownPanel'
import { ConversionRateCard } from '../features/Analytics/ConversionRateCard'
import { VisitPathBreakdownCard } from '../features/Analytics/VisitPathBreakdownCard'
import {
  CONVERSION_RATES,
  MONTH_OVER_MONTH_CHANGE,
  OVERALL_SUMMARY,
  SEPTEMBER_BREAKDOWN,
  SERVICE_CONSULT_STATUS,
  VISIT_PATH_ROWS,
  type AnalyticsTab,
} from '../features/Analytics/data'

const TAB_LABEL: Record<AnalyticsTab, string> = {
  all: '전체',
  followup: '후속관리',
}

const TAB_ORDER: AnalyticsTab[] = ['all', 'followup']

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

export function AnalyticsPage() {
  const [monthIndex, setMonthIndex] = useState(9)
  const [tab, setTab] = useState<AnalyticsTab>('all')

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

      {tab === 'followup' ? (
        <p className="py-16 text-center text-body-3 text-gray-500">후속관리 분석 디자인은 추후 제공될 예정입니다.</p>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[435fr_734fr] lg:items-start">
            <div className="flex flex-col gap-3">
              <GaugeCard
                registrationRate={OVERALL_SUMMARY.registrationRate}
                newConsultationCount={OVERALL_SUMMARY.newConsultationCount}
                newRegistrationCount={OVERALL_SUMMARY.newRegistrationCount}
                nonRegisteredCount={OVERALL_SUMMARY.nonRegisteredCount}
              />
              <ServiceStatusCard stats={SERVICE_CONSULT_STATUS} />
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-[28px] border border-gray-700 bg-gray-800 p-6 md:grid-cols-[1fr_200px]">
              <TrendChart />
              <MonthlyBreakdownPanel rows={SEPTEMBER_BREAKDOWN} momChange={MONTH_OVER_MONTH_CHANGE} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[435fr_734fr]">
            <ConversionRateCard rates={CONVERSION_RATES} />
            <VisitPathBreakdownCard rows={VISIT_PATH_ROWS} />
          </div>
        </div>
      )}
    </div>
  )
}
