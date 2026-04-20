import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AuthPage() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, signup, isFirebaseConfigured } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup({ email, password, username })
      }
      navigate(from, { replace: true })
    } catch (authError) {
      setError(authError.message || 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="panel-card auth-panel">
      <h1>{mode === 'login' ? 'Login to AlgoLens' : 'Create your AlgoLens account'}</h1>
      {!isFirebaseConfigured && (
        <p className="hint-text">
          Running in demo auth mode. Add Firebase env vars to switch to real authentication.
        </p>
      )}
      <form className="form-grid" onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <>
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              required
              minLength={2}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </>
        )}

        <label htmlFor="email-input">Email</label>
        <input
          id="email-input"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password-input">Password</label>
        <input
          id="password-input"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="control-button control-button-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
        </button>
      </form>
      <button
        type="button"
        className="control-button control-button-secondary"
        onClick={() => setMode((prev) => (prev === 'login' ? 'signup' : 'login'))}
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
      </button>
    </section>
  )
}

export default AuthPage
