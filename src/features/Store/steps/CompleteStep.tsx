import storeLogoIconUrl from '../../../assets/logo/store-logo-icon.png'

interface CompleteStepProps {
  onEnter: () => void
}

export function CompleteStep({ onEnter }: CompleteStepProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-8 rounded-[30px] bg-gray-800 px-8 py-16">
        <div className="flex size-[120px] items-center justify-center rounded-full bg-gray-700">
          <img src={storeLogoIconUrl} alt="" className="h-[42px] w-auto" />
        </div>

        <div className="flex flex-col items-center gap-[21px] text-center">
          <h1 className="text-title-3 font-semibold text-white">설정이 완료되었습니다!</h1>
          <p className="text-body-3 text-white/50">대시보드로 이동하여 첫 고객을 만나보세요</p>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="h-[52px] w-full rounded-full bg-lime text-button-3 font-medium tracking-tight text-black"
        >
          입장하기
        </button>
      </div>
    </div>
  )
}
