import { Navigate, useLocation } from 'react-router-dom'
import Loader from '../components/Loader'
import { useMinimumLoaderDelay } from '../hooks/useMinimumLoaderDelay'
import { useAuth } from '../hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()
  const shouldShowLoader = useMinimumLoaderDelay(isLoading)

  if (shouldShowLoader) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
