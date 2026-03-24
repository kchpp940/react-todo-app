import Button from './Button'
import './SearchFilter.css'

function SearchFilter({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortChange
}) {
  const getFilterLabel = (filter) => {
    const labels = {
      all: '全部',
      pending: '未完成',
      completed: '已完成'
    }
    return labels[filter] || filter
  }

  return (
    <div className="search-filter">
      <div className="search-box">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="搜索任务..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="search-clear" 
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="filter-group">
        <span className="filter-label">筛选：</span>
        <div className="filter-buttons">
          {['all', 'pending', 'completed'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'primary' : 'ghost'}
              size="small"
              onClick={() => onFilterChange(f)}
            >
              {getFilterLabel(f)}
            </Button>
          ))}
        </div>
      </div>

      <div className="sort-group">
        <span className="filter-label">排序：</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="created">创建时间</option>
          <option value="dueDate">截止日期</option>
          <option value="category">分类</option>
          <option value="name">名称</option>
        </select>
      </div>
    </div>
  )
}

export default SearchFilter
