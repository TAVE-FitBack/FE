const CARD_BG = { backgroundImage: 'linear-gradient(40deg, var(--color-gray-800) 38%, var(--color-gray-900) 125%)' }

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-start gap-5 rounded-[30px] border border-gray-700 px-7 py-5" style={CARD_BG}>
      <span className="w-full truncate text-body-1 text-gray-300">{label}</span>
      <span className="ml-auto shrink-0 text-title-2 font-semibold text-white">{value}</span>
    </div>
  )
}

function SuccessRateCard({ rate }: { rate: number }) {
  return (
    <div className="flex min-w-0 flex-[1.7] flex-col gap-2 overflow-hidden rounded-[30px] border border-gray-700 px-7 py-5" style={CARD_BG}>
      <span className="w-full truncate text-body-1 text-gray-300">후속연락 성공률</span>
      <div className="relative flex items-center gap-4">
        {/* 원 전체(반지름 155, 발끝 y=155)에서 위쪽 돔 부분만 보이도록 viewBox를 짧게 잘라서 아래쪽 발끝은 그대로 잘려나가게 함 */}
        <svg viewBox="0 -10 328 90" className="w-full max-w-[240px] shrink-0">
          <path d="M9,155 A155,155 0 1 1 319,155" fill="none" stroke="var(--color-gray-700)" strokeWidth="13" strokeLinecap="round" pathLength={100} />
          <path
            d="M9,155 A155,155 0 1 1 319,155"
            fill="none"
            stroke="var(--color-lime)"
            strokeWidth="13"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${rate} 100`}
          />
        </svg>
        <span className="shrink-0 text-title-2 font-semibold text-lime">{rate}%</span>
      </div>
    </div>
  )
}

interface FollowUpStatCardsProps {
  totalCount: number
  inProgressCount: number
  completedCount: number
  successRate: number
}

export function FollowUpStatCards({ totalCount, inProgressCount, completedCount, successRate }: FollowUpStatCardsProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <StatCard label="당월 전체 후속관리 대상자" value={`${totalCount}건`} />
      <StatCard label="후속관리 진행 중" value={`${inProgressCount}건`} />
      <StatCard label="후속관리 완료" value={`${completedCount}건`} />
      <SuccessRateCard rate={successRate} />
    </div>
  )
}
