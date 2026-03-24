import { useState } from 'react'
import Button from './Button'
import './TaskForm.css'

function TaskForm({ onAdd, isSubmitting }) {
  const [task, setTask] = useState('')
  const [category, setCategory] = useState('Personal')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!task.trim()) {
      setError('请输入任务内容')
      return
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        setError('截止日期不能早于今天')
        return
      }
    }

    const success = onAdd({ text: task.trim(), category, dueDate })
    if (success) {
      setTask('')
      setDueDate('')
      setError('')
    }
  }

  const handleTaskChange = (e) => {
    setTask(e.target.value)
    if (error) setError('')
  }

  const handleDateChange = (e) => {
    setDueDate(e.target.value)
    if (error) setError('')
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row form-main">
        <input
          type="text"
          value={task}
          onChange={handleTaskChange}
          placeholder="输入新任务..."
          className="form-input task-input"
        />
        <Button 
          type="submit" 
          variant="primary" 
          size="medium"
          disabled={isSubmitting}
          className="add-btn"
        >
          {isSubmitting ? '添加中...' : '+ 添加任务'}
        </Button>
      </div>

      <div className="form-row form-options">
        <div className="form-field">
          <label className="form-label">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="Personal">个人</option>
            <option value="Work">工作</option>
            <option value="Shopping">购物</option>
          </select>
        </div>

        <div className="form-field">
          <label className="form-label">截止日期</label>
          <input
            type="date"
            value={dueDate}
            onChange={handleDateChange}
            min={getMinDate()}
            className="form-date"
          />
        </div>
      </div>

      {error && (
        <div className="form-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
    </form>
  )
}

export default TaskForm
