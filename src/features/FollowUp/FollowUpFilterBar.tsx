import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useDropdown } from '../Clients/registrationFormControls'
import type { CustomerStatus, Gender } from '../../api/customerManagement'
import { GENDER_LABEL, GENDER_OPTIONS, STATUS_OPTIONS, TEMPERATURE_OPTIONS, CUSTOMER_STATUS_LABEL } from './data'

export interface FollowUpFilters {
  keyword?: string
  gender?: Gender
  service?: string
  reason?: string
  status?: CustomerStatus
  temperature?: string
}

interface FollowUpFilterBarProps {
  filters: FollowUpFilters
  onFiltersChange: (filters: FollowUpFilters) => void
  serviceOptions: string[]
  reasonOptions: string[]
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-gray-500">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  getLabel = (o: T) => o,
}: {
  label: string
  value: T | ''
  options: T[]
  onChange: (value: T | '') => void
  getLabel?: (option: T) => string
}) {
  const { open, setOpen, triggerRef, menuRef, rect } = useDropdown()
  const isActive = value !== ''

  function select(next: T | '') {
    onChange(next)
    setOpen(false)
  }

  return (
    <div ref={triggerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-8 items-center gap-1.5 whitespace-nowrap rounded-lg bg-gray-800 px-3 text-caption-3 outline-none ${
          isActive ? 'border border-lime text-lime' : 'border border-transparent text-gray-500 hover:text-gray-300'
        }`}
      >
        {isActive ? getLabel(value) : label}
        <ChevronDownIcon />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            data-popover-portal
            style={{ position: 'fixed', top: rect.top, left: rect.left }}
            className="z-[90] w-fit min-w-[86px] rounded-xl border border-gray-700 bg-gray-800 p-3"
          >
            <div className="flex max-h-72 flex-col overflow-y-auto">
              {options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => select(o)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-left text-body-3 text-gray-200 ${
                    value === o ? 'bg-gray-700/50' : 'hover:bg-gray-700/50'
                  }`}
                >
                  {getLabel(o)}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export function FollowUpFilterBar({ filters, onFiltersChange, serviceOptions, reasonOptions }: FollowUpFilterBarProps) {
  const [keywordInput, setKeywordInput] = useState(filters.keyword ?? '')

  function set<K extends keyof FollowUpFilters>(key: K, value: FollowUpFilters[K]) {
    onFiltersChange({ ...filters, [key]: value || undefined })
  }

  function handleKeywordCommit() {
    if (keywordInput !== (filters.keyword ?? '')) set('keyword', keywordInput)
  }

  function reset() {
    setKeywordInput('')
    onFiltersChange({})
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative h-9 w-[256px] shrink-0 overflow-hidden rounded-full bg-gray-800">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          <SearchIcon />
        </span>
        <input
          type="text"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          onBlur={handleKeywordCommit}
          onKeyDown={(e) => e.key === 'Enter' && handleKeywordCommit()}
          placeholder="고객명, 연락처, 상품명 입력"
          className="h-full w-full bg-transparent pl-9 pr-4 text-caption-3 text-gray-100 outline-none placeholder:text-gray-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            label="성별"
            value={filters.gender ?? ''}
            options={GENDER_OPTIONS}
            getLabel={(o) => GENDER_LABEL[o]}
            onChange={(v) => set('gender', v || undefined)}
          />
          <FilterDropdown label="종목" value={filters.service ?? ''} options={serviceOptions} onChange={(v) => set('service', v || undefined)} />
          <FilterDropdown label="미등록 사유" value={filters.reason ?? ''} options={reasonOptions} onChange={(v) => set('reason', v || undefined)} />
          <FilterDropdown
            label="상태"
            value={filters.status ?? ''}
            options={STATUS_OPTIONS}
            getLabel={(o) => CUSTOMER_STATUS_LABEL[o]}
            onChange={(v) => set('status', v || undefined)}
          />
          <FilterDropdown
            label="고객 온도"
            value={filters.temperature ?? ''}
            options={TEMPERATURE_OPTIONS}
            onChange={(v) => set('temperature', v || undefined)}
          />
        </div>

        <button type="button" onClick={reset} className="shrink-0 text-caption-3 text-gray-500 hover:text-gray-300">
          필터 초기화
        </button>
      </div>
    </div>
  )
}
