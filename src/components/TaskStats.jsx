import './TaskStats.css'

function TaskStats({ total, completed, pending }) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="task-stats">
      <div className="stat-item">
        <div className="stat-value">{total}</div>
        <div className="stat-label">总任务</div>
      </div>
      <div className="stat-item stat-pending">
        <div className="stat-value">{pending}</div>
        <div className="stat-label">未完成</div>
      </div>
      <div className="stat-item stat-completed">
        <div className="stat-value">{completed}</div>
        <div className="stat-label">已完成</div>
      </div>
      <div className="stat-item stat-rate">
        <div className="stat-value">{completionRate}%</div>
        <div className="stat-label">完成率</div>
      </div>
    </div>
  )
}

export default TaskStats
