export interface MonthlyBreakdownRow {
  key: string
  label: string
  percent: number
  count: number
}

interface MonthlyBreakdownPanelProps {
  rows: MonthlyBreakdownRow[]
  /** 전월 대비 증감률(%p). 6개월 창의 첫 달처럼 비교할 이전 달 데이터가 없으면 null */
  momChange: number | null
}

function UpArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 4 L20 18 L4 18 Z" />
    </svg>
  )
}

export function MonthlyBreakdownPanel({ rows, momChange }: MonthlyBreakdownPanelProps) {
  const [first, ...rest] = rows

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-[24px] border border-gray-700 bg-gray-800 px-5 py-6">
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="w-full truncate text-body-3 font-medium text-gray-100">{first.label}</span>
          <div className="flex min-w-0 items-center justify-between">
            <span className="truncate text-title-3 font-semibold text-lime">{first.percent}%</span>
            <span className="shrink-0 truncate text-title-3 font-semibold text-lime">{first.count}명</span>
          </div>
        </div>

        {rest.map((row) => (
          <div key={row.key} className="flex min-w-0 flex-col gap-1">
            <span className="w-full truncate text-body-3 text-gray-400">{row.label}</span>
            <div className="flex min-w-0 items-center justify-between">
              <span className="truncate text-subtitle-2 font-semibold text-lime-light">{row.percent}%</span>
              <span className="shrink-0 truncate text-subtitle-2 font-semibold text-lime-light">{String(row.count).padStart(2, '0')}명</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <span className="w-full truncate text-body-3 font-medium text-gray-100">전월 대비 {first.label} 신규 등록 증감률</span>
        <div className="flex h-9 items-center">
          {momChange === null ? (
            <span className="text-caption-3 text-gray-500">확인 불가</span>
          ) : (
            <div className="flex items-center gap-1">
              <span className="text-title-3 whitespace-nowrap font-semibold text-lime">{momChange}%</span>
              <span className={`inline-flex text-lime ${momChange < 0 ? 'rotate-180' : ''}`}>
                <UpArrowIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
