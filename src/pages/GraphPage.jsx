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
  A: { x: 180, y: 54 },
  B: { x: 100, y: 136 },
  C: { x: 260, y: 136 },
  D: { x: 68, y: 230 },
  E: { x: 180, y: 230 },
  F: { x: 292, y: 230 },
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

      <div className="graph-layout">
        <article className="feature-card graph-canvas-card">
          <h2>Graph View</h2>
          <div className="graph-canvas">
            <svg viewBox="0 0 320 300" className="graph-svg" aria-hidden="true">
              {Object.entries(graph).flatMap(([from, neighbors]) =>
                neighbors.map((to) => (
                  <line
                    key={`${from}-${to}`}
                    x1={nodePositions[from].x}
                    y1={nodePositions[from].y}
                    x2={nodePositions[to].x}
                    y2={nodePositions[to].y}
                    className="graph-edge"
                  />
                )),
              )}
            </svg>

            {nodes.map((node) => {
              const isActive = current?.active === node
              const isVisited = current?.visited?.includes(node)
              return (
                <div
                  key={node}
                  className={`graph-node ${isVisited ? 'visited' : 'unvisited'} ${isActive ? 'active' : ''}`}
                  style={{ left: `${nodePositions[node].x}px`, top: `${nodePositions[node].y}px` }}
                >
                  {node}
                </div>
              )
            })}
          </div>
        </article>

        <div className="graph-info-grid">
          <article className="feature-card">
            <h2>Step</h2>
            <p>{steps.length === 0 ? 'No traversal generated yet.' : `${cursor + 1} / ${steps.length}`}</p>
          </article>
          <article className="feature-card">
            <h2>Queue State</h2>
            <div className="queue-visual" aria-label="Queue order">
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
          <article className="feature-card">
            <h2>Traversal Order</h2>
            <p>{current?.traversal?.join(' -> ') || '-'}</p>
          </article>
        </div>
      </div>

      <section className="explanation-panel" aria-live="polite">
        <h2 className="explanation-title">What is happening?</h2>
        <p className="explanation-text">
          {current?.explanation || 'Generate traversal and move step by step to inspect BFS decisions.'}
        </p>
      </section>
      {current?.addedNeighbors?.length > 0 && (
        <p className="hint-text">Neighbors enqueued this step: {current.addedNeighbors.join(', ')}</p>
      )}
      {steps.length > 0 && (
        <div className="status-row">
          <p className="algorithm-label">Active Node: {current?.active}</p>
          <p className="step-counter">Visited: {current?.visited?.join(', ')}</p>
        </div>
      )}
      <div className="buttons-row">
        <button
          type="button"
          className="control-button control-button-secondary"
          onClick={() => {
            setSteps([])
            setCursor(0)
          }}
          disabled={steps.length === 0}
        >
          Reset Traversal
        </button>
      </div>
    </section>
  )
}

export default GraphPage
