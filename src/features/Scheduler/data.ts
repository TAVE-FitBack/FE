import type { ScheduleGender, ScheduleResponse, ScheduleType } from '../../api/schedules'

export type AppointmentColor = 'lime' | 'coral' | 'coralLight'
export type Gender = '여성' | '남성'

export const GENDER_OPTIONS: Gender[] = ['여성', '남성']
export const SERVICE_OPTIONS = ['회원권', 'PT', '스피닝']

export const SCHEDULE_TYPE_OPTIONS: { value: ScheduleType; label: string }[] = [
  { value: 'CONSULTATION', label: '상담' },
  { value: 'VISIT', label: '방문' },
  { value: 'ETC', label: '기타' },
]

const SCHEDULE_TYPE_COLOR: Record<ScheduleType, AppointmentColor> = {
  CONSULTATION: 'lime',
  VISIT: 'coral',
  ETC: 'coralLight',
}

export interface Appointment {
  id: string
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
  color: AppointmentColor
}

export function genderToApi(gender: Gender): ScheduleGender {
  return gender === '여성' ? 'FEMALE' : 'MALE'
}

function genderFromApi(gender: ScheduleGender | undefined): Gender {
  return gender === 'MALE' ? '남성' : '여성'
}

/**
 * ISO 문자열을 한국(KST, UTC+9) 벽시계 시각으로 변환한다. 백엔드가 응답을 "+09:00" 오프셋
 * 그대로 내려주든 UTC("Z")로 정규화해서 내려주든 항상 올바른 한국 시각을 읽도록,
 * 문자열의 숫자를 그대로 자르지 않고 실제 타임존 오프셋을 반영해 계산한다.
 */
function parseIsoLocal(iso: string): { date: Date; hour: number; minute: number } {
  const utc = new Date(iso)
  if (Number.isNaN(utc.getTime())) return { date: new Date(), hour: 0, minute: 0 }
  const kst = new Date(utc.getTime() + 9 * 60 * 60 * 1000)
  return {
    date: new Date(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()),
    hour: kst.getUTCHours(),
    minute: kst.getUTCMinutes(),
  }
}

export function appointmentFromSchedule(schedule: ScheduleResponse): Appointment {
  const start = parseIsoLocal(schedule.startAt)
  const end = parseIsoLocal(schedule.endAt)
  return {
    id: schedule.scheduleId,
    name: schedule.customerName?.trim() || SCHEDULE_TYPE_OPTIONS.find((o) => o.value === schedule.scheduleType)!.label,
    gender: genderFromApi(schedule.gender),
    service: schedule.serviceName ?? '',
    note: schedule.memo?.trim() || '없음',
    scheduleType: schedule.scheduleType,
    date: start.date,
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
    color: SCHEDULE_TYPE_COLOR[schedule.scheduleType],
  }
}
