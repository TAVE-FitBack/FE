interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[72px] shrink-0 items-center border-b border-gray-600 bg-gray-900/80 px-4 backdrop-blur-md lg:px-6">
      <button
        onClick={onMenuClick}
        className="flex flex-col gap-1.5 rounded-lg p-2 text-gray-400 hover:bg-white/5 lg:hidden"
        aria-label="메뉴 열기"
      >
        <span className="block h-0.5 w-5 bg-current" />
        <span className="block h-0.5 w-5 bg-current" />
        <span className="block h-0.5 w-5 bg-current" />
      </button>
    </header>
  )
}
