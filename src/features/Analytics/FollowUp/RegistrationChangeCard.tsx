function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor" aria-hidden>
      <path d="M0 0 L11 5.5 L0 11 Z" />
    </svg>
  )
}

interface RegistrationChangeCardProps {
  beforeRate: number
  currentRate: number
}

export function RegistrationChangeCard({ beforeRate, currentRate }: RegistrationChangeCardProps) {
  return (
    <div
      className="flex h-full min-w-0 flex-col gap-6 rounded-[28px] border border-gray-700 px-7 py-5"
      style={{ backgroundImage: 'linear-gradient(63deg, var(--color-gray-800) 38%, var(--color-gray-900) 125%)' }}
    >
      <h3 className="truncate text-body-2 text-gray-300">후속관리 진행 후 신규 등록률 변화</h3>

      <div className="flex items-center gap-8">
        <div className="flex flex-col text-[#8d9c58]">
          <span className="text-caption-2">Before</span>
          <span className="text-[40px] font-semibold tracking-[-0.8px]">{beforeRate}%</span>
        </div>
        <span className="text-gray-500">
          <ArrowIcon />
        </span>
        <div className="flex flex-col">
          <span className="text-caption-2 text-[#b7cd66]">After</span>
          <span className="text-title-2 font-semibold text-lime">{currentRate}%</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <svg viewBox="0 0 200 200" className="size-[180px] shrink-0 -rotate-90">
          <defs>
            <linearGradient id="beforeArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3a3f1f" />
              <stop offset="100%" stopColor="#707d35" />
            </linearGradient>
            <linearGradient id="deltaArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8a9c3a" />
              <stop offset="100%" stopColor="var(--color-lime)" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="82" fill="none" stroke="var(--color-gray-800)" strokeWidth="36" pathLength={100} />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#beforeArcGradient)"
            strokeWidth="36"
            pathLength={100}
            strokeDasharray={`${beforeRate} 100`}
          />
          <circle
            cx="100"
            cy="100"
            r="82"
            fill="none"
            stroke="url(#deltaArcGradient)"
            strokeWidth="36"
            pathLength={100}
            strokeDasharray={`${Math.max(currentRate - beforeRate, 0)} 100`}
            strokeDashoffset={-beforeRate}
          />
        </svg>
      </div>
    </div>
  )
}
