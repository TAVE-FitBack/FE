export interface VisitPathRow {
  label: string
  registeredRate: number
  totalRate: number
}

interface VisitPathBreakdownCardProps {
  rows: VisitPathRow[]
}

export function VisitPathBreakdownCard({ rows }: VisitPathBreakdownCardProps) {
  return (
    <div className="flex h-full flex-col gap-6 rounded-[28px] border border-gray-700 bg-gray-800 p-6">
      <div className="flex min-w-0 items-center justify-between gap-2">
        <h3 className="truncate text-body-2 text-gray-200">방문경로</h3>
        <span className="shrink-0 whitespace-nowrap text-caption-2 text-gray-500">등록비중/상담비중</span>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map(({ label, registeredRate, totalRate }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-16 shrink-0 truncate text-right text-caption-2 text-gray-500">{label}</span>
            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-black">
              {registeredRate > totalRate ? (
                <>
                  <div className="absolute inset-y-0 left-0 rounded-full bg-lime" style={{ width: `${registeredRate}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gray-600" style={{ width: `${totalRate}%` }} />
                </>
              ) : (
                <>
                  <div className="absolute inset-y-0 left-0 rounded-full bg-gray-600" style={{ width: `${totalRate}%` }} />
                  <div className="absolute inset-y-0 left-0 rounded-full bg-lime" style={{ width: `${registeredRate}%` }} />
                </>
              )}
            </div>
            <span className="w-8 shrink-0 text-right text-caption-2 text-gray-200">{registeredRate}%</span>
            <span className="w-8 shrink-0 text-right text-caption-2 text-gray-400">{totalRate}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
