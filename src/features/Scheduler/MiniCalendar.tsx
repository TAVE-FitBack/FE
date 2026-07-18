import { addDays, isSameDay, isSameMonth, startOfMonth, startOfWeekMonday, WEEKDAY_LABELS_MON_FIRST } from './dateUtils'

interface MiniCalendarProps {
  /** The month currently shown by the month-switch tab (top-right nav). */
  monthAnchor: Date
  today: Date
}

/**
 * Purely presentational — no click-to-select. Only ever highlights the real
 * "today" cell and the calendar week that contains it (when that week falls
 * within the month currently being displayed).
 */
export function MiniCalendar({ monthAnchor, today }: MiniCalendarProps) {
  const monthStart = startOfMonth(monthAnchor)
  const gridStart = startOfWeekMonday(monthStart)
  const todayWeekStart = startOfWeekMonday(today)
  const nextMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1)
  const daysInMonthCount = (nextMonthStart.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24)
  const firstWeekdayOffset = (monthStart.getDay() + 6) % 7
  const rowCount = Math.ceil((firstWeekdayOffset + daysInMonthCount) / 7)
  const visibleCells = Array.from({ length: rowCount * 7 }, (_, i) => addDays(gridStart, i))

  return (
    <div className="w-full rounded-3xl border border-gray-700 bg-gray-800 p-[21px]">
      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS_MON_FIRST.map((label) => (
          <div key={label} className="flex h-7 items-center justify-center text-caption-3 text-white">
            {label}
          </div>
        ))}
        {visibleCells.map((cell) => {
          if (!isSameMonth(cell, monthStart)) return <div key={cell.toISOString()} />
          const isToday = isSameDay(cell, today)
          const isInTodayWeek = cell >= todayWeekStart && cell < addDays(todayWeekStart, 7)
          return (
            <div
              key={cell.toISOString()}
              className={`flex h-7 items-center justify-center rounded-full text-caption-3 tracking-tight ${
                isInTodayWeek ? 'bg-gray-700' : ''
              } ${isToday ? 'text-lime' : 'text-white'}`}
            >
              {cell.getDate()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
