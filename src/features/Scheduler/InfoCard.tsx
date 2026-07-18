import { useEffect, useState } from 'react'
import { getScheduleDetail, type ScheduleDetailResponse } from '../../api/schedules'
import { ApiError } from '../../api/client'
import { SCHEDULE_TYPE_OPTIONS } from './data'
import { formatVisitTimeRange } from './scheduleFormat'

interface InfoCardProps {
  scheduleId: string
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-body-3 font-medium text-gray-400">
      {label} : {value}
    </span>
  )
}

/** "2026-07-18T10:30:00+09:00" 문자열에서 지역시간 그대로 시/분을 읽어온다. */
function parseHourMinute(iso: string): { hour: number; minute: number } {
  const match = iso.match(/T(\d{2}):(\d{2})/)
  return match ? { hour: Number(match[1]), minute: Number(match[2]) } : { hour: 0, minute: 0 }
}

export function InfoCard({ scheduleId }: InfoCardProps) {
  const [detail, setDetail] = useState<ScheduleDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getScheduleDetail(scheduleId)
      .then(setDetail)
      .catch((e) => setError(e instanceof ApiError ? e.message : '일정 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [scheduleId])

  if (loading) {
    return <div className="flex w-[280px] flex-col gap-2.5 rounded-[20px] border border-gray-600 bg-gray-800 p-5 text-caption-3 text-gray-500">불러오는 중...</div>
  }
  if (error || !detail) {
    return (
      <div className="flex w-[280px] flex-col gap-2.5 rounded-[20px] border border-gray-600 bg-gray-800 p-5 text-caption-3 text-error">
        {error || '일정 정보를 찾을 수 없습니다.'}
      </div>
    )
  }

  const start = parseHourMinute(detail.startAt)
  const end = parseHourMinute(detail.endAt)
  const timeLabel = formatVisitTimeRange(start.hour, start.minute, end.hour, end.minute)
  const typeLabel = SCHEDULE_TYPE_OPTIONS.find((o) => o.value === detail.scheduleType)?.label ?? detail.scheduleType

  return (
    <div className="flex w-[280px] flex-col gap-2.5 rounded-[20px] border border-gray-600 bg-gray-800 p-5">
      <InfoRow label="종류" value={typeLabel} />
      {detail.customerName && <InfoRow label="이름" value={detail.customerName} />}
      {detail.gender && <InfoRow label="성별" value={detail.gender === 'FEMALE' ? '여' : '남'} />}
      {detail.serviceName && <InfoRow label="종목" value={detail.serviceName} />}

      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">방문 시간</span>
        <div className="flex h-[45px] w-full items-center rounded-full bg-gray-750 px-4 text-body-3 text-gray-300">{timeLabel}</div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-300">특이사항</span>
        <div className="min-h-[80px] w-full rounded-[20px] bg-gray-750 p-4 text-body-3 text-gray-300">{detail.memo?.trim() || '없음'}</div>
      </div>
    </div>
  )
}
