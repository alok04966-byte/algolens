import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'

function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">AlgoLens</div>
      <nav aria-label="Visualizer tabs">
        <ul className="navbar-tabs">
          <li>
            <NavLink to="/" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/sorting" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
                  Sorting
                </NavLink>
              </li>
              <li>
                <NavLink to="/graph" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
                  Graph
                </NavLink>
              </li>
              <li>
                <NavLink to="/progress" className={({ isActive }) => `tab-button ${isActive ? 'active' : ''}`}>
                  Progress
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="auth-actions">
        <button type="button" className="control-button control-button-secondary" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        {user ? (
          <button type="button" className="control-button control-button-secondary" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/auth" className="control-button control-button-primary auth-link">
            Login / Signup
          </NavLink>
        )}
      </div>
    </header>
  )
}

export default Navbar
