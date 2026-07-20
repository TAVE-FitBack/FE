import { useState, type ReactNode } from 'react'
import { StoreSetupLayout } from '../StoreSetupLayout'

interface RoleSelectStepProps {
  nickname: string
  onBack: () => void
  onNext: () => void
  onSkip: () => void
}

export function RoleSelectStep({ nickname, onBack, onNext, onSkip }: RoleSelectStepProps) {
  const [role, setRole] = useState<'owner' | null>(null)

  return (
    <StoreSetupLayout nickname={nickname} onBack={onBack} onNext={onNext} nextDisabled={role !== 'owner'}>
      <div className="flex flex-col items-center gap-[80px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-title-3 font-semibold text-white">
            환영합니다! 당신의 역할은 무엇인가요?
          </h2>
          <p className="text-body-3 text-white/50">역할에 따라 서비스 이용 환경이 구성됩니다.</p>
        </div>

        <div className="flex flex-col items-center gap-[44px]">
          <div className="flex flex-col gap-4 sm:flex-row">
            <RoleCard
              title="사장님 / 관리자"
              description="새로운 매장을 만들고 멤버를 초대합니다."
              icon={<OwnerIcon />}
              selected={role === 'owner'}
              onClick={() => setRole('owner')}
            />
            <RoleCard
              title="직원"
              description="초대 코드로 기존 매장에 합류합니다."
              icon={<StaffIcon />}
              disabled
            />
          </div>

          <button
            type="button"
            onClick={onSkip}
            className="border-b border-gray-300 pb-1 text-body-3 text-gray-300 underline underline-offset-4"
          >
            나중에 설정하기 (체험하기)
          </button>
        </div>
      </div>
    </StoreSetupLayout>
  )
}

function RoleCard({
  title,
  description,
  icon,
  selected = false,
  disabled = false,
  onClick,
}: {
  title: string
  description: string
  icon: ReactNode
  selected?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full max-w-[320px] flex-col items-start gap-6 rounded-[24px] border p-8 text-left transition-colors ${
        selected
          ? 'border-lime bg-gray-900'
          : disabled
            ? 'cursor-not-allowed border-transparent bg-gray-700 opacity-60'
            : 'border-transparent bg-gray-700 hover:bg-gray-600'
      }`}
    >
      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-xl border ${
          selected ? 'border-lime bg-gray-700' : 'border-lime bg-gray-700'
        }`}
      >
        {icon}
      </span>
      <span className="flex flex-col gap-3">
        <span className="text-body-1 font-medium tracking-tight text-gray-200">{title}</span>
        <span className="text-caption-2 text-gray-400">{description}</span>
      </span>
    </button>
  )
}

function OwnerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cf0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 21v-6h6v6" />
    </svg>
  )
}

function StaffIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#cf0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M19 8h3M20.5 6.5v3" />
    </svg>
  )
}
