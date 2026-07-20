interface GaugeCardProps {
  registrationRate: number
  newConsultationCount: number
  newRegistrationCount: number
  nonRegisteredCount: number
}

export function GaugeCard({ registrationRate, newConsultationCount, newRegistrationCount, nonRegisteredCount }: GaugeCardProps) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-[28px] border border-gray-700 bg-[linear-gradient(46deg,var(--color-gray-800)_38%,var(--color-gray-900)_125%)] p-6">
      <div className="relative w-full max-w-[346px]">
        <svg viewBox="0 -10 328 185" className="w-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-coral)" />
              <stop offset="33%" stopColor="var(--color-coral)" />
              <stop offset="33%" stopColor="var(--color-blue)" />
              <stop offset="66%" stopColor="var(--color-blue)" />
              <stop offset="66%" stopColor="var(--color-lime)" />
              <stop offset="100%" stopColor="var(--color-lime)" />
            </linearGradient>
          </defs>
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
            stroke="url(#gaugeGradient)"
            strokeWidth="13"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${registrationRate} 100`}
          />
          <text x="9" y="172" textAnchor="middle" fontSize="12" fill="var(--color-gray-400)">
            0
          </text>
          <text x="319" y="172" textAnchor="middle" fontSize="12" fill="var(--color-gray-400)">
            100
          </text>
        </svg>
        <div className="absolute inset-x-0 top-[68px] flex flex-col items-center gap-1">
          <span className="text-button-3 text-gray-400">전체 신규 등록률</span>
          <span className="text-title-3 font-semibold text-lime">{registrationRate}%</span>
        </div>
      </div>

      <div className="flex w-full items-start gap-6">
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="text-title-3 font-semibold text-lime">{newConsultationCount}</span>
          <span className="text-caption-2 text-gray-400">신규 상담 건수</span>
        </div>
        <div className="h-[52px] w-px bg-gray-700" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="text-title-3 font-semibold text-lime">{newRegistrationCount}</span>
          <span className="text-caption-2 text-gray-400">신규 등록 수</span>
        </div>
        <div className="h-[52px] w-px bg-gray-700" />
        <div className="flex flex-1 flex-col items-start gap-1">
          <span className="text-title-3 font-semibold text-lime">{nonRegisteredCount}</span>
          <span className="text-caption-2 text-gray-400">미등록/보류 수</span>
        </div>
      </div>
    </div>
  )
}
