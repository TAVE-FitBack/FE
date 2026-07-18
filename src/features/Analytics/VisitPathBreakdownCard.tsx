import type { VisitPathRow } from './data'

interface VisitPathBreakdownCardProps {
  rows: VisitPathRow[]
}

export function VisitPathBreakdownCard({ rows }: VisitPathBreakdownCardProps) {
  return (
    <div className="flex h-full flex-col gap-6 rounded-[28px] border border-gray-700 bg-gray-800 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-body-2 text-gray-200">방문경로</h3>
        <span className="text-caption-2 text-gray-500">등록완료 / 전체</span>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map(({ label, registeredRate, totalRate }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-caption-2 text-gray-400">{label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-700">
              <div className="h-full rounded-full bg-lime" style={{ width: `${registeredRate}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right text-caption-2 text-gray-400">{registeredRate}%</span>
            <span className="w-8 shrink-0 text-right text-caption-2 font-medium text-gray-200">{totalRate}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
