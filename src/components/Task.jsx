import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

const PRIORITIES = ['Low', 'Medium', 'High']

const priorityColors = {
  Low: '#2ecc71',
  Medium: '#f39c12',
  High: '#ef233c'
}

function Task({ task, index, columnId, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description)
  const [editPriority, setEditPriority] = useState(task.priority || 'Low')

  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(columnId, task.id, editTitle, editDesc, editPriority)
    setIsEditing(false)
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <div className="edit-form">
              <input
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                placeholder="Task title"
              />
              <textarea
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                placeholder="Description"
              />
              <select
                value={editPriority}
                onChange={e => setEditPriority(e.target.value)}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="task-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="task-header">
                <p className="task-title">{task.title}</p>
                <span
                  className="priority-badge"
                  style={{ backgroundColor: priorityColors[task.priority || 'Low'] }}
                >
                  {task.priority || 'Low'}
                </span>
              </div>
              {task.description && <p className="task-desc">{task.description}</p>}
              <div className="task-buttons">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <button onClick={() => onDelete(columnId, task.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default Task