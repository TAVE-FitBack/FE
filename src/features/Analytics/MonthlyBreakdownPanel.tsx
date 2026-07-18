import type { MonthlyBreakdownRow } from './data'

interface MonthlyBreakdownPanelProps {
  rows: MonthlyBreakdownRow[]
  momChange: number
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
    <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-gray-700 p-5">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-body-3 text-gray-300">{first.label}</span>
          <div className="flex items-baseline gap-6">
            <span className="text-title-3 font-semibold text-lime">{first.percent}%</span>
            <span className="text-title-3 font-semibold text-lime">{first.count}명</span>
          </div>
        </div>

        {rest.map((row) => (
          <div key={row.key} className="flex flex-col gap-1.5 border-t border-gray-800 pt-4">
            <span className="text-caption-1 text-gray-300">{row.label}</span>
            <div className="flex items-baseline gap-6">
              <span className="text-subtitle-2 font-semibold text-lime">{row.percent}%</span>
              <span className="text-subtitle-2 font-semibold text-lime">{String(row.count).padStart(2, '0')}명</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-gray-800 pt-4">
        <span className="text-caption-2 text-gray-400">전월 대비 {first.label} 신규 등록 증감률</span>
        <div className="flex items-center gap-1.5">
          <span className="text-title-3 font-semibold text-lime">{momChange}%</span>
          <span className="text-lime">
            <UpArrowIcon />
          </span>
        </div>
      </div>
    </div>
  )
}
