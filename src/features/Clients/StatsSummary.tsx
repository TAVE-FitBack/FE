import type { CustomerManagementSummaryResponse } from '../../api/customerManagement'

interface StatsSummaryProps {
  summary: CustomerManagementSummaryResponse | null
}

const EMPTY_BAR_PLACEHOLDERS = ['a', 'b', 'c']

const RATIO_BAR_COLORS: readonly string[] = [
  'bg-gradient-to-r from-coral-light to-coral',
  'bg-gradient-to-r from-lime-light to-lime',
  'bg-gradient-to-l from-blue to-blue-light',
]

function RegistrationRateCard({ summary }: StatsSummaryProps) {
  const registrationRate = summary?.registrationRate ?? 0

  return (
    <div className="flex h-[307px] flex-1 flex-col items-center gap-2 rounded border border-gray-700 bg-[linear-gradient(48deg,var(--color-gray-800)_38%,var(--color-gray-900)_125%)] px-6 py-5">
      <div className="relative w-full max-w-[328px]">
        <svg viewBox="0 -10 328 195" className="w-full">
          <path
            d="M9,155 A155,155 0 1 1 319,155"
            fill="none"
            stroke="var(--color-gray-800)"
            strokeWidth="13"
            strokeLinecap="round"
            pathLength={100}
          />
          <path
            d="M9,155 A155,155 0 1 1 319,155"
            fill="none"
            stroke="var(--color-lime-light)"
            strokeWidth="13"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${registrationRate} 100`}
          />
        </svg>
        <div className="absolute inset-x-0 top-[62px] flex flex-col items-center gap-1">
          <span className="text-button-3 text-gray-400">등록률</span>
          <span className="text-title-3 font-semibold text-lime">{registrationRate}%</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between">
          <span className="text-caption-2 text-gray-400">0</span>
          <span className="text-caption-2 text-gray-400">100</span>
        </div>
      </div>

      <div className="flex w-full items-center justify-center gap-6">
        <div className="flex flex-col items-start gap-1">
          <span className="text-title-3 font-semibold text-lime">{summary?.newConsultationCount ?? 0}</span>
          <span className="text-caption-2 text-gray-400">신규 상담 건수</span>
        </div>
        <div className="h-[52px] w-px bg-gray-700" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-title-3 font-semibold text-lime">{summary?.newRegistrationCount ?? 0}</span>
          <span className="text-caption-2 text-gray-400">신규 등록 수</span>
        </div>
        <div className="h-[52px] w-px bg-gray-700" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-title-3 font-semibold text-lime">{summary?.nonRegisteredCount ?? 0}</span>
          <span className="text-caption-2 text-gray-400">미등록/보류 수</span>
        </div>
      </div>
    </div>
  )
}

function ItemRatioCard({ summary }: StatsSummaryProps) {
  const rates = summary?.serviceConsultationRates ?? []

  return (
    <div className="flex h-[307px] flex-1 flex-col gap-5 rounded-[28px] border border-gray-700 bg-gray-800 px-8 py-5">
      <h3 className="truncate text-body-3 text-gray-300">종목별 상담 비율</h3>
      <div className="flex flex-1 flex-col justify-center gap-8">
        {rates.length === 0
          ? EMPTY_BAR_PLACEHOLDERS.map((key) => <div key={key} className="h-9 w-full rounded-full bg-black/30" />)
          : rates.map(({ serviceId, serviceName, rate }, index) => (
              <div key={serviceId} className="relative h-9 w-full overflow-hidden rounded-full bg-black/30">
                <div
                  className={`flex h-full min-w-0 items-center justify-between gap-2 rounded-full px-5 text-white ${RATIO_BAR_COLORS[index % RATIO_BAR_COLORS.length]}`}
                  style={{ width: `${rate}%` }}
                >
                  <span className="truncate text-caption-2 font-bold">{serviceName}</span>
                  <span className="shrink-0 text-button-1 font-semibold">{rate}%</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}

const RANK_OPACITY = ['opacity-100', 'opacity-70', 'opacity-50']
const DEFAULT_OPACITY = 'opacity-30'

function VisitPathCard({ summary }: StatsSummaryProps) {
  const rates = [...(summary?.inflowPathRates ?? [])].sort((a, b) => b.rate - a.rate)

  return (
    <div className="flex h-[307px] flex-1 flex-col gap-5 rounded border border-gray-700 bg-[linear-gradient(48deg,var(--color-gray-800)_38%,var(--color-gray-900)_125%)] px-8 py-5">
      <h3 className="text-body-3 text-gray-300">방문경로</h3>
      <div className="flex flex-col gap-3">
        {rates.map(({ inflowPathId, inflowPathName, rate }, index) => (
          <div key={inflowPathId} className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-right text-caption-2 text-gray-500">{inflowPathName}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full bg-lime ${RANK_OPACITY[index] ?? DEFAULT_OPACITY}`}
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="w-8 shrink-0 text-right text-caption-2 font-medium text-gray-200">{rate}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatsSummary({ summary }: StatsSummaryProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <RegistrationRateCard summary={summary} />
      <ItemRatioCard summary={summary} />
      <VisitPathCard summary={summary} />
    </div>
  )
}
