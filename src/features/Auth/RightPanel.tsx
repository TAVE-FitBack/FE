import fitnessBg from '../../assets/images/login-bg.jpg'
import logoFullUrl from '../../assets/logo/store_header_logo.png'

interface RightPanelProps {
  logoSrc?: string
}

export function RightPanel({ logoSrc = logoFullUrl }: RightPanelProps) {
  return (
    <div className="relative hidden flex-1 overflow-hidden lg:block">
      <div className="absolute inset-0 opacity-100">
        <img src={fitnessBg} alt="" aria-hidden className="h-full w-full object-cover grayscale" />
        <div className="absolute inset-0 bg-white mix-blend-saturation" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#111508] via-transparent to-transparent" />
      <div className="absolute bottom-[40%] left-[20%] right-[8%] flex flex-col items-center gap-[30px]">
        <img src={logoSrc} alt="Fitback" className="h-auto w-full max-w-[400px]" />
        <p className="max-w-[446px] text-center text-panel-1 leading-relaxed text-gray-300">
          Fitback와 함께 데이터 기반
          <br />
          피트니스 상담 관리를 시작하세요.
        </p>
      </div>
    </div>
  )
}
