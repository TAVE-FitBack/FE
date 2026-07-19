import { useEffect, useState } from 'react'
import { getTaskChecklists, updateTaskChecklistDone, type TaskChecklistResponse } from '../../api/taskChecklists'
import { ApiError } from '../../api/client'
import { toDateInputValue } from './dateUtils'

function ChecklistIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6h11" />
      <path d="M9 12h11" />
      <path d="M9 18h11" />
      <path d="m4 6 1 1 2-2" />
      <path d="m4 12 1 1 2-2" />
      <path d="m4 18 1 1 2-2" />
    </svg>
  )
}

interface ChecklistPanelProps {
  /** 부모(SchedulerPage)에서 일정을 추가/수정/삭제할 때마다 값을 바꿔 재조회를 트리거함 */
  refreshKey?: number
}

export function ChecklistPanel({ refreshKey }: ChecklistPanelProps) {
  const [items, setItems] = useState<TaskChecklistResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const today = toDateInputValue(new Date())
    getTaskChecklists(today)
      .then((res) => setItems(res.items))
      .catch((e) => setError(e instanceof ApiError ? e.message : '체크리스트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [refreshKey])

  async function toggle(taskId: string, current: boolean) {
    setItems((prev) => prev.map((it) => (it.taskId === taskId ? { ...it, isDone: !current } : it)))
    try {
      await updateTaskChecklistDone(taskId, !current)
    } catch {
      setItems((prev) => prev.map((it) => (it.taskId === taskId ? { ...it, isDone: current } : it)))
    }
  }

  return (
    <div className="flex h-[376px] w-full flex-col rounded-3xl border border-gray-700 bg-gray-800 p-[21px]">
      <div className="flex items-center gap-2 pb-[10px]">
        <ChecklistIcon />
        <h3 className="text-subtitle-2 font-semibold text-gray-400">할일 체크리스트</h3>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-2">
        <span className="px-2 text-body-3 text-lime">오늘 상담</span>

        {loading && <span className="px-2 text-caption-3 text-gray-600">불러오는 중...</span>}
        {error && <span className="px-2 text-caption-3 text-error">{error}</span>}
        {!loading && !error && items.length === 0 && (
          <span className="px-2 text-caption-3 text-gray-600">오늘 예정된 상담이 없습니다</span>
        )}

        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <label key={item.taskId} className="flex w-full cursor-pointer items-start gap-3 rounded-full p-2 hover:bg-white/5">
              <input
                type="checkbox"
                checked={item.isDone}
                onChange={() => toggle(item.taskId, item.isDone)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-gray-500 bg-transparent accent-lime"
              />
              <span className={`text-caption-3 tracking-tight ${item.isDone ? 'text-gray-600 line-through' : 'text-gray-300'}`}>
                {item.title}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
