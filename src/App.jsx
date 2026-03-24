import { useState, useEffect, useMemo } from 'react'
import TaskForm from './components/TaskForm'
import TaskItem from './components/TaskItem'
import TaskStats from './components/TaskStats'
import SearchFilter from './components/SearchFilter'
import EmptyState from './components/EmptyState'
import ConfirmModal from './components/ConfirmModal'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ text: '', category: 'Personal', dueDate: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null, isCompleted: false })

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || []
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || []
    
    const tasksWithId = savedTasks.map((t, i) => ({ ...t, id: t.id || `task-${Date.now()}-${i}` }))
    const completedWithId = savedCompletedTasks.map((t, i) => ({ ...t, id: t.id || `completed-${Date.now()}-${i}` }))
    
    setTasks(tasksWithId)
    setCompletedTasks(completedWithId)
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks))
  }, [tasks, completedTasks])

  const stats = useMemo(() => ({
    total: tasks.length + completedTasks.length,
    completed: completedTasks.length,
    pending: tasks.length
  }), [tasks, completedTasks])

  const getCategoryLabel = (category) => {
    const labels = { Personal: '个人', Work: '工作', Shopping: '购物' }
    return labels[category] || category
  }

  const filteredAndSortedTasks = useMemo(() => {
    let result = []
    
    if (filter === 'all' || filter === 'pending') {
      result = result.concat(tasks.map(t => ({ ...t, isCompleted: false })))
    }
    if (filter === 'all' || filter === 'completed') {
      result = result.concat(completedTasks.map(t => ({ ...t, isCompleted: true })))
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      result = result.filter(t => 
        t.text.toLowerCase().includes(term) ||
        getCategoryLabel(t.category).toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'name':
          return a.text.localeCompare(b.text)
        default:
          return 0
      }
    })

    return result
  }, [tasks, completedTasks, filter, searchTerm, sortBy])

  const addTask = (taskData) => {
    const isDuplicate = tasks.some(
      t => t.text.toLowerCase() === taskData.text.toLowerCase()
    )
    
    if (isDuplicate) {
      alert('已存在相同内容的任务')
      return false
    }

    setIsSubmitting(true)
    
    setTimeout(() => {
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: Date.now()
      }
      setTasks(prev => [...prev, newTask])
      setIsSubmitting(false)
    }, 300)
    
    return true
  }

  const deleteTask = (task, isCompleted) => {
    setDeleteModal({ isOpen: true, task, isCompleted })
  }

  const confirmDelete = () => {
    const { task, isCompleted } = deleteModal
    
    if (isCompleted) {
      setCompletedTasks(prev => prev.filter(t => t.id !== task.id))
    } else {
      setTasks(prev => prev.filter(t => t.id !== task.id))
    }
    
    setDeleteModal({ isOpen: false, task: null, isCompleted: false })
  }

  const completeTask = (task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id))
    setCompletedTasks(prev => [...prev, { ...task, completedAt: Date.now() }])
  }

  const undoTask = (task) => {
    setCompletedTasks(prev => prev.filter(t => t.id !== task.id))
    setTasks(prev => [...prev, task])
  }

  const startEditing = (task) => {
    setEditingId(task.id)
    setEditForm({
      text: task.text,
      category: task.category,
      dueDate: task.dueDate || ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const saveEdit = () => {
    if (!editForm.text.trim()) {
      alert('任务内容不能为空')
      return
    }

    if (editForm.dueDate) {
      const selectedDate = new Date(editForm.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      selectedDate.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        alert('截止日期不能早于今天')
        return
      }
    }

    setTasks(prev => prev.map(t => 
      t.id === editingId 
        ? { ...t, ...editForm }
        : t
    ))
    
    setEditingId(null)
    setEditForm({ text: '', category: 'Personal', dueDate: '' })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ text: '', category: 'Personal', dueDate: '' })
  }

  const getEmptyStateType = () => {
    if (tasks.length === 0 && completedTasks.length === 0) {
      return 'no-tasks'
    }
    if (searchTerm && filteredAndSortedTasks.length === 0) {
      return 'no-search-results'
    }
    if (filter !== 'all' && filteredAndSortedTasks.length === 0) {
      return 'no-filter-results'
    }
    return null
  }

  const emptyType = getEmptyStateType()

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">📝 待办事项</h1>
          <p className="subtitle">管理您的日常任务</p>
        </header>

        <TaskStats {...stats} />

        <TaskForm onAdd={addTask} isSubmitting={isSubmitting} />

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <section className="task-section">
          <div className="section-header">
            <h2 className="section-title">
              {filter === 'all' ? '全部任务' : 
               filter === 'pending' ? '未完成任务' : '已完成任务'}
              <span className="task-count">{filteredAndSortedTasks.length}</span>
            </h2>
          </div>

          {emptyType ? (
            <EmptyState 
              type={emptyType} 
              searchTerm={searchTerm} 
              filter={getCategoryLabel(filter)} 
            />
          ) : (
            <ul className="task-list">
              {filteredAndSortedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isCompleted={task.isCompleted}
                  isEditing={editingId === task.id}
                  editForm={editForm}
                  onEditChange={handleEditChange}
                  onEditSave={saveEdit}
                  onEditCancel={cancelEdit}
                  onEdit={() => startEditing(task)}
                  onDelete={() => deleteTask(task, task.isCompleted)}
                  onComplete={() => completeTask(task)}
                  onUndo={() => undoTask(task)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="确认删除"
        message={`确定要删除任务「${deleteModal.task?.text}」吗？此操作无法撤销。`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, task: null, isCompleted: false })}
      />
    </div>
  )
}

export default App
