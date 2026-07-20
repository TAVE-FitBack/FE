import type { ReactNode } from 'react'
import storeHeaderLogoUrl from '../../assets/logo/store_header_logo.png'

interface StoreSetupLayoutProps {
  nickname: string
  onBack?: () => void
  onNext: () => void
  nextDisabled?: boolean
  backLabel?: string
  nextLabel?: string
  secondaryAction?: { label: string; onClick: () => void }
  children: ReactNode
}

export function StoreSetupLayout({
  nickname,
  onBack,
  onNext,
  nextDisabled = false,
  backLabel = '이전',
  nextLabel = '다음',
  secondaryAction,
  children,
}: StoreSetupLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 pb-[105px]">
      <header className="flex h-[80px] items-center justify-between px-6 lg:px-[72px]">
        <img src={storeHeaderLogoUrl} alt="Fitback" className="h-[22px] w-auto" />
        <span className="text-body-3 text-lime">{nickname}</span>
      </header>

      <main className="mx-auto w-full max-w-[1044px] rounded-[30px] bg-gray-800 px-6 py-12 lg:px-[24px] lg:py-[112px]">
        {children}
      </main>

      <footer className="fixed inset-x-0 bottom-0 bg-gray-800 px-6 py-[27px] shadow-[0px_0px_12.5px_rgba(0,0,0,0.25)] lg:px-[75px]">
        <div className="mx-auto flex w-full max-w-[1044px] items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className="h-[52px] w-[164px] rounded-full bg-gray-700 text-button-3 font-medium text-gray-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            {backLabel}
          </button>
          <div className="flex items-center gap-3">
            {secondaryAction && (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="h-[52px] w-[164px] rounded-full bg-gray-700 text-button-3 font-medium text-gray-100 transition-colors"
              >
                {secondaryAction.label}
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className="h-[52px] w-[164px] rounded-full text-button-3 font-medium tracking-tight transition-colors disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-600 bg-lime text-black"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
