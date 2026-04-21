function Loader({ fullscreen = false }) {
  return (
    <div className={`loader-shell ${fullscreen ? 'fullscreen' : ''}`} aria-live="polite" aria-busy="true">
      <div className="loader-card">
        <span className="loader-spinner" aria-hidden="true" />
        <p className="loader-text">Loading AlgoLens...</p>
      </div>
    </div>
  )
}

export default Loader
