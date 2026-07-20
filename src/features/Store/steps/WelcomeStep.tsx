import { RightPanel } from '../../Auth/RightPanel'
import storeHeaderLogoUrl from '../../../assets/logo/store_header_logo.png'

interface WelcomeStepProps {
  nickname: string
  onNext: () => void
}

export function WelcomeStep({ nickname, onNext }: WelcomeStepProps) {
  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex w-full shrink-0 flex-col items-center justify-center px-6 py-12 lg:w-[48.3%]">
        <div className="flex w-full max-w-[374px] flex-col items-center gap-[137px]">
          <div className="flex flex-col items-center gap-[21px] text-center">
            <h1 className="text-title-3 font-semibold tracking-tight text-white">
              <span className="text-lime">{nickname}</span>님, 환영합니다!
            </h1>
            <p className="text-body-3 text-white/50">
              상담 기록부터 후속 고객 관리까지,
              <br />
              Fitback과 함께 시작해보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onNext}
            className="h-[52px] w-full rounded-full bg-lime text-button-3 font-medium tracking-tight text-black"
          >
            Fitback 시작하기
          </button>
        </div>
      </div>

      <RightPanel logoSrc={storeHeaderLogoUrl} />
    </div>
  )
}
