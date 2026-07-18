import { useEffect, useRef, useState } from 'react'
import type { ClientTab } from '../../pages/ClientsPage'
import type {
  ConsultationNewResponse,
  InquiryNewResponse,
  Gender,
  ManagementStage,
  CustomerStatus,
  LeadTemperature,
  InquiryFilterStatus,
} from '../../api/customerManagement'

export interface ClientFilters {
  keyword?: string
  gender?: Gender
  serviceId?: string
  inflowPathId?: string
  counselorId?: string
  stage?: ManagementStage
  status?: CustomerStatus
  leadTemperature?: LeadTemperature
  inquiryStatus?: InquiryFilterStatus
}

interface FilterBarProps {
  tab: ClientTab
  resultCount: number
  filters: ClientFilters
  onFiltersChange: (filters: ClientFilters) => void
  filterOptions: ConsultationNewResponse | InquiryNewResponse | null
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: '남성' },
  { value: 'FEMALE', label: '여성' },
]

const STAGE_OPTIONS: { value: ManagementStage; label: string }[] = [
  { value: 'CONSULTATION', label: '상담' },
  { value: 'FIRST_FOLLOW_UP', label: '1차 팔로업' },
  { value: 'SECOND_FOLLOW_UP', label: '2차 팔로업' },
  { value: 'TRIAL', label: '체험' },
  { value: 'FINAL_DECISION', label: '최종 결정' },
]

const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: 'REGISTERED', label: '등록 완료' },
  { value: 'SCHEDULED', label: '등록 예정' },
  { value: 'PENDING', label: '보류' },
  { value: 'NO_SHOW', label: '미방문/노쇼' },
  { value: 'LOST', label: '이탈' },
]

const TEMPERATURE_OPTIONS: { value: LeadTemperature; label: string }[] = [
  { value: 'HOT', label: '매우 높음' },
  { value: 'WARM', label: '높음' },
  { value: 'HOLD', label: '보통' },
  { value: 'COLD', label: '낮음' },
  { value: 'LOST', label: '이탈' },
]

export function FilterBar({ tab, resultCount, filters, onFiltersChange, filterOptions }: FilterBarProps) {
  const [keywordInput, setKeywordInput] = useState(filters.keyword ?? '')
  const [syncedKeyword, setSyncedKeyword] = useState(filters.keyword)

  if (filters.keyword !== syncedKeyword) {
    setSyncedKeyword(filters.keyword)
    setKeywordInput(filters.keyword ?? '')
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput !== (filters.keyword ?? '')) {
        onFiltersChange({ ...filters, keyword: keywordInput || undefined })
      }
    }, 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keywordInput])

  function set<K extends keyof ClientFilters>(key: K, value: ClientFilters[K]) {
    onFiltersChange({ ...filters, [key]: value || undefined })
  }

  function reset() {
    onFiltersChange({})
  }

  const services = filterOptions?.services ?? []
  const inflowPaths = filterOptions?.inflowPaths ?? []
  const counselors = filterOptions?.counselors ?? []
  const inquiryStatuses = tab === 'inquiry' ? ((filterOptions as InquiryNewResponse | null)?.inquiryStatuses ?? []) : []

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative h-9 w-[256px] shrink-0 overflow-hidden rounded-full bg-gray-800">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="고객명, 연락처, 상품명 입력"
          className="h-full w-full bg-transparent pl-9 pr-4 text-caption-3 text-gray-100 outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown label="성별" value={filters.gender ?? ''} options={GENDER_OPTIONS} onChange={(v) => set('gender', v as Gender)} />

          <FilterDropdown
            label="종목"
            value={filters.serviceId ?? ''}
            options={services.map((s) => ({ value: s.serviceId, label: s.name }))}
            onChange={(v) => set('serviceId', v)}
          />

          <FilterDropdown
            label={tab === 'consult' ? '방문경로' : '문의경로'}
            value={filters.inflowPathId ?? ''}
            options={inflowPaths.map((p) => ({ value: p.inflowPathId, label: p.name }))}
            onChange={(v) => set('inflowPathId', v)}
          />

          {tab === 'consult' && (
            <>
              <FilterDropdown
                label="관리단계"
                value={filters.stage ?? ''}
                options={STAGE_OPTIONS}
                onChange={(v) => set('stage', v as ManagementStage)}
              />

              <FilterDropdown
                label="등록상태"
                value={filters.status ?? ''}
                options={STATUS_OPTIONS}
                onChange={(v) => set('status', v as CustomerStatus)}
              />

              <FilterDropdown
                label="고객온도"
                value={filters.leadTemperature ?? ''}
                options={TEMPERATURE_OPTIONS}
                onChange={(v) => set('leadTemperature', v as LeadTemperature)}
              />
            </>
          )}

          {tab === 'inquiry' && (
            <FilterDropdown
              label="상태"
              value={filters.inquiryStatus ?? ''}
              options={inquiryStatuses.map((s) => ({ value: s.status, label: s.label }))}
              onChange={(v) => set('inquiryStatus', v as InquiryFilterStatus)}
            />
          )}

          <FilterDropdown
            label="담당자"
            value={filters.counselorId ?? ''}
            options={counselors.map((c) => ({ value: c.userId, label: c.name }))}
            onChange={(v) => set('counselorId', v)}
          />
        </div>

        <button type="button" onClick={reset} className="shrink-0 text-caption-3 text-gray-500 hover:text-gray-300">
          필터 초기화
        </button>
      </div>

      <span className="ml-auto shrink-0 text-caption-3 text-gray-500">검색 수 : {resultCount}</span>
    </div>
  )
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T | ''
  options: { value: T; label: string }[]
  onChange: (value: T | '') => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isActive = value !== ''

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function select(next: T | '') {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 items-center gap-2 rounded-lg bg-gray-800 px-3 text-caption-3 font-medium outline-none ${
          isActive ? 'border border-lime text-lime' : 'border border-transparent text-gray-500 hover:bg-gray-700'
        }`}
      >
        {label}
        <ChevronDownIcon className={isActive ? 'text-lime' : 'text-gray-500'} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-10 min-w-[140px] overflow-hidden rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-lg">
          <button
            type="button"
            onClick={() => select('')}
            className={`block w-full whitespace-nowrap px-3 py-2 text-left text-caption-3 hover:bg-gray-700 ${
              value === '' ? 'text-lime' : 'text-gray-300'
            }`}
          >
            전체
          </button>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => select(o.value)}
              className={`block w-full whitespace-nowrap px-3 py-2 text-left text-caption-3 hover:bg-gray-700 ${
                value === o.value ? 'text-lime' : 'text-gray-300'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ChevronDownIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
