import { useEffect, useState } from 'react'
import { StatsSummary } from '../features/Clients/StatsSummary'
import { FilterBar, type ClientFilters } from '../features/Clients/FilterBar'
import { ClientTable } from '../features/Clients/ClientTable'
import { NewConsultationModal } from '../features/Clients/NewConsultationModal'
import { NewInquiryModal } from '../features/Clients/NewInquiryModal'
import { ConsultationDetailModal } from '../features/ConsultationDetail/ConsultationDetailModal'
import {
  getCustomerManagementSummary,
  getInquiries,
  getConsultations,
  getInquiryFilterOptions,
  getConsultationFilterOptions,
  type CustomerManagementSummaryResponse,
  type PagedResponse,
  type InquiryItem,
  type ConsultationItem,
  type InquiryNewResponse,
  type ConsultationNewResponse,
  type CustomerStatus,
} from '../api/customerManagement'
import { convertInquiryToConsultation, deleteInquiry } from '../api/inquiries'
import { ApiError } from '../api/client'

export type ClientTab = 'consult' | 'inquiry'

const TAB_LABEL: Record<ClientTab, string> = {
  consult: '상담',
  inquiry: '문의',
}

function formatMonth(monthIndex: number): string {
  const year = 2026 + Math.floor(monthIndex / 12)
  const month = (monthIndex % 12) + 1
  return `${year}-${String(month).padStart(2, '0')}`
}

function currentMonthIndex(): number {
  const now = new Date()
  return (now.getFullYear() - 2026) * 12 + now.getMonth()
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

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

const EMPTY_FILTERS: ClientFilters = {}

export function ClientsPage() {
  const [tab, setTab] = useState<ClientTab>('consult')
  const [monthIndex, setMonthIndex] = useState(currentMonthIndex)
  const [filters, setFilters] = useState<ClientFilters>(EMPTY_FILTERS)
  const [page, setPage] = useState(0)
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const [newEntryKey, setNewEntryKey] = useState(0)
  const [detailCustomer, setDetailCustomer] = useState<{ id: string; status: CustomerStatus } | null>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  const [summary, setSummary] = useState<CustomerManagementSummaryResponse | null>(null)
  const [consultData, setConsultData] = useState<PagedResponse<ConsultationItem> | null>(null)
  const [inquiryData, setInquiryData] = useState<PagedResponse<InquiryItem> | null>(null)
  const [consultOptions, setConsultOptions] = useState<ConsultationNewResponse | null>(null)
  const [inquiryOptions, setInquiryOptions] = useState<InquiryNewResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const month = formatMonth(monthIndex)

  function handleTabChange(next: ClientTab) {
    setTab(next)
    setFilters(EMPTY_FILTERS)
    setPage(0)
  }

  function handleMonthChange(next: number) {
    setMonthIndex(next)
    setPage(0)
  }

  function handleFiltersChange(next: ClientFilters) {
    setFilters(next)
    setPage(0)
  }

  function bumpRefresh() {
    setRefreshToken((v) => v + 1)
  }

  async function handleConvertInquiry(inquiryId: string) {
    try {
      await convertInquiryToConsultation(inquiryId)
      setTab('consult')
      setPage(0)
      bumpRefresh()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '상담으로 이동에 실패했습니다.')
    }
  }

  async function handleDeleteInquiry(inquiryId: string) {
    if (!window.confirm('이 문의를 삭제할까요?')) return
    try {
      await deleteInquiry(inquiryId)
      bumpRefresh()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : '문의 삭제에 실패했습니다.')
    }
  }

  useEffect(() => {
    getCustomerManagementSummary(month)
      .then(setSummary)
      .catch((e: Error) => setError(e.message))
  }, [month, refreshToken])

  useEffect(() => {
    if (tab !== 'consult' || consultOptions) return
    getConsultationFilterOptions()
      .then(setConsultOptions)
      .catch((e: Error) => setError(e.message))
  }, [tab, consultOptions])

  useEffect(() => {
    if (tab !== 'inquiry' || inquiryOptions) return
    getInquiryFilterOptions()
      .then(setInquiryOptions)
      .catch((e: Error) => setError(e.message))
  }, [tab, inquiryOptions])

  useEffect(() => {
    if (tab === 'consult') {
      getConsultations({
        month,
        keyword: filters.keyword,
        gender: filters.gender,
        serviceId: filters.serviceId,
        inflowPathId: filters.inflowPathId,
        stage: filters.stage,
        status: filters.status,
        leadTemperature: filters.leadTemperature,
        counselorId: filters.counselorId,
        page,
      })
        .then(setConsultData)
        .catch((e: Error) => setError(e.message))
    } else {
      getInquiries({
        month,
        keyword: filters.keyword,
        gender: filters.gender,
        serviceId: filters.serviceId,
        inflowPathId: filters.inflowPathId,
        inquiryStatus: filters.inquiryStatus,
        counselorId: filters.counselorId,
        page,
      })
        .then(setInquiryData)
        .catch((e: Error) => setError(e.message))
    }
  }, [tab, month, filters, page, refreshToken])

  const resultCount = tab === 'consult' ? (consultData?.totalElements ?? 0) : (inquiryData?.totalElements ?? 0)
  const filterOptions = tab === 'consult' ? consultOptions : inquiryOptions

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-subtitle-2 font-semibold text-gray-200">상담고객관리</h1>
        <MonthNav monthIndex={monthIndex} onChange={handleMonthChange} />
      </div>

      <StatsSummary summary={summary} />

      {error && <p className="text-caption-2 text-coral">{error}</p>}

      <div className="flex items-center justify-between">
        <div className="flex items-center border-b border-gray-700">
          {(['consult', 'inquiry'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTabChange(t)}
              className={`relative rounded-t-[10px] px-8 py-3 text-button-2 transition-colors ${
                tab === t ? 'text-lime' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {TAB_LABEL[t]}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-lime" />}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setNewEntryKey((k) => k + 1)
            setIsNewEntryOpen(true)
          }}
          className="flex h-9 items-center gap-2 rounded-full bg-lime px-5 text-button-3 font-medium text-gray-800"
        >
          <PlusIcon />
          신규 입력
        </button>
      </div>

      <FilterBar
        tab={tab}
        resultCount={resultCount}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        filterOptions={filterOptions}
      />

      <ClientTable
        tab={tab}
        consultRows={consultData?.content ?? []}
        inquiryRows={inquiryData?.content ?? []}
        onConvertInquiry={handleConvertInquiry}
        onDeleteInquiry={handleDeleteInquiry}
        onOpenConsultation={(id, status) => setDetailCustomer({ id, status })}
      />

      {detailCustomer && (
        <ConsultationDetailModal
          customerId={detailCustomer.id}
          initialStatus={detailCustomer.status}
          onClose={() => {
            setDetailCustomer(null)
            bumpRefresh()
          }}
          onUpdated={bumpRefresh}
        />
      )}

      <NewConsultationModal
        key={`consult-${newEntryKey}`}
        open={isNewEntryOpen && tab === 'consult'}
        onClose={() => {
          setIsNewEntryOpen(false)
          bumpRefresh()
        }}
        onCreated={bumpRefresh}
        filterOptions={consultOptions}
      />
      <NewInquiryModal
        key={`inquiry-${newEntryKey}`}
        open={isNewEntryOpen && tab === 'inquiry'}
        onClose={() => {
          setIsNewEntryOpen(false)
          bumpRefresh()
        }}
        onCreated={bumpRefresh}
        filterOptions={inquiryOptions}
      />
    </div>
  )
}
