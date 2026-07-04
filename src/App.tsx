import { useState } from 'react'
import { AppLayout, type Page } from './components/layout/AppLayout'
import { LoginPage } from './pages/LoginPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activePage, setActivePage] = useState<Page>('clients')

  function handleLogout() {
    setIsLoggedIn(false)
  }

  return (
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <AppLayout activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout}>
          {/* 페이지 콘텐츠 */}
        </AppLayout>
      )}
    </>
  )
}

export default App
