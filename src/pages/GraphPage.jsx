import { useMemo, useState } from 'react'

const graph = {
  A: ['B', 'C'],
  B: ['D', 'E'],
  C: ['F'],
  D: [],
  E: ['F'],
  F: [],
}

const nodePositions = {
  A: { x: 50, y: 18 },
  B: { x: 30, y: 46 },
  C: { x: 70, y: 46 },
  D: { x: 22, y: 78 },
  E: { x: 50, y: 78 },
  F: { x: 78, y: 78 },
}

function GraphPage() {
  const [startNode, setStartNode] = useState('A')
  const [steps, setSteps] = useState([])
  const [cursor, setCursor] = useState(0)

  const nodes = useMemo(() => Object.keys(graph), [])

  const generateBfsSteps = () => {
    const visited = new Set()
    const queue = [startNode]
    const traversal = []
    const generated = []

    while (queue.length > 0) {
      const node = queue.shift()
      const addedNeighbors = []
      visited.add(node)
      traversal.push(node)

      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          if (!queue.includes(neighbor)) {
            addedNeighbors.push(neighbor)
          }
          queue.push(neighbor)
        }
      }

      const queueAfterVisit = [...queue]
      const explanation =
        addedNeighbors.length > 0
          ? `Visiting ${node} -> adding ${addedNeighbors.join(', ')} to queue.`
          : `Visiting ${node} -> no new neighbors added.`

      generated.push({
        active: node,
        queue: queueAfterVisit,
        visited: [...visited],
        traversal: [...traversal],
        addedNeighbors,
        explanation,
      })
    }

    setSteps(generated)
    setCursor(0)
  }

  const current = steps[cursor] || null

  return (
    <section className="panel-card">
      <h1>Graph Visualizer (BFS)</h1>
      <p>Explore how breadth-first search expands level by level from a selected start node.</p>

      <div className="graph-page">
        <div className="graph-left">
          <article className="feature-card graph-canvas-card">
            <h2>Graph View</h2>
            <div className="graph-container">
              <svg className="graph-svg" aria-label="BFS graph visualization" role="img">
                {Object.entries(graph).flatMap(([from, neighbors]) =>
                  neighbors.map((to) => (
                    <line
                      key={`${from}-${to}`}
                      x1={`${nodePositions[from].x}%`}
                      y1={`${nodePositions[from].y}%`}
                      x2={`${nodePositions[to].x}%`}
                      y2={`${nodePositions[to].y}%`}
                      className="graph-edge"
                    />
                  )),
                )}
                {nodes.map((node) => {
                  const isActive = current?.active === node
                  const isVisited = current?.visited?.includes(node)
                  return (
                    <g key={node} className="graph-node-group">
                      <circle
                        className={`graph-node ${isVisited ? 'visited' : 'unvisited'} ${isActive ? 'active' : ''}`}
                        cx={`${nodePositions[node].x}%`}
                        cy={`${nodePositions[node].y}%`}
                        r="20"
                      />
                      <text
                        className="graph-node-label"
                        x={`${nodePositions[node].x}%`}
                        y={`${nodePositions[node].y}%`}
                      >
                        {node}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </article>
        </div>

        <div className="graph-right">
          <div className="graph-controls">
            <label htmlFor="start-node-select">Start Node</label>
            <select
              id="start-node-select"
              value={startNode}
              onChange={(event) => setStartNode(event.target.value)}
            >
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
            <button type="button" className="control-button control-button-primary" onClick={generateBfsSteps}>
              Generate Traversal
            </button>
            <button
              type="button"
              className="control-button control-button-secondary"
              onClick={() => setCursor((prev) => Math.max(0, prev - 1))}
              disabled={cursor === 0 || steps.length === 0}
            >
              Previous
            </button>
            <button
              type="button"
              className="control-button control-button-secondary"
              onClick={() => setCursor((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={steps.length === 0 || cursor >= steps.length - 1}
            >
              Next
            </button>
          </div>
          <article className="stat-card">
            <h2 className="stat-title">Step</h2>
            <p className="stat-value">
              {steps.length === 0 ? 'No traversal generated yet.' : `${cursor + 1} / ${steps.length}`}
            </p>
          </article>
          <article className="stat-card">
            <h2 className="stat-title">Queue State</h2>
            <div className="queue-visual stat-value" aria-label="Queue order">
              {current?.queue?.length ? (
                current.queue.map((node, index) => (
                  <div key={`${node}-${index}`} className="queue-item">
                    {node}
                  </div>
                ))
              ) : (
                <p className="queue-empty">Queue is empty</p>
              )}
            </div>
          </article>
          <article className="stat-card">
            <h2 className="stat-title">Traversal Order</h2>
            <p className="stat-value traversal-text">{current?.traversal?.join(' -> ') || '-'}</p>
          </article>

          <section className="explanation-box" aria-live="polite">
            <h2 className="explanation-title">What is happening?</h2>
            <p className="explanation-text">
              {current?.explanation || 'Generate traversal and move step by step to inspect BFS decisions.'}
            </p>
          </section>
          {current?.addedNeighbors?.length > 0 && (
            <p className="hint-text">Neighbors enqueued this step: {current.addedNeighbors.join(', ')}</p>
          )}
          {steps.length > 0 && (
            <div className="status-row graph-status-row">
              <p className="algorithm-label">Active Node: {current?.active}</p>
              <p className="step-counter">Visited: {current?.visited?.join(', ')}</p>
            </div>
          )}
          <button
            type="button"
            className="control-button control-button-secondary reset-btn"
            onClick={() => {
              setSteps([])
              setCursor(0)
            }}
            disabled={steps.length === 0}
          >
            Reset Traversal
          </button>
        </div>
      </div>
    </section>
  )
}

export default GraphPage
