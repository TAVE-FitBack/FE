import { useState } from 'react'
import { AppLayout, type Page } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { logout } from './api/auth'
import { EmailVerifyCallbackScreen } from './features/Auth/EmailVerifyCallback'
import { useEmailVerifyCallback } from './features/Auth/useEmailVerifyCallback'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activePage, setActivePage] = useState<Page>('clients')
  const { status: emailVerifyStatus, token: emailVerifyToken } = useEmailVerifyCallback()

  function handleLogout() {
    logout().finally(() => setIsLoggedIn(false))
  }

  if (emailVerifyStatus !== 'idle') {
    return <EmailVerifyCallbackScreen status={emailVerifyStatus} token={emailVerifyToken} />
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <AppLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
        </AppLayout>
      )}
    </>
  )
}

export default App
