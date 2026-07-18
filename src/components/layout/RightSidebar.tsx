interface RightSidebarProps {
  isOpen?: boolean
}

export function RightSidebar({ isOpen = false }: RightSidebarProps) {
  if (!isOpen) return null

  return (
    <aside className="sticky top-0 h-screen w-[calc(400/1440*100vw)] shrink-0 bg-gray-800 border-l border-gray-600" />
  )
}
