import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function DashboardPage() {
  const { user } = useAuth()
  const displayName = user?.username || user?.email || 'Learner'

  return (
    <section className="panel-card">
      <h1>Welcome back, {displayName}</h1>
      <p>Your interview prep dashboard keeps algorithm practice, simulation, and progress in one place.</p>
      <div className="dashboard-grid">
        <article className="feature-card">
          <h2>Sorting Visualizer</h2>
          <p>Understand comparison-based sorting through controlled, step-by-step simulation.</p>
          <Link to="/sorting" className="tab-button active">
            Open sorting module
          </Link>
        </article>
        <article className="feature-card">
          <h2>Graph Visualizer</h2>
          <p>Learn traversal intuition using guided Breadth-First Search exploration.</p>
          <Link to="/graph" className="tab-button active">
            Open graph module
          </Link>
        </article>
        <article className="feature-card">
          <h2>Progress Tracker</h2>
          <p>Create, update, and complete learning tasks with persistent CRUD storage.</p>
          <Link to="/progress" className="tab-button active">
            Open progress module
          </Link>
        </article>
      </div>
    </section>
  )
}

export default DashboardPage
