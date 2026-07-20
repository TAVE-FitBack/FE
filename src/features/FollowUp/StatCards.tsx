import type { FollowUpSummaryResponse } from '../../api/followUps'
import { icList } from '../../assets/icons'

interface StatCardProps {
  label: string
  count: number
}

function StatCard({ label, count }: StatCardProps) {
  return (
    <div className="flex w-full flex-1 flex-col justify-between gap-6 rounded-[30px] bg-gray-800 p-6">
      <div className="flex w-full items-start justify-between">
        <span className="text-body-3 text-gray-400">{label}</span>
        <img src={icList} alt="" aria-hidden className="h-[17px] w-auto" />
      </div>
      <span className="text-subtitle-2 font-semibold text-gray-200">{count}건</span>
    </div>
  )
}

interface StatCardsProps {
  summary: FollowUpSummaryResponse | null
}

export function StatCards({ summary }: StatCardsProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <StatCard label="오늘 연락 리스트" count={summary?.todayPendingCount ?? 0} />
      <StatCard label="2차 재연락 예정자" count={summary?.secondRoundPendingCount ?? 0} />
      <StatCard label="미처리 연락" count={summary?.overdueCount ?? 0} />
      <StatCard label="이번 달 후속관리 대상" count={summary?.thisMonthPendingCount ?? 0} />
    </div>
  )
}
