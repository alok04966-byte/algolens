import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import AppLayout from './components/layout/AppLayout'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './routes/ProtectedRoute'

const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const GraphPage = lazy(() => import('./pages/GraphPage'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ProgressPage = lazy(() => import('./pages/ProgressPage'))
const SortingPage = lazy(() => import('./pages/SortingPage'))

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Suspense fallback={<section className="panel-card">Loading page...</section>}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="auth" element={<AuthPage />} />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="sorting"
                  element={
                    <ProtectedRoute>
                      <SortingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="graph"
                  element={
                    <ProtectedRoute>
                      <GraphPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="progress"
                  element={
                    <ProtectedRoute>
                      <ProgressPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
