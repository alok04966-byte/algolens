import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <section className="landing-shell">
      <div className="landing-glow landing-glow-left" aria-hidden="true" />
      <div className="landing-glow landing-glow-right" aria-hidden="true" />

      <article className="landing-hero panel-card">
        <p className="hero-eyebrow">AlgoLens</p>
        <h1 className="hero-title">Master Algorithms with Visual Learning</h1>
        <p className="hero-subtext">
          Learn by seeing each step, not memorizing outputs. Build interview confidence with guided visual
          modules and progress tracking.
        </p>
        <div className="hero-actions">
          <Link to="/auth" className="control-button control-button-primary auth-link">
            Get Started
          </Link>
          <Link to="/sorting" className="control-button control-button-secondary auth-link">
            Explore Visualizers
          </Link>
        </div>
      </article>

      <section className="landing-feature-grid" aria-label="Core features">
        <article className="feature-card landing-feature-card">
          <span className="feature-icon" aria-hidden="true">
            📊
          </span>
          <h2>Sorting Visualizer</h2>
          <p>Understand comparisons, swaps, and final ordering through step-by-step simulation.</p>
        </article>
        <article className="feature-card landing-feature-card">
          <span className="feature-icon" aria-hidden="true">
            🕸️
          </span>
          <h2>Graph Visualizer</h2>
          <p>Follow BFS traversal with queue-based progression and clear visited node feedback.</p>
        </article>
        <article className="feature-card landing-feature-card">
          <span className="feature-icon" aria-hidden="true">
            ✅
          </span>
          <h2>Progress Tracker</h2>
          <p>Track learning tasks, update status, and stay consistent with interview prep goals.</p>
        </article>
      </section>
    </section>
  )
}

export default LandingPage
