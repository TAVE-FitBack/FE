function ListIcon() {
  return (
    <svg width="15" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  )
}

interface StatCardProps {
  label: string
  count: number
  percent: number
  captionLabel: string
  captionCount: number
}

function StatCard({ label, count, percent, captionLabel, captionCount }: StatCardProps) {
  return (
    <div className="flex w-full flex-1 flex-col justify-between gap-6 rounded-[30px] bg-gray-800 p-6">
      <div className="flex w-full items-start justify-between">
        <span className="text-body-3 text-gray-400">{label}</span>
        <ListIcon />
      </div>
      <div className="flex w-full flex-col gap-1">
        <span className="text-subtitle-2 font-semibold text-gray-200">{count}건</span>
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-700">
          <div className="h-full rounded-full bg-lime" style={{ width: `${percent}%` }} />
        </div>
        <span className="text-caption-2 text-gray-500">
          {captionLabel} {percent}% ({captionCount}건)
        </span>
      </div>
    </div>
  )
}

export function StatCards() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <StatCard label="오늘 연락 리스트" count={124} percent={50} captionLabel="완료" captionCount={62} />
      <StatCard label="2차 재연락 예정자" count={124} percent={50} captionLabel="완료" captionCount={62} />
      <StatCard label="미처리 연락" count={124} percent={50} captionLabel="현재" captionCount={62} />
      <StatCard label="이번 달 후속관리 대상" count={124} percent={50} captionLabel="완료" captionCount={62} />
    </div>
  )
}
