import { useState } from 'react'
import type { ScheduleType } from '../../api/schedules'
import { DateField, FieldLabel } from '../Clients/registrationFormControls'
import { GENDER_OPTIONS, SCHEDULE_TYPE_OPTIONS, SERVICE_OPTIONS, type Gender } from './data'
import { fromDateInputValue, toDateInputValue } from './dateUtils'
import { GRID_END_HOUR, GRID_START_HOUR } from './gridConfig'
import { buildHalfHourSlots, formatAmPmTime, slotKey, slotToMinutes, type TimeSlot } from './scheduleFormat'

interface AddScheduleFormProps {
  initialDate: Date
  startHour: number
  startMinute: number
  initial?: {
    name: string
    gender: Gender
    service: string
    note: string
    scheduleType: ScheduleType
    endHour: number
    endMinute: number
  }
  submitLabel?: string
  onCancel: () => void
  onSubmit: (input: {
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
  }) => void
}

const ALL_SLOTS = buildHalfHourSlots(GRID_START_HOUR, GRID_END_HOUR + 1)
const START_SLOTS = ALL_SLOTS.slice(0, -1)

function ToggleChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center justify-center whitespace-nowrap rounded-full px-6 text-caption-3 font-medium text-gray-100 ${
        selected ? 'border border-lime bg-lime-light/20' : 'bg-gray-500'
      }`}
    >
      {label}
    </button>
  )
}

function TimeSelect({
  slots,
  value,
  onChange,
}: {
  slots: TimeSlot[]
  value: TimeSlot
  onChange: (slot: TimeSlot) => void
}) {
  return (
    <select
      value={slotKey(value)}
      onChange={(e) => {
        const next = slots.find((s) => slotKey(s) === e.target.value)
        if (next) onChange(next)
      }}
      className="h-[45px] flex-1 rounded-full bg-gray-750 px-4 text-body-3 text-gray-200 outline-none"
    >
      {slots.map((s) => (
        <option key={slotKey(s)} value={slotKey(s)}>
          {formatAmPmTime(s.hour, s.minute)}
        </option>
      ))}
    </select>
  )
}

export function AddScheduleForm({ initialDate, startHour, startMinute, initial, submitLabel, onCancel, onSubmit }: AddScheduleFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [gender, setGender] = useState<Gender>(initial?.gender ?? '여성')
  const [service, setService] = useState(initial?.service ?? SERVICE_OPTIONS[0])
  const [note, setNote] = useState(initial?.note ?? '')
  const [scheduleType, setScheduleType] = useState<ScheduleType>(initial?.scheduleType ?? 'CONSULTATION')
  const [dateStr, setDateStr] = useState(toDateInputValue(initialDate))
  const [start, setStart] = useState<TimeSlot>({ hour: startHour, minute: startMinute })
  const [end, setEnd] = useState<TimeSlot>(() => {
    if (initial) return { hour: initial.endHour, minute: initial.endMinute }
    const endTotal = startHour * 60 + startMinute + 30
    return { hour: Math.floor(endTotal / 60), minute: endTotal % 60 }
  })

  const endSlots = ALL_SLOTS.filter((s) => slotToMinutes(s) > slotToMinutes(start))
  const durationMinutes = slotToMinutes(end) - slotToMinutes(start)

  function handleStartChange(next: TimeSlot) {
    setStart(next)
    if (slotToMinutes(end) <= slotToMinutes(next)) {
      const bumped = slotToMinutes(next) + 30
      setEnd({ hour: Math.floor(bumped / 60), minute: bumped % 60 })
    }
  }

  function handleSubmit() {
    if (name.trim() === '' || dateStr === '' || durationMinutes <= 0) return
    onSubmit({
      name,
      gender,
      service,
      note,
      scheduleType,
      date: fromDateInputValue(dateStr),
      startHour: start.hour,
      startMinute: start.minute,
      endHour: end.hour,
      endMinute: end.minute,
    })
  }

  return (
    <div className="flex w-[324px] flex-col gap-5 rounded-[20px] bg-gray-700 p-6">
      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">이름</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="고객 이름 입력"
          className="h-11 w-full rounded-full bg-gray-750 px-4 text-body-3 text-gray-100 outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">성별</span>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((g) => (
            <ToggleChip key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel>날짜</FieldLabel>
        <DateField value={dateStr} onChange={setDateStr} paddingClassName="px-[16px]" tone="flat" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">방문 시간</span>
        <div className="flex items-center gap-2">
          <TimeSelect slots={START_SLOTS} value={start} onChange={handleStartChange} />
          <span className="text-caption-3 text-gray-400">~</span>
          <TimeSelect slots={endSlots} value={end} onChange={setEnd} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">상담</span>
        <div className="flex flex-wrap gap-2">
          {SCHEDULE_TYPE_OPTIONS.map((o) => (
            <ToggleChip key={o.value} label={o.label} selected={scheduleType === o.value} onClick={() => setScheduleType(o.value)} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">종목</span>
        <div className="flex flex-wrap gap-2">
          {SERVICE_OPTIONS.map((s) => (
            <ToggleChip key={s} label={s} selected={service === s} onClick={() => setService(s)} />
          ))}
        </div>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="특이사항이 있으면 기재해주세요."
        className="h-[90px] w-full resize-none rounded-[20px] bg-gray-750 p-4 text-body-3 text-gray-300 outline-none placeholder:text-gray-500"
      />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="flex h-[34px] items-center justify-center rounded-full px-4 text-caption-2 text-gray-400">
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={name.trim() === '' || dateStr === '' || durationMinutes <= 0}
          className="flex h-[34px] items-center justify-center rounded-full bg-lime px-4 text-caption-2 text-gray-700 disabled:opacity-50"
        >
          {submitLabel ?? '등록하기'}
        </button>
      </div>
    </div>
  )
}
