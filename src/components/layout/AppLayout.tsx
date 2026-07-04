import { type ReactNode, useState } from 'react'
import { Sidebar, type Page } from './Sidebar'
import { RightSidebar } from './RightSidebar'
import { Header } from './Header'

export type { Page }

interface AppLayoutProps {
  activePage: Page
  onNavigate: (page: Page) => void
  onLogout?: () => void
  children?: ReactNode
}

export function AppLayout({ activePage, onNavigate, onLogout, children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={(page) => { onNavigate(page); setSidebarOpen(false) }}
        isOpen={sidebarOpen}
        onLogout={onLogout}
      />

      <div className="flex min-h-screen lg:ml-[72px]">
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 p-4 lg:p-8">{children}</main>
        </div>
        <RightSidebar />
      </div>
    </div>
  )
}
