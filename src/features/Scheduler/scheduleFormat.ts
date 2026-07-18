export function formatAmPmTime(hour: number, minute: number): string {
  const period = hour < 12 ? 'am' : 'pm'
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:${String(minute).padStart(2, '0')}${period}`
}

export function formatVisitTimeRange(startHour: number, startMinute: number, endHour: number, endMinute: number): string {
  const durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute)
  return `${formatAmPmTime(startHour, startMinute)} - ${formatAmPmTime(endHour, endMinute)} (${durationMinutes}분)`
}

export interface TimeSlot {
  hour: number
  minute: number
}

/** 30분 단위 시간 슬롯 목록. endHourInclusive:00 을 마지막 슬롯으로 포함(종료 시간 선택용 상한). */
export function buildHalfHourSlots(startHour: number, endHourInclusive: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let h = startHour; h < endHourInclusive; h++) {
    slots.push({ hour: h, minute: 0 })
    slots.push({ hour: h, minute: 30 })
  }
  slots.push({ hour: endHourInclusive, minute: 0 })
  return slots
}

export function slotKey(slot: TimeSlot): string {
  return `${slot.hour}:${slot.minute}`
}

export function slotToMinutes(slot: TimeSlot): number {
  return slot.hour * 60 + slot.minute
}

export function to24HourString(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
