import { useState } from 'react'
import { StatCards } from '../features/FollowUp/StatCards'
import { FollowUpFilterBar, type FollowUpFilters } from '../features/FollowUp/FollowUpFilterBar'
import { FollowUpBoard } from '../features/FollowUp/FollowUpBoard'
import { ContactTable } from '../features/FollowUp/ContactTable'
import { MOCK_CONTACTS, type FollowUpTab } from '../features/FollowUp/data'

const TAB_LABEL: Record<FollowUpTab, string> = {
  today: '오늘 연락',
  upcoming: '연락 예정',
  ended: '연락 종료',
}

const TAB_ORDER: FollowUpTab[] = ['today', 'upcoming', 'ended']

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

export function FollowUpPage() {
  const [monthIndex, setMonthIndex] = useState(9)
  const [tab, setTab] = useState<FollowUpTab>('upcoming')
  const [filters, setFilters] = useState<FollowUpFilters>({})
  const [contacts, setContacts] = useState(MOCK_CONTACTS)

  function handleSendContact(id: string) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, contactStatus: 'SENT' } : c)))
  }

  function handleMarkReplied(id: string) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, replyStatus: 'REPLIED' } : c)))
  }

  const filtered = contacts.filter((c) => {
    if (c.tab !== tab) return false
    if (filters.keyword && !`${c.name}${c.phone}${c.service}`.includes(filters.keyword)) return false
    if (filters.gender && c.gender !== filters.gender) return false
    if (filters.service && c.service !== filters.service) return false
    if (filters.reason && !c.reasons.includes(filters.reason)) return false
    if (filters.status && (tab === 'ended' ? c.registrationStatus : c.visitBadge) !== filters.status) return false
    if (filters.temperature && c.temperature !== filters.temperature) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-subtitle-2 font-semibold text-gray-200">후속 연락 관리</h1>
        <MonthNav monthIndex={monthIndex} onChange={setMonthIndex} />
      </div>

      <StatCards />

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

      <FollowUpFilterBar filters={filters} onFiltersChange={setFilters} />

      {tab === 'ended' ? (
        <ContactTable contacts={filtered} />
      ) : (
        <FollowUpBoard contacts={filtered} onSendContact={handleSendContact} onMarkReplied={handleMarkReplied} />
      )}
    </div>
  )
}
