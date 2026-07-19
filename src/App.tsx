import { useState } from 'react'
import { AppLayout, type Page } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ClientsPage } from './pages/ClientsPage'
import { SchedulerPage } from './pages/SchedulerPage'
import { FollowUpPage } from './pages/FollowUpPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { StoreSetupFlow } from './features/Store/StoreSetupFlow'
import { logout } from './api/auth'
import { EmailVerifyCallbackScreen } from './features/Auth/EmailVerifyCallback'
import { useEmailVerifyCallback } from './features/Auth/useEmailVerifyCallback'

function renderPage(page: Page) {
  switch (page) {
    case 'scheduler':
      return <SchedulerPage />
    case 'clients':
      return <ClientsPage />
    case 'followup':
      return <FollowUpPage />
    case 'analytics':
      return <AnalyticsPage />
    default:
      return null
  }
}

type AuthState = { status: 'loggedOut' } | { status: 'needsStoreSetup' } | { status: 'loggedIn' }

// TEMP: 서버 다운 시 로그인/매장설정을 건너뛰기 위한 개발용 우회. .env에서
// VITE_SKIP_AUTH=true 를 지우면(또는 false로 두면) 즉시 원래 흐름으로 롤백됨.
// import.meta.env.DEV 가드가 있어 프로덕션 빌드에서는 절대 활성화되지 않음.
const SKIP_AUTH = import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true'

function App() {
  const [authState, setAuthState] = useState<AuthState>(SKIP_AUTH ? { status: 'loggedIn' } : { status: 'loggedOut' })
  const [activePage, setActivePage] = useState<Page>(SKIP_AUTH ? 'scheduler' : 'clients')
  const { status: emailVerifyStatus, token: emailVerifyToken } = useEmailVerifyCallback()

  function handleLogin(storeId: string) {
    setAuthState(storeId ? { status: 'loggedIn' } : { status: 'needsStoreSetup' })
  }

  function handleLogout() {
    logout().finally(() => setAuthState({ status: 'loggedOut' }))
  }

  if (emailVerifyStatus !== 'idle') {
    return <EmailVerifyCallbackScreen status={emailVerifyStatus} token={emailVerifyToken} />
  }

  if (authState.status === 'loggedOut') {
    return <LoginPage onLogin={handleLogin} />
  }

  if (authState.status === 'needsStoreSetup') {
    return <StoreSetupFlow onComplete={() => setAuthState({ status: 'loggedIn' })} />
  }

  return (
    <>
      {SKIP_AUTH && (
        <div className="fixed inset-x-0 top-0 z-[100] bg-coral px-4 py-1 text-center text-caption-2 font-medium text-white">
          VITE_SKIP_AUTH=true — 로그인 우회 중 (서버 복구 후 .env에서 제거하세요)
        </div>
      )}
      <AppLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
        {renderPage(activePage)}
      </AppLayout>
    </>
  )
}

export default App
