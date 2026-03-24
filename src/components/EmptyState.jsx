import './EmptyState.css'

function EmptyState({ type, searchTerm, filter }) {
  const getEmptyContent = () => {
    switch (type) {
      case 'no-tasks':
        return {
          icon: '📝',
          title: '暂无任务',
          description: '点击上方添加您的第一个任务吧！'
        }
      case 'no-search-results':
        return {
          icon: '🔍',
          title: '未找到匹配的任务',
          description: searchTerm 
            ? `没有找到包含 "${searchTerm}" 的任务` 
            : '没有找到匹配的任务'
        }
      case 'no-filter-results':
        return {
          icon: '🎯',
          title: '当前筛选条件下没有任务',
          description: `筛选条件「${filter}」下暂无任务，试试其他筛选条件`
        }
      case 'no-completed':
        return {
          icon: '✅',
          title: '暂无已完成任务',
          description: '完成任务后会显示在这里'
        }
      default:
        return {
          icon: '📭',
          title: '暂无内容',
          description: ''
        }
    }
  }

  const { icon, title, description } = getEmptyContent()

  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
    </div>
  )
}

export default EmptyState
