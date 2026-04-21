import { Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useMinimumLoaderDelay } from '../../hooks/useMinimumLoaderDelay'
import Loader from '../Loader'
import Navbar from '../Navbar'

function AppLayout() {
  const { isLoading } = useAuth()
  const shouldShowLoader = useMinimumLoaderDelay(isLoading)

  if (shouldShowLoader) {
    return <Loader fullscreen />
  }

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-container">
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AppLayout
