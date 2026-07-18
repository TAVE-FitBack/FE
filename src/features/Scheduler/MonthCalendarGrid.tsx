import { useLayoutEffect, useRef, type MouseEvent, type UIEvent } from 'react'
import type { Appointment, AppointmentColor } from './data'
import { addDays, daysInMonth, isSameDay, startOfMonth } from './dateUtils'
import { GRID_END_HOUR, GRID_START_HOUR } from './gridConfig'

export interface EmptyCellClickInfo {
  date: Date
  hour: number
  minute: number
  x: number
  y: number
}

interface MonthCalendarGridProps {
  monthAnchor: Date
  today: Date
  appointments: Appointment[]
  onEmptyCellContextMenu: (info: EmptyCellClickInfo) => void
  onEventClick: (appointment: Appointment, x: number, y: number) => void
  onEventContextMenu: (appointment: Appointment, x: number, y: number) => void
  /** Fired with the leftmost fully-visible day as the user scrolls horizontally. */
  onFocusedDayChange: (date: Date) => void
}

const HOURS = Array.from({ length: GRID_END_HOUR - GRID_START_HOUR + 1 }, (_, i) => GRID_START_HOUR + i)
const ROW_HEIGHT = 90
const PX_PER_MINUTE = ROW_HEIGHT / 60
const GRID_TOTAL_MINUTES = HOURS.length * 60
const LABEL_COL_WIDTH = 79
const DAY_COL_WIDTH = 172
const HEADER_HEIGHT = 41
const VISIBLE_HEIGHT = 8 * ROW_HEIGHT

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

const COLOR_CLASS: Record<AppointmentColor, string> = {
  lime: 'border-l-lime',
  coral: 'border-l-coral',
  coralLight: 'border-l-coral-light',
}

function formatHourLabel(hour: number): string {
  const period = hour < 12 ? 'am' : 'pm'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12} ${period}`
}

function formatEventTime(hour: number, minute: number): string {
  return `${hour}:${String(minute).padStart(2, '0')}`
}

export function MonthCalendarGrid({
  monthAnchor,
  today,
  appointments,
  onEmptyCellContextMenu,
  onEventClick,
  onEventContextMenu,
  onFocusedDayChange,
}: MonthCalendarGridProps) {
  const monthStart = startOfMonth(monthAnchor)
  const dayCount = daysInMonth(monthAnchor)
  const days = Array.from({ length: dayCount }, (_, i) => addDays(monthStart, i))

  const scrollRef = useRef<HTMLDivElement>(null)
  const lastFocusedIndex = useRef(-1)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const todayIndex = days.findIndex((d) => isSameDay(d, today))
    const index = todayIndex >= 0 ? todayIndex : 0
    el.scrollLeft = index * DAY_COL_WIDTH
    lastFocusedIndex.current = -1
    onFocusedDayChange(days[index])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthAnchor.getFullYear(), monthAnchor.getMonth()])

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const index = Math.min(Math.max(Math.round(e.currentTarget.scrollLeft / DAY_COL_WIDTH), 0), dayCount - 1)
    if (index !== lastFocusedIndex.current) {
      lastFocusedIndex.current = index
      onFocusedDayChange(days[index])
    }
  }

  function scrollToDay(day: Date) {
    const index = days.findIndex((d) => isSameDay(d, day))
    if (index < 0 || !scrollRef.current) return
    scrollRef.current.scrollTo({ left: index * DAY_COL_WIDTH, behavior: 'smooth' })
  }

  function handleColumnContextMenu(e: MouseEvent<HTMLDivElement>, day: Date) {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetMinutes = (e.clientY - rect.top) / PX_PER_MINUTE
    const snapped = Math.min(Math.max(Math.round(offsetMinutes / 30) * 30, 0), GRID_TOTAL_MINUTES - 30)
    const totalMinutes = GRID_START_HOUR * 60 + snapped
    onEmptyCellContextMenu({
      date: day,
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
      x: e.clientX,
      y: e.clientY,
    })
  }

  const contentWidth = LABEL_COL_WIDTH + dayCount * DAY_COL_WIDTH

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-gray-700 bg-gray-800">
      <div ref={scrollRef} onScroll={handleScroll} className="overflow-auto" style={{ maxHeight: HEADER_HEIGHT + VISIBLE_HEIGHT }}>
        <div style={{ width: contentWidth }}>
          <div className="sticky top-0 z-20 flex bg-gray-800" style={{ height: HEADER_HEIGHT }}>
            <div className="sticky left-0 z-10 shrink-0 bg-gray-800" style={{ width: LABEL_COL_WIDTH }} />
            {days.map((day) => {
              const isToday = isSameDay(day, today)
              return (
                <div key={day.toISOString()} className="flex shrink-0 items-center justify-center" style={{ width: DAY_COL_WIDTH }}>
                  <button
                    type="button"
                    onClick={() => scrollToDay(day)}
                    className={`flex h-[31px] items-center justify-center whitespace-nowrap rounded-full px-4 text-caption-3 ${
                      isToday ? 'bg-lime text-gray-800' : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {isToday
                      ? `${WEEKDAY_LABELS[(day.getDay() + 6) % 7]} ${day.getDate()}`
                      : `${WEEKDAY_LABELS[(day.getDay() + 6) % 7]}${day.getDate()}`}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="flex border-t border-gray-700">
            <div className="sticky left-0 z-10 shrink-0 bg-gray-800" style={{ width: LABEL_COL_WIDTH }}>
              {HOURS.map((hour) => (
                <div key={hour} className="flex items-start justify-center pt-1 text-caption-2 text-white" style={{ height: ROW_HEIGHT }}>
                  {formatHourLabel(hour)}
                </div>
              ))}
            </div>

            <div className="flex">
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className="relative shrink-0 border-l border-gray-700"
                  style={{ width: DAY_COL_WIDTH, height: HOURS.length * ROW_HEIGHT }}
                  onContextMenu={(e) => handleColumnContextMenu(e, day)}
                >
                  {HOURS.map((hour) => (
                    <div key={hour} className="border-b border-gray-700 last:border-b-0" style={{ height: ROW_HEIGHT }} />
                  ))}

                  {appointments
                    .filter((a) => isSameDay(a.date, day))
                    .map((a) => {
                      const startOffset = a.startHour * 60 + a.startMinute - GRID_START_HOUR * 60
                      const durationMinutes = a.endHour * 60 + a.endMinute - (a.startHour * 60 + a.startMinute)
                      return (
                        <div
                          key={a.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEventClick(a, e.clientX, e.clientY)
                          }}
                          onContextMenu={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onEventContextMenu(a, e.clientX, e.clientY)
                          }}
                          className={`absolute left-1.5 right-1.5 flex cursor-pointer flex-col overflow-hidden rounded-[4px] border-l-[3.3px] bg-gray-750 px-3 py-2 hover:brightness-110 ${COLOR_CLASS[a.color]}`}
                          style={{ top: startOffset * PX_PER_MINUTE, height: Math.max(durationMinutes * PX_PER_MINUTE, 32) }}
                        >
                          <div className="flex items-end gap-2 whitespace-nowrap">
                            <span className="text-button-3 font-medium text-gray-200">{a.name}</span>
                            <span className="text-caption-3 text-white">
                              {formatEventTime(a.startHour, a.startMinute)}-{formatEventTime(a.endHour, a.endMinute)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
