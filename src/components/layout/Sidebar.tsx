import { type MouseEvent, useState } from 'react'
import {
  icChartIdle,
  icChartSelected,
  icCommentIdle,
  icCommentSelected,
  icHomeIdle,
  icHomeSelected,
  icMessageIdle,
  icMessageSelected,
  icNoteIdle,
  icNoteSelected,
  icScheduleIdle,
  icScheduleSelected,
  icSettingsSelected,
  icProfileSelected,
  icLogoutSelected,
} from '../../assets/icons'
import logoUrl from '../../assets/logo/store_header_logo.png'
import logoIconUrl from '../../assets/logo/store-logo-icon.png'

export type Page = 'home' | 'scheduler' | 'clients' | 'followup' | 'analytics' | 'tasks'

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
  isOpen?: boolean
  onLogout?: () => void
  onExpandedChange?: (expanded: boolean) => void
}

const NAV_ITEMS: { page: Page; idle: string; selected: string; label: string }[] = [
  { page: 'home',      idle: icHomeIdle,     selected: icHomeSelected,     label: '홈' },
  { page: 'scheduler', idle: icScheduleIdle, selected: icScheduleSelected, label: '스케줄러' },
  { page: 'clients',   idle: icCommentIdle,  selected: icCommentSelected,  label: '상담고객관리' },
  { page: 'followup',  idle: icMessageIdle,  selected: icMessageSelected,  label: '후속 연락 관리' },
  { page: 'analytics', idle: icChartIdle,    selected: icChartSelected,    label: '분석리포트' },
  { page: 'tasks',     idle: icNoteIdle,     selected: icNoteSelected,     label: '할일목록' },
]

export function Sidebar({ activePage, onNavigate, isOpen = false, onLogout, onExpandedChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(false)

  function toggleExpanded() {
    setExpanded((v) => {
      const next = !v
      onExpandedChange?.(next)
      return next
    })
  }

  function stopToggle(e: MouseEvent) {
    e.stopPropagation()
  }

  return (
    <aside
      onClick={toggleExpanded}
      className={`fixed left-0 top-0 z-30 flex h-screen cursor-pointer flex-col bg-gray-800
        overflow-x-hidden transition-[width] duration-300 ${expanded ? 'w-[196px]' : 'w-[72px]'}
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div
        className={`flex h-[84px] shrink-0 items-center transition-all duration-300 ${
          expanded ? 'justify-start px-6' : 'justify-center px-4'
        }`}
      >
        <img src={logoIconUrl} alt="Fitback" className={`h-[22px] w-auto shrink-0 ${expanded ? 'hidden' : ''}`} />
        <img src={logoUrl} alt="Fitback" className={`h-[22px] w-auto shrink-0 ${expanded ? '' : 'hidden'}`} />
      </div>

      {/* Nav */}
      <nav className="scrollbar-thin flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ page, idle, selected, label }) => {
          const isActive = activePage === page
          return (
            <button
              key={page}
              onClick={(e) => {
                stopToggle(e)
                onNavigate(page)
              }}
              className={`flex w-full items-center gap-3 rounded-full px-4 py-3 tracking-tight transition-colors ${
                expanded ? 'justify-start' : 'justify-center'
              } ${isActive ? 'bg-lime/10 text-lime' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <img src={isActive ? selected : idle} alt="" aria-hidden className="h-5 w-5 shrink-0" />
              {expanded && <span className="whitespace-nowrap text-body-3">{label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-gray-600 px-3 pb-3 pt-3">
        {/* 설정 */}
        <button
          onClick={stopToggle}
          className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <img src={icSettingsSelected} alt="" aria-hidden className="h-5 w-5 shrink-0 brightness-0 invert" />
          {expanded && <span className="whitespace-nowrap text-caption-1">설정</span>}
        </button>

        {/* Profile */}
        <div className={`flex items-center gap-3 px-4 py-2 ${expanded ? 'justify-start' : 'justify-center'}`}>
          <img src={icProfileSelected} alt="" aria-hidden className="h-5 w-5 shrink-0 brightness-0 invert" />
          {expanded && (
            <div className="flex flex-col gap-0.5">
              <span className="whitespace-nowrap text-caption-2 font-medium text-gray-400">관리자</span>
              <span className="whitespace-nowrap font-en text-caption-2 leading-none text-gray-400">Sales Admin</span>
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        <button
          onClick={(e) => {
            stopToggle(e)
            onLogout?.()
          }}
          className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 ${
            expanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <img src={icLogoutSelected} alt="" aria-hidden className="h-5 w-5 shrink-0 brightness-0 invert" />
          {expanded && <span className="whitespace-nowrap text-caption-1 font-medium">로그아웃</span>}
        </button>
      </div>
    </aside>
  )
}
