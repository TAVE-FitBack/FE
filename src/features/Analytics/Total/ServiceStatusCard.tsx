import { Fragment } from 'react'

export interface ServiceStat {
  key: string
  label: string
  registered: number
  total: number
}

interface ServiceStatusCardProps {
  stats: ServiceStat[]
}

export function ServiceStatusCard({ stats }: ServiceStatusCardProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-5 rounded-[28px] border border-gray-700 bg-[linear-gradient(46deg,var(--color-gray-800)_38%,var(--color-gray-900)_125%)] p-6">
      <h3 className="truncate text-body-2 text-gray-200">종목별 상담 현황</h3>
      <div className="flex w-full items-start gap-6">
        {stats.map((s, i) => (
          <Fragment key={s.key}>
            {i > 0 && <div className="h-[52px] w-px shrink-0 bg-gray-700" />}
            <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
              <span className="whitespace-nowrap text-title-3 font-semibold text-white">
                {s.registered}
                <span className="text-body-2 font-normal text-gray-400">/{s.total} 건</span>
              </span>
              <span className="w-full truncate text-caption-2 text-gray-400">{s.label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
