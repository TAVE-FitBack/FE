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
} from '../../assets/icons'
import logoUrl from '../../assets/logo/header_logo.png'
import logoIconUrl from '../../assets/logo/logo-icon.png'

export type Page = 'home' | 'scheduler' | 'clients' | 'followup' | 'analytics' | 'tasks'

interface SidebarProps {
  activePage: Page
  onNavigate: (page: Page) => void
  isOpen?: boolean
  onLogout?: () => void
}

const NAV_ITEMS: { page: Page; idle: string; selected: string; label: string }[] = [
  { page: 'home',      idle: icHomeIdle,     selected: icHomeSelected,     label: '홈' },
  { page: 'scheduler', idle: icScheduleIdle, selected: icScheduleSelected, label: '스케줄러' },
  { page: 'clients',   idle: icCommentIdle,  selected: icCommentSelected,  label: '상담고객관리' },
  { page: 'followup',  idle: icMessageIdle,  selected: icMessageSelected,  label: '후속 연락 관리' },
  { page: 'analytics', idle: icChartIdle,    selected: icChartSelected,    label: '분석리포트' },
  { page: 'tasks',     idle: icNoteIdle,     selected: icNoteSelected,     label: '할일목록' },
]

export function Sidebar({ activePage, onNavigate, isOpen = false, onLogout }: SidebarProps) {
  return (
    <aside
      className={`group fixed left-0 top-0 z-30 flex h-screen flex-col bg-gray-800
        overflow-x-hidden transition-[width] duration-300 w-[72px] hover:w-[240px]
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Logo */}
      <div className="flex h-[84px] shrink-0 items-center justify-center px-4 transition-all duration-300 group-hover:justify-start group-hover:px-6">
        <img
          src={logoIconUrl}
          alt="Fitback"
          className="h-[22px] w-auto shrink-0 group-hover:hidden"
        />
        <img
          src={logoUrl}
          alt="Fitback"
          className="hidden h-[22px] w-auto shrink-0 group-hover:block"
        />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ page, idle, selected, label }) => {
          const isActive = activePage === page
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex w-full items-center gap-3 rounded-full px-4 py-3 tracking-tight transition-colors
                justify-center group-hover:justify-start ${
                isActive
                  ? 'bg-lime/10 text-lime'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <img src={isActive ? selected : idle} alt="" aria-hidden className="h-6 w-6 shrink-0" />
              <span className="whitespace-nowrap text-body-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {label}
              </span>
            </button>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="shrink-0 border-t border-gray-600 px-3 pb-3 pt-3">
        {/* 설정 */}
        <button className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 justify-center group-hover:justify-start">
          <span className="h-6 w-6 shrink-0" />
          <span className="whitespace-nowrap text-caption-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            설정
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 px-4 py-2 justify-center group-hover:justify-start">
          <span className="h-6 w-6 shrink-0" />
          <div className="flex flex-col gap-0.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <span className="whitespace-nowrap text-caption-2 font-medium text-gray-400">관리자</span>
            <span className="whitespace-nowrap font-en text-caption-2 leading-none text-gray-400">Sales Admin</span>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-gray-400 transition-colors hover:bg-white/5 justify-center group-hover:justify-start"
        >
          <span className="h-6 w-6 shrink-0" />
          <span className="whitespace-nowrap text-caption-1 font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            로그아웃
          </span>
        </button>
      </div>
    </aside>
  )
}
