import type { NonConversionReasonStat } from '../../../api/analysisReport'

interface NonConversionReasonsCardProps {
  reasons: NonConversionReasonStat[]
}

export function NonConversionReasonsCard({ reasons }: NonConversionReasonsCardProps) {
  return (
    <div
      className="flex h-full min-w-0 flex-col gap-5 rounded-[30px] border border-gray-700 px-7 py-5"
      style={{ backgroundImage: 'linear-gradient(50deg, var(--color-gray-800) 38%, var(--color-gray-900) 125%)' }}
    >
      <h3 className="truncate text-body-2 font-medium text-gray-300">미등록 사유 그래프</h3>
      <div className="flex flex-col gap-3">
        {reasons.map((r) => (
          <div key={r.reasonType} className="flex h-8 items-center gap-2">
            <div
              className="flex h-8 shrink-0 items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-lime-light to-[#90b314] px-4"
              style={{ width: `${Math.max(r.rate, 10)}%` }}
            >
              <span className="size-1 shrink-0 rounded-full bg-black" />
              <span className="truncate text-caption-3 font-medium text-black">{r.displayName}</span>
            </div>
            <span className="text-button-2 font-semibold text-lime">{r.rate}%</span>
          </div>
        ))}
        {reasons.length === 0 && <p className="text-caption-3 text-gray-500">미등록 사유 데이터가 없습니다.</p>}
      </div>
    </div>
  )
}
