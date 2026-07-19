import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Gender } from '../../api/customerManagement'

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'FEMALE', label: '여성' },
  { value: 'MALE', label: '남성' },
]

export const AI_CHECK_ITEMS = ['관심 상품', '운동 목적', '운동 경험', '부상 이력', '고객 요청', '나의 응대', '특이사항']

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export const inputClass =
  'w-full rounded-full border border-gray-700 bg-gray-900 px-[25px] py-[11px] text-body-3 text-gray-100 outline-none placeholder:text-gray-600 focus:border-lime'

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-caption-3 font-medium text-gray-500">{children}</span>
}

export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  emptyLabel,
  compact = false,
}: {
  options: { value: T; label: string }[]
  value: T | ''
  onChange: (value: T) => void
  emptyLabel?: string
  compact?: boolean
}) {
  if (options.length === 0) {
    return <span className="text-caption-3 text-gray-600">{emptyLabel ?? '불러오는 중...'}</span>
  }
  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'flex-wrap'}`}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`flex h-11 items-center justify-center whitespace-nowrap rounded-full ${compact ? 'px-4' : 'px-6'} text-caption-3 font-medium text-gray-100 ${
            value === o.value ? 'border border-lime bg-lime-light/20' : 'bg-gray-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** Positions a portaled dropdown panel against a trigger element, tracking scroll/resize
 *  so it is never clipped by an ancestor's overflow (the modal itself scrolls). */
export function useDropdown() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    if (!open) return
    function updateRect() {
      if (!triggerRef.current) return
      const r = triggerRef.current.getBoundingClientRect()
      setRect({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    updateRect()
    window.addEventListener('scroll', updateRect, true)
    window.addEventListener('resize', updateRect)
    return () => {
      window.removeEventListener('scroll', updateRect, true)
      window.removeEventListener('resize', updateRect)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return { open, setOpen, triggerRef, menuRef, rect }
}

export function SelectField({
  placeholder,
  value,
  options,
  onChange,
}: {
  placeholder: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  const { open, setOpen, triggerRef, menuRef, rect } = useDropdown()
  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div ref={triggerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-full border border-gray-700 bg-gray-900 px-[25px] py-[11px] text-body-3 outline-none"
      >
        <span className={selectedLabel ? 'text-gray-100' : 'text-gray-600'}>{selectedLabel ?? placeholder}</span>
        <ChevronRightIcon className="rotate-90 text-gray-500" />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            data-popover-portal
            style={{ position: 'fixed', top: rect.top, left: rect.left, width: rect.width }}
            className="z-[90] rounded-[30px] border border-gray-700 bg-gray-900 p-5 shadow-lg"
          >
            <div className="flex max-h-60 flex-col overflow-y-auto">
              {options.length === 0 && <span className="px-3 py-2 text-caption-3 text-gray-600">옵션이 없습니다</span>}
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-body-3 text-gray-100 ${
                    value === o.value ? 'bg-gray-700/50' : 'hover:bg-gray-700/50'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function CalendarPanel({
  value,
  viewDate,
  onViewDateChange,
  onSelect,
  tone = 'default',
}: {
  value: string
  viewDate: Date
  onViewDateChange: (date: Date) => void
  onSelect: (dateStr: string) => void
  tone?: 'default' | 'flat'
}) {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const panelToneClass = tone === 'flat' ? 'bg-gray-750' : 'border border-gray-700 bg-gray-900'

  return (
    <div className={`w-[280px] rounded-2xl ${panelToneClass} p-4 shadow-lg`}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onViewDateChange(new Date(year, month - 1, 1))}
          className="text-gray-500 hover:text-gray-300"
          aria-label="이전 달"
        >
          <ChevronRightIcon className="rotate-180" />
        </button>
        <span className="text-caption-3 font-medium text-gray-200">
          {year}년 {month + 1}월
        </span>
        <button
          type="button"
          onClick={() => onViewDateChange(new Date(year, month + 1, 1))}
          className="text-gray-500 hover:text-gray-300"
          aria-label="다음 달"
        >
          <ChevronRightIcon />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-caption-2 text-gray-500">
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          const dateStr = day ? formatDate(new Date(year, month, day)) : null
          const isSelected = dateStr !== null && dateStr === value
          return (
            <button
              key={i}
              type="button"
              disabled={!day}
              onClick={() => dateStr && onSelect(dateStr)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-caption-3 ${
                !day ? '' : isSelected ? 'bg-lime text-gray-800' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {day ?? ''}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function formatBirthDateDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean)
  return parts.join('-')
}

export function DateField({
  value,
  onChange,
  className = '',
  paddingClassName = 'px-[25px]',
  tone = 'default',
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  paddingClassName?: string
  tone?: 'default' | 'flat'
}) {
  const triggerToneClass = tone === 'flat' ? 'bg-gray-750' : 'border border-gray-700 bg-gray-900'

  return (
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={(e) => onChange(formatBirthDateDigits(e.target.value))}
      placeholder="YYYYMMDD"
      maxLength={10}
      className={`w-full rounded-full ${triggerToneClass} ${paddingClassName} py-[11px] text-body-3 text-gray-100 outline-none placeholder:text-gray-600 focus:border-lime ${className}`}
    />
  )
}

function InlineDateTrigger({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { open, setOpen, triggerRef, menuRef, rect } = useDropdown()
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()))

  return (
    <div ref={triggerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-[110px] bg-transparent text-left text-body-3 outline-none ${value ? 'text-gray-100' : 'text-gray-600'}`}
      >
        {value || 'YYYY-MM-DD'}
      </button>

      {open &&
        rect &&
        createPortal(
          <div ref={menuRef} data-popover-portal style={{ position: 'fixed', top: rect.top + 4, left: rect.left }} className="z-[90]">
            <CalendarPanel
              value={value}
              viewDate={viewDate}
              onViewDateChange={setViewDate}
              onSelect={(d) => {
                onChange(d)
                setOpen(false)
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = String(Math.floor(i / 2)).padStart(2, '0')
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

function TimeDropdownTrigger({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { open, setOpen, triggerRef, menuRef, rect } = useDropdown()

  return (
    <div ref={triggerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-[70px] bg-transparent text-left text-body-3 outline-none ${value ? 'text-gray-100' : 'text-gray-600'}`}
      >
        {value || 'HH:MM'}
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            data-popover-portal
            style={{ position: 'fixed', top: rect.top + 4, left: rect.left }}
            className="z-[90] max-h-60 w-[120px] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-900 p-2 shadow-lg"
          >
            {TIME_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onChange(t)
                  setOpen(false)
                }}
                className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-body-3 text-gray-100 ${
                  value === t ? 'bg-gray-700/50' : 'hover:bg-gray-700/50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  )
}

/** Combined date+time pill: calendar icon + clickable date trigger + clickable time trigger. */
export function DateTimeField({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string
  time: string
  onDateChange: (value: string) => void
  onTimeChange: (value: string) => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-[25px] py-[11px]">
      <CalendarIcon className="shrink-0 text-gray-500" />
      <InlineDateTrigger value={date} onChange={onDateChange} />
      <TimeDropdownTrigger value={time} onChange={onTimeChange} />
    </div>
  )
}

export function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

export function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

export function CalendarIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function CheckCircleIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  )
}

export function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 5.9L20 10l-6.2 2.1L12 18l-1.8-5.9L4 10l6.2-2.1z" />
    </svg>
  )
}
