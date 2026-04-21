import { useEffect, useState } from 'react'
import Loader from '../components/Loader'
import { useMinimumLoaderDelay } from '../hooks/useMinimumLoaderDelay'
import { useAuth } from '../hooks/useAuth'
import {
  createProgressItem,
  listProgressItems,
  removeProgressItem,
  updateProgressItem,
} from '../services/progressService'

const defaultFormState = {
  title: '',
  topic: '',
  status: 'todo',
}

const defaultEditState = {
  id: null,
  title: '',
  topic: '',
  status: 'todo',
}

const statusLabelMap = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Completed',
}

function ProgressPage() {
  const { user, isFirebaseConfigured } = useAuth()
  const [items, setItems] = useState([])
  const [formState, setFormState] = useState(defaultFormState)
  const [editState, setEditState] = useState(defaultEditState)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const completedCount = items.filter((item) => item.status === 'done').length
  const shouldShowLoader = useMinimumLoaderDelay(isLoading)

  useEffect(() => {
    let isSubscribed = true

    const run = async () => {
      if (!user?.uid) {
        if (isSubscribed) {
          setItems([])
          setIsLoading(false)
        }
        return
      }

      if (isSubscribed) setIsLoading(true)
      try {
        const result = await listProgressItems(user.uid)
        if (isSubscribed) setItems(result)
      } catch (progressError) {
        if (isSubscribed) setError(progressError.message || 'Unable to fetch items.')
      } finally {
        if (isSubscribed) setIsLoading(false)
      }
    }

    run()

    return () => {
      isSubscribed = false
    }
  }, [user?.uid])

  const fetchItems = async () => {
    if (!user?.uid) return
    const result = await listProgressItems(user.uid)
    setItems(result)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await createProgressItem(user.uid, formState)
      setFormState(defaultFormState)
      await fetchItems()
    } catch (progressError) {
      setError(progressError.message || 'Could not create item.')
    }
  }

  const handleStatusUpdate = async (id, status) => {
    setError('')
    try {
      await updateProgressItem(user.uid, id, { status })
      await fetchItems()
    } catch (progressError) {
      setError(progressError.message || 'Could not update task status.')
    }
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await removeProgressItem(user.uid, id)
      if (editState.id === id) {
        setEditState(defaultEditState)
      }
      await fetchItems()
    } catch (progressError) {
      setError(progressError.message || 'Could not delete task.')
    }
  }

  const handleStartEdit = (item) => {
    setEditState({
      id: item.id,
      title: item.title,
      topic: item.topic,
      status: item.status,
    })
  }

  const handleCancelEdit = () => {
    setEditState(defaultEditState)
  }

  const handleSaveEdit = async (id) => {
    setError('')
    try {
      await updateProgressItem(user.uid, id, {
        title: editState.title,
        topic: editState.topic,
        status: editState.status,
      })
      setEditState(defaultEditState)
      await fetchItems()
    } catch (progressError) {
      setError(progressError.message || 'Could not save task changes.')
    }
  }

  if (shouldShowLoader) {
    return <Loader />
  }

  return (
    <section className="panel-card">
      <h1>Progress Tracker (CRUD)</h1>
      <p>Track what you are learning, what is in progress, and what is interview-ready.</p>
      {!isFirebaseConfigured && (
        <p className="hint-text">Using local storage fallback. Add Firebase env vars for cloud persistence.</p>
      )}
      <section className="section-block">
        <h2 className="section-heading">Create Learning Task</h2>
        <form className="form-grid" onSubmit={handleCreate}>
          <label htmlFor="task-title-input">Task Title</label>
          <input
            id="task-title-input"
            required
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
          />

          <label htmlFor="task-topic-input">Topic</label>
          <input
            id="task-topic-input"
            required
            value={formState.topic}
            onChange={(event) => setFormState((prev) => ({ ...prev, topic: event.target.value }))}
          />

          <label htmlFor="task-status-select">Status</label>
          <select
            id="task-status-select"
            value={formState.status}
            onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Completed</option>
          </select>

          <button type="submit" className="control-button control-button-primary">
            Add learning item
          </button>
        </form>
      </section>

      {error && <p className="error-text">{error}</p>}
      <section className="section-block">
        <h2 className="section-heading">Your Learning Progress</h2>
        <p className="progress-summary">
          {items.length} Tasks • {completedCount} Completed
        </p>
        <div className="progress-list">
          {items.length === 0 && (
            <article className="feature-card empty-state-card">
              <span className="empty-state-icon" aria-hidden="true">
                🗂️
              </span>
              <h3>No learning tasks yet</h3>
              <p>Create your first task above and start tracking interview prep consistency.</p>
            </article>
          )}
          {items.map((item) => (
            <article className="feature-card progress-item-card" key={item.id}>
              {editState.id === item.id ? (
                <div className="form-grid compact-form">
                  <label htmlFor={`edit-title-${item.id}`}>Title</label>
                  <input
                    id={`edit-title-${item.id}`}
                    value={editState.title}
                    onChange={(event) => setEditState((prev) => ({ ...prev, title: event.target.value }))}
                  />

                  <label htmlFor={`edit-topic-${item.id}`}>Topic</label>
                  <input
                    id={`edit-topic-${item.id}`}
                    value={editState.topic}
                    onChange={(event) => setEditState((prev) => ({ ...prev, topic: event.target.value }))}
                  />

                  <label htmlFor={`edit-status-${item.id}`}>Status</label>
                  <select
                    id={`edit-status-${item.id}`}
                    value={editState.status}
                    onChange={(event) => setEditState((prev) => ({ ...prev, status: event.target.value }))}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Completed</option>
                  </select>

                  <div className="buttons-row left-aligned">
                    <button
                      type="button"
                      className="control-button control-button-primary"
                      onClick={() => handleSaveEdit(item.id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="control-button control-button-secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{item.title}</h3>
                  <p className="task-topic">Topic: {item.topic}</p>
                  <p className={`status-badge status-${item.status}`}>
                    {statusLabelMap[item.status] || item.status}
                  </p>
                  <div className="buttons-row left-aligned">
                    <select
                      value={item.status}
                      onChange={(event) => handleStatusUpdate(item.id, event.target.value)}
                      className="status-select-inline"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Completed</option>
                    </select>
                    <button
                      type="button"
                      className="control-button control-button-secondary"
                      onClick={() => handleStartEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="control-button control-button-secondary"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default ProgressPage
