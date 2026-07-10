import { useState } from 'react'
import { AppLayout, type Page } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { ClientsPage } from './pages/ClientsPage'
import { logout } from './api/auth'
import { useEmailVerifyCallback, EmailVerifyCallbackScreen } from './features/Auth/EmailVerifyCallback'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activePage, setActivePage] = useState<Page>('clients')
  const emailVerifyStatus = useEmailVerifyCallback()

  function handleLogout() {
    logout().finally(() => setIsLoggedIn(false))
  }

  if (emailVerifyStatus !== 'idle') {
    return <EmailVerifyCallbackScreen status={emailVerifyStatus} />
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <AppLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
          {activePage === 'clients' && <ClientsPage />}
        </AppLayout>
      )}
    </>
  )
}

export default App
