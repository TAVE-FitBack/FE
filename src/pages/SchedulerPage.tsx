import { useEffect, useState, type MouseEvent } from 'react'
import { MiniCalendar } from '../features/Scheduler/MiniCalendar'
import { ChecklistPanel } from '../features/Scheduler/ChecklistPanel'
import { MonthCalendarGrid, type EmptyCellClickInfo } from '../features/Scheduler/MonthCalendarGrid'
import { FloatingPanel } from '../features/Scheduler/FloatingPanel'
import { AddScheduleForm } from '../features/Scheduler/AddScheduleForm'
import { InfoCard } from '../features/Scheduler/InfoCard'
import { DeleteMenu } from '../features/Scheduler/DeleteMenu'
import { appointmentFromSchedule, genderToApi, type Appointment, type Gender } from '../features/Scheduler/data'
import { addMonths, daysInMonth, startOfDay, startOfMonth, toDateInputValue } from '../features/Scheduler/dateUtils'
import { to24HourString } from '../features/Scheduler/scheduleFormat'
import { createSchedule, deleteSchedule, getSchedules, updateSchedule, type ScheduleCreateRequest, type ScheduleType } from '../api/schedules'
import { ApiError } from '../api/client'

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points={direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function MonthNav({ monthAnchor, onChange }: { monthAnchor: Date; onChange: (next: Date) => void }) {
  return (
    <div className="flex items-center gap-4 rounded-full bg-gray-800 p-1">
      <button
        type="button"
        onClick={() => onChange(addMonths(monthAnchor, -1))}
        aria-label="이전 달"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gray-800 text-gray-300 hover:bg-white/5"
      >
        <ChevronIcon direction="left" />
      </button>
      <span className="text-button-1 text-gray-100">
        {monthAnchor.getFullYear()}년 {monthAnchor.getMonth() + 1}월
      </span>
      <button
        type="button"
        onClick={() => onChange(addMonths(monthAnchor, 1))}
        aria-label="다음 달"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-gray-800 text-gray-300 hover:bg-white/5"
      >
        <ChevronIcon direction="right" />
      </button>
    </div>
  )
}

type PopupState =
  | { type: 'add'; x: number; y: number; date: Date; hour: number; minute: number }
  | { type: 'info'; x: number; y: number; scheduleId: string }
  | { type: 'delete'; x: number; y: number; appointment: Appointment }
  | { type: 'edit'; x: number; y: number; appointment: Appointment }
  | null

interface ScheduleFormInput {
  name: string
  gender: Gender
  service: string
  note: string
  scheduleType: ScheduleType
  date: Date
  startHour: number
  startMinute: number
  endHour: number
  endMinute: number
}

function buildScheduleRequest(input: ScheduleFormInput): ScheduleCreateRequest {
  const dateStr = toDateInputValue(input.date)
  return {
    scheduleType: input.scheduleType,
    customerName: input.name.trim() || undefined,
    gender: genderToApi(input.gender),
    serviceName: input.service || undefined,
    startAt: `${dateStr}T${to24HourString(input.startHour, input.startMinute)}:00+09:00`,
    endAt: `${dateStr}T${to24HourString(input.endHour, input.endMinute)}:00+09:00`,
    memo: input.note.trim() || undefined,
  }
}

const today = startOfDay(new Date())

export function SchedulerPage() {
  const [monthAnchor, setMonthAnchor] = useState(startOfMonth(today))
  const [focusedDay, setFocusedDay] = useState(today)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [popup, setPopup] = useState<PopupState>(null)
  const [refreshToken, setRefreshToken] = useState(0)

  useEffect(() => {
    const startDate = toDateInputValue(monthAnchor)
    const endDate = toDateInputValue(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), daysInMonth(monthAnchor)))
    getSchedules(startDate, endDate)
      .then((res) => setAppointments(res.schedules.map(appointmentFromSchedule)))
      .catch((e) => setPageError(e instanceof ApiError ? e.message : '일정을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthAnchor.getTime(), refreshToken])

  function bumpRefresh() {
    setRefreshToken((v) => v + 1)
  }

  function closePopup() {
    setPopup(null)
  }

  function openAddPopupAt(x: number, y: number, date: Date, hour: number, minute: number) {
    setPopup({ type: 'add', x, y, date, hour, minute })
  }

  function handleMonthChange(next: Date) {
    setMonthAnchor(next)
  }

  function handleAddButtonClick(e: MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    openAddPopupAt(rect.right + 12, rect.top, startOfDay(focusedDay), 9, 0)
  }

  function handleEmptyCellContextMenu(info: EmptyCellClickInfo) {
    openAddPopupAt(info.x, info.y, info.date, info.hour, info.minute)
  }

  function handleEventClick(appointment: Appointment, x: number, y: number) {
    setPopup({ type: 'info', x, y, scheduleId: appointment.id })
  }

  function handleEventContextMenu(appointment: Appointment, x: number, y: number) {
    setPopup({ type: 'delete', x, y, appointment })
  }

  async function handleAddSubmit(input: ScheduleFormInput) {
    setPageError('')
    try {
      await createSchedule(buildScheduleRequest(input))
      bumpRefresh()
      closePopup()
    } catch (e) {
      setPageError(e instanceof ApiError ? e.message : '일정 등록에 실패했습니다.')
    }
  }

  async function handleDelete(id: string) {
    setPageError('')
    try {
      await deleteSchedule(id)
      bumpRefresh()
      closePopup()
    } catch (e) {
      setPageError(e instanceof ApiError ? e.message : '일정 삭제에 실패했습니다.')
    }
  }

  async function handleEditSubmit(input: ScheduleFormInput) {
    if (!popup || popup.type !== 'edit') return
    setPageError('')
    try {
      await updateSchedule(popup.appointment.id, buildScheduleRequest(input))
      bumpRefresh()
      closePopup()
    } catch (e) {
      setPageError(e instanceof ApiError ? e.message : '일정 수정에 실패했습니다.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-subtitle-2 font-semibold text-gray-200">스케줄러</h1>
        <MonthNav monthAnchor={monthAnchor} onChange={handleMonthChange} />
      </div>

      {pageError && <p className="text-caption-2 text-coral">{pageError}</p>}

      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[285px]">
          <MiniCalendar monthAnchor={monthAnchor} today={today} />
          <ChecklistPanel refreshKey={refreshToken} />
          <button
            type="button"
            onClick={handleAddButtonClick}
            className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[20px] bg-lime text-button-3 font-medium text-gray-800"
          >
            <PlusIcon />
            스케줄 추가
          </button>
        </div>

        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-gray-700 bg-gray-800 text-caption-3 text-gray-500">
              불러오는 중...
            </div>
          ) : (
            <MonthCalendarGrid
              monthAnchor={monthAnchor}
              today={today}
              appointments={appointments}
              onEmptyCellContextMenu={handleEmptyCellContextMenu}
              onEventClick={handleEventClick}
              onEventContextMenu={handleEventContextMenu}
              onFocusedDayChange={setFocusedDay}
            />
          )}
        </div>
      </div>

      {popup?.type === 'add' && (
        <FloatingPanel x={popup.x} y={popup.y} onClose={closePopup}>
          <AddScheduleForm initialDate={popup.date} startHour={popup.hour} startMinute={popup.minute} onCancel={closePopup} onSubmit={handleAddSubmit} />
        </FloatingPanel>
      )}
      {popup?.type === 'info' && (
        <FloatingPanel x={popup.x} y={popup.y} onClose={closePopup}>
          <InfoCard scheduleId={popup.scheduleId} />
        </FloatingPanel>
      )}
      {popup?.type === 'delete' && (
        <FloatingPanel x={popup.x} y={popup.y} onClose={closePopup}>
          <DeleteMenu
            onEdit={() => setPopup({ type: 'edit', x: popup.x, y: popup.y, appointment: popup.appointment })}
            onDelete={() => handleDelete(popup.appointment.id)}
          />
        </FloatingPanel>
      )}
      {popup?.type === 'edit' && (
        <FloatingPanel x={popup.x} y={popup.y} onClose={closePopup}>
          <AddScheduleForm
            initialDate={popup.appointment.date}
            startHour={popup.appointment.startHour}
            startMinute={popup.appointment.startMinute}
            initial={{
              name: popup.appointment.name,
              gender: popup.appointment.gender,
              service: popup.appointment.service,
              note: popup.appointment.note,
              scheduleType: popup.appointment.scheduleType,
              endHour: popup.appointment.endHour,
              endMinute: popup.appointment.endMinute,
            }}
            submitLabel="수정하기"
            onCancel={closePopup}
            onSubmit={handleEditSubmit}
          />
        </FloatingPanel>
      )}
    </div>
  )
}
