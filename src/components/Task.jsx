import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'

function Task({ task, index, columnId, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description)

  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(columnId, task.id, editTitle, editDesc)
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
              <div className="task-buttons">
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="task-title">{task.title}</p>
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