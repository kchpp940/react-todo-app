import Button from './Button'
import './TaskItem.css'

function TaskItem({ 
  task, 
  onEdit, 
  onDelete, 
  onComplete, 
  onUndo,
  isEditing,
  editForm,
  onEditChange,
  onEditSave,
  onEditCancel,
  isCompleted = false
}) {
  const getDueDateStatus = () => {
    if (!task.dueDate || isCompleted) return null
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(task.dueDate)
    dueDate.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { status: 'overdue', label: '已过期', days: Math.abs(diffDays) }
    } else if (diffDays === 0) {
      return { status: 'today', label: '今天到期', days: 0 }
    } else if (diffDays <= 3) {
      return { status: 'upcoming', label: `${diffDays}天后到期`, days: diffDays }
    }
    return null
  }

  const dueDateStatus = getDueDateStatus()

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getCategoryLabel = (category) => {
    const labels = {
      Personal: '个人',
      Work: '工作',
      Shopping: '购物'
    }
    return labels[category] || category
  }

  if (isEditing) {
    return (
      <li className="task-item task-item-editing">
        <div className="task-edit-form">
          <input
            type="text"
            name="text"
            value={editForm.text}
            onChange={onEditChange}
            placeholder="任务内容"
            className="task-edit-input"
          />
          <select
            name="category"
            value={editForm.category}
            onChange={onEditChange}
            className="task-edit-select"
          >
            <option value="Personal">个人</option>
            <option value="Work">工作</option>
            <option value="Shopping">购物</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={editForm.dueDate}
            onChange={onEditChange}
            className="task-edit-date"
          />
          <div className="task-edit-actions">
            <Button variant="success" size="small" onClick={onEditSave}>
              保存
            </Button>
            <Button variant="secondary" size="small" onClick={onEditCancel}>
              取消
            </Button>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item ${isCompleted ? 'task-completed' : ''}`}>
      <div className="task-content">
        <div className="task-main">
          <span className="task-text">{task.text}</span>
          <span className="task-category">{getCategoryLabel(task.category)}</span>
        </div>
        <div className="task-meta">
          {task.dueDate && (
            <span className={`task-due-date ${dueDateStatus ? `due-${dueDateStatus.status}` : ''}`}>
              📅 {formatDate(task.dueDate)}
              {dueDateStatus && (
                <span className="due-date-badge">{dueDateStatus.label}</span>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        {isCompleted ? (
          <Button variant="warning" size="small" onClick={onUndo}>
            ↩ 撤销
          </Button>
        ) : (
          <>
            <Button variant="success" size="small" onClick={onComplete}>
              ✓ 完成
            </Button>
            <Button variant="secondary" size="small" onClick={onEdit}>
              ✎ 编辑
            </Button>
            <Button variant="danger" size="small" onClick={onDelete}>
              ✕ 删除
            </Button>
          </>
        )}
      </div>
    </li>
  )
}

export default TaskItem
