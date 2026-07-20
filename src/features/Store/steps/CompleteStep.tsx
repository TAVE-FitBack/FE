import storeHeaderLogoUrl from '../../../assets/logo/store_header_logo.png'
import storeLogoIconUrl from '../../../assets/logo/store-logo-icon.png'

interface CompleteStepProps {
  nickname: string
  onEnter: () => void
}

export function CompleteStep({ nickname, onEnter }: CompleteStepProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-900">
      <header className="flex h-[80px] items-center justify-between px-6 lg:px-[72px]">
        <img src={storeHeaderLogoUrl} alt="Fitback" className="h-[22px] w-auto" />
        <span className="text-body-3 text-lime">{nickname}</span>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <main className="flex w-full max-w-[1044px] items-center justify-center rounded-[30px] bg-gray-800 px-6 py-16 lg:px-[325px] lg:py-[112px]">
          <div className="flex w-full max-w-[394px] flex-col items-center gap-[10px]">
            <div className="flex size-[120px] items-center justify-center rounded-full bg-gray-700">
              <img src={storeLogoIconUrl} alt="" className="h-[42px] w-auto" />
            </div>

            <div className="mt-8 flex w-full max-w-[374px] flex-col items-center gap-[137px]">
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
        </main>
      </div>
    </div>
  )
}
