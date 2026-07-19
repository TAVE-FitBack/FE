import type { ServiceStat } from './data'

interface ServiceStatusCardProps {
  stats: ServiceStat[]
}

export function ServiceStatusCard({ stats }: ServiceStatusCardProps) {
  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-gray-700 bg-[linear-gradient(46deg,var(--color-gray-800)_38%,var(--color-gray-900)_125%)] p-6">
      <h3 className="text-body-2 text-gray-200">종목별 상담 현황</h3>
      <div className="flex items-center justify-center gap-5">
        {stats.map((s, i) => (
          <div key={s.key} className="flex items-center gap-5">
            {i > 0 && <div className="h-[52px] w-px bg-gray-700" />}
            <div className="flex flex-1 flex-col items-start gap-1">
              <span className="text-title-3 font-semibold text-lime">
                {s.registered}
                <span className="text-body-2 font-normal text-gray-400">/{s.total} 건</span>
              </span>
              <span className="text-caption-2 text-gray-400">{s.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
