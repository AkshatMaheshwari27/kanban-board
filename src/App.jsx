import { useState, useEffect } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import Column from './components/Column'
import './App.css'

const initialData = {
  todo: { id: 'todo', title: 'Todo', tasks: [] },
  inProgress: { id: 'inProgress', title: 'In Progress', tasks: [] },
  done: { id: 'done', title: 'Done', tasks: [] }
}

function App() {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem('kanban')
    return saved ? JSON.parse(saved) : initialData
  })
  const [showForm, setShowForm] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  useEffect(() => {
  document.body.style.backgroundColor = darkMode ? '#1a1a2e' : '#f0f2f5'
}, [darkMode])
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    localStorage.setItem('kanban', JSON.stringify(columns))
  }, [columns])

  const addTask = () => {
    if (!newTitle.trim()) return
    const task = { id: Date.now().toString(), title: newTitle, description: newDesc, priority: 'Low' }
    setColumns(prev => ({
      ...prev,
      todo: { ...prev.todo, tasks: [...prev.todo.tasks, task] }
    }))
    setNewTitle('')
    setNewDesc('')
    setShowForm(false)
  }

  const deleteTask = (columnId, taskId) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: prev[columnId].tasks.filter(t => t.id !== taskId)
      }
    }))
  }

  const editTask = (columnId, taskId, newTitle, newDesc, newPriority) => {
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        tasks: prev[columnId].tasks.map(t =>
          t.id === taskId ? { ...t, title: newTitle, description: newDesc, priority: newPriority } : t
        )
      }
    }))
  }

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    const sourceCol = columns[source.droppableId]
    const destCol = columns[destination.droppableId]
    const sourceTasks = [...sourceCol.tasks]
    const [moved] = sourceTasks.splice(source.index, 1)

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, moved)
      setColumns(prev => ({
        ...prev,
        [source.droppableId]: { ...sourceCol, tasks: sourceTasks }
      }))
    } else {
      const destTasks = [...destCol.tasks]
      destTasks.splice(destination.index, 0, moved)
      setColumns(prev => ({
        ...prev,
        [source.droppableId]: { ...sourceCol, tasks: sourceTasks },
        [destination.droppableId]: { ...destCol, tasks: destTasks }
      }))
    }
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="header">
  <h1>Kanban Board</h1>
  <div className="header-buttons">
    <button className="theme-btn" onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
    <button className="add-btn" onClick={() => setShowForm(true)}>+ Add Task</button>
  </div>
</div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Task</h2>
            <input
              placeholder="Task title *"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <textarea
              placeholder="Description (optional)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={addTask}>Add Task</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.values(columns).map(column => (
            <Column
              key={column.id}
              column={column}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App