import { useEffect, useState } from 'react'
import { StatCards } from '../features/FollowUp/StatCards'
import { FollowUpFilterBar, type FollowUpFilters } from '../features/FollowUp/FollowUpFilterBar'
import { FollowUpBoard } from '../features/FollowUp/FollowUpBoard'
import { ContactTable } from '../features/FollowUp/ContactTable'
import type { FollowUpTab } from '../features/FollowUp/data'
import {
  getFollowUpSummary,
  getFollowUpBoard,
  getEndedFollowUps,
  updateFollowUpReply,
  type FollowUpSummaryResponse,
  type FollowUpBoardResponse,
  type FollowUpBoardColumn,
  type FollowUpBoardItem,
  type FollowUpEndedListResponse,
  type FollowUpEndedItem,
} from '../api/followUps'
import { markMessageTemplateSent } from '../api/consultationDetail'
import { ApiError } from '../api/client'
import { ConsultationDetailModal } from '../features/ConsultationDetail/ConsultationDetailModal'

const TAB_LABEL: Record<FollowUpTab, string> = {
  today: '오늘 연락',
  upcoming: '연락 예정',
  ended: '연락 종료',
}

const TAB_ORDER: FollowUpTab[] = ['today', 'upcoming', 'ended']

function formatMonth(monthIndex: number): string {
  const year = 2026 + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  return `${year}-${String(month).padStart(2, '0')}`
}

function currentMonthIndex(): number {
  const now = new Date()
  return (now.getFullYear() - 2026) * 12 + now.getMonth()
}

function monthDateRange(monthIndex: number): { startDate: string; endDate: string } {
  const year = 2026 + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { startDate, endDate }
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

function filterColumns(columns: FollowUpBoardColumn[], filters: FollowUpFilters): FollowUpBoardColumn[] {
  return columns.map((col) => ({
    ...col,
    items: col.items.filter((c) => {
      if (filters.keyword && !`${c.customerName}${c.phoneNum}${c.serviceName}`.includes(filters.keyword)) return false
      if (filters.gender && c.gender !== filters.gender) return false
      if (filters.service && c.serviceName !== filters.service) return false
      if (filters.reason && !c.nonConversionReasons.some((r) => r.reasonType === filters.reason)) return false
      if (filters.status && c.customerStatus !== filters.status) return false
      if (filters.temperature && c.leadTemperature !== filters.temperature) return false
      return true
    }),
  }))
}

function filterEndedItems(items: FollowUpEndedItem[], filters: FollowUpFilters): FollowUpEndedItem[] {
  return items.filter((c) => {
    if (filters.keyword && !`${c.customerName}${c.phoneNum}${c.serviceName}`.includes(filters.keyword)) return false
    if (filters.gender && c.gender !== filters.gender) return false
    if (filters.service && c.serviceName !== filters.service) return false
    if (filters.reason && !c.nonConversionReasons.some((r) => r.reasonType === filters.reason)) return false
    if (filters.status && c.customerStatus !== filters.status) return false
    return true
  })
}

export function FollowUpPage() {
  const [monthIndex, setMonthIndex] = useState(currentMonthIndex)
  const [tab, setTab] = useState<FollowUpTab>('upcoming')
  const [filters, setFilters] = useState<FollowUpFilters>({})
  const [refreshToken, setRefreshToken] = useState(0)

  const [summary, setSummary] = useState<FollowUpSummaryResponse | null>(null)
  const [board, setBoard] = useState<FollowUpBoardResponse | null>(null)
  const [ended, setEnded] = useState<FollowUpEndedListResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detailCustomer, setDetailCustomer] = useState<{ id: string; status: FollowUpBoardItem['customerStatus'] } | null>(null)

  const month = formatMonth(monthIndex)

  useEffect(() => {
    getFollowUpSummary(month)
      .then(setSummary)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '요약 정보를 불러오지 못했습니다.'))
  }, [month, refreshToken])

  useEffect(() => {
    if (tab === 'ended') return
    getFollowUpBoard({ tab: tab === 'today' ? 'TODAY' : 'SCHEDULED' })
      .then(setBoard)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '후속 연락 보드를 불러오지 못했습니다.'))
  }, [tab, refreshToken])

  useEffect(() => {
    if (tab !== 'ended') return
    const { startDate, endDate } = monthDateRange(monthIndex)
    getEndedFollowUps({ startDate, endDate })
      .then(setEnded)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '종료된 후속 연락 목록을 불러오지 못했습니다.'))
  }, [tab, monthIndex, refreshToken])

  function handleMarkReplied(followUpId: string) {
    updateFollowUpReply(followUpId, true)
      .then(() => setRefreshToken((v) => v + 1))
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '답장 유무 변경에 실패했습니다.'))
  }

  function handleMarkSent(messageTemplateId: string) {
    markMessageTemplateSent(messageTemplateId)
      .then(() => setRefreshToken((v) => v + 1))
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '전송 완료 처리에 실패했습니다.'))
  }

  function handleOpenDetail(customerId: string, customerStatus: FollowUpBoardItem['customerStatus']) {
    setDetailCustomer({ id: customerId, status: customerStatus })
  }

  const filteredColumns = board ? filterColumns(board.columns, filters) : []
  const filteredEnded = ended ? filterEndedItems(ended.items, filters) : []

  const serviceOptions = Array.from(
    new Set(tab === 'ended' ? (ended?.items ?? []).map((c) => c.serviceName) : filteredColumns.flatMap((col) => col.items.map((c) => c.serviceName))),
  )
  const reasonOptions = Array.from(
    new Set(
      (tab === 'ended' ? (ended?.items ?? []) : filteredColumns.flatMap((col) => col.items)).flatMap((c) =>
        c.nonConversionReasons.map((r) => r.reasonType),
      ),
    ),
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-subtitle-2 font-semibold text-gray-200">후속 연락 관리</h1>
        <MonthNav monthIndex={monthIndex} onChange={setMonthIndex} />
      </div>

      {error && <p className="text-caption-3 text-coral">{error}</p>}

      <StatCards summary={summary} />

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

      <FollowUpFilterBar filters={filters} onFiltersChange={setFilters} serviceOptions={serviceOptions} reasonOptions={reasonOptions} />

      {tab === 'ended' ? (
        <ContactTable contacts={filteredEnded} />
      ) : (
        <FollowUpBoard
          columns={filteredColumns}
          onMarkReplied={handleMarkReplied}
          onMarkSent={handleMarkSent}
          onOpenDetail={handleOpenDetail}
        />
      )}

      {detailCustomer && (
        <ConsultationDetailModal
          customerId={detailCustomer.id}
          initialStatus={detailCustomer.status}
          onClose={() => {
            setDetailCustomer(null)
            setRefreshToken((v) => v + 1)
          }}
          onUpdated={() => setRefreshToken((v) => v + 1)}
        />
      )}
    </div>
  )
}
