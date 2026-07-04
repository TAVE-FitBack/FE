import headerLogoUrl from '../../../assets/logo/header_logo.png'

interface TermsDetailStepProps {
  onBack: () => void
  onAgree: () => void
}

const INTRO =
  '여러분을 환영합니다.\n\n어시스트핏 서비스 및 제품(이하 ‘서비스’)을 이용해 주셔서 감사합니다. 본 약관은 다양한 어시스트핏 서비스 이용과 관련하여 주식회사 어시스트핏(이하 ‘어시스트핏’)와 이를 이용하는 어시스트핏 서비스 회원(이하 ‘회원’)과의 관계를 설명하며, 아울러 여러분의 어시스트핏 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다.\n\n어시스트핏 서비스를 이용하시거나 어시스트핏 서비스 회원으로 가입하실 경우 여러분은 본 약관 및 관련 운영 정책을 확인하거나 동의하게 되므로, 잠시 시간을 내시어 주의 깊게 살펴봐 주시기 바랍니다.'

const SECTIONS: { heading: string; body: string }[] = [
  {
    heading: '1. 다양한 서비스를 즐겨보세요.',
    body: '웹사이트 및 응용프로그램(애플리케이션, 앱)을 통해 다양한 업무를 통합 제공하고 센터의 업무에 편리함을 더할 수 있는 다양한 서비스를 제공하고 있습니다.\n\n항목 / 서비스 내용\n수업 예약 일정 관리 — 트레이너(강사)가 모바일로 GX, PT, OT 등의 수업 예약 일정을 관리하는 서비스\n회원 관리 — 트레이너(강사)가 센터 내 등록된 회원들을 관리하는 서비스\n직원 관리 — 관리자가 트레이너(강사)를 등록하고 해당 서비스 가입 요청 건에 대해 관리하는 서비스\n락커 관리 — 트레이너(강사)가 회원에게 락커를 배정해줄 수 있는 서비스\n상담 관리 — 트레이너(강사)가 일반 상담, 방문 상담, 신규 상담 등의 상담 내용을 기록할 수 있는 서비스\n매출 관리 — 트레이너(강사)가 개인 매출을 실시간으로 확인할 수 있는 서비스\n급여 관리 — 관리자가 해당 센터의 트레이너(강사)의 매출을 확인하고 급여를 정산할 수 있는 서비스\n통계 관리 — 관리자가 트레이너(강사)별, 센터별 모든 매출을 카테고리별로 확인할 수 있는 서비스\n센터 출석 및 앱 연동 — 앱을 통해 센터 내 비치되어 있는 태블릿을 통해 출석하고 기록하는 서비스(QR, 번호입력, 안면 인식 등)\n식단 및 운동 일지 공유 — 회원과 트레이너(강사)와 식단과 운동일지를 서로 작성하여 공유할 수 있는 서비스\n상품 판매 및 결제 — 센터에서 판매하고 있는 상품(회원권, 개인 PT 등)을 등록하면 이를 회원이 모바일을 통해 결제할 수 있는 서비스\n이벤트 혜택 — 회사에서 주최하는 모든 회원을 위한 이벤트 혜택 서비스',
  },
  {
    heading: '저작권에 위배되는 경우',
    body: "본 약관은 한국어를 정본으로 합니다. 본 약관 또는 서비스와 관련된 여러분과 과의 관계에는 전자거래기본법, 전자서명법, 전자상거래 등에서의 소비자보호에 관한 법률 등 기타 관련법령이 적용됩니다. 그리고 본 약관 또는 서비스와 관련하여 여러분과 어시스트핏 사이에 분쟁이 발생할 경우, 그 분쟁의 처리는 본점이 소재하는 지역의 관할법원을 제1심의 전속적 합의관할 법원으로 하고, '민사소송법'에서 정한 절차를 따릅니다.",
  },
  {
    heading: '부칙',
    body: '공지 일자 : 2024-06-27\n적용 일자 : 2024-06-27\n\n어시스트핏 서비스와 관련하여 궁금하신 사항이 있으시면 고객센터(대표번호: 1566-9707/ 평일 10:00~19:00)로 문의 하시기 바랍니다.',
  },
  {
    heading: '개인정보 수집 및 이용 동의',
    body: '핏백(Fitback)은 회원가입 및 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.\n\n1. 수집하는 개인정보 항목\n필수 항목: 이메일 주소, 닉네임, 비밀번호. 서비스 이용 과정에서 접속 로그, 이용 기록 등이 자동으로 생성되어 수집될 수 있습니다.\n\n2. 개인정보의 수집 및 이용 목적\n회원 가입의사 확인, 서비스 제공에 따른 본인 식별 및 인증, 회원자격 유지·관리, 서비스 부정이용 방지, 고지 및 고충처리 목적으로 이용됩니다.\n\n3. 개인정보의 보유 및 이용 기간\n회원 탈퇴 시 지체 없이 파기합니다. 다만 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.',
  },
]

export function TermsDetailStep({ onBack, onAgree }: TermsDetailStepProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 lg:py-[132px]">
      <div className="relative flex w-full max-w-[796px] flex-col rounded border border-gray-700 bg-gray-900">
        <button
          type="button"
          onClick={onBack}
          aria-label="닫기"
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col gap-12 px-6 py-6 lg:px-12 lg:py-12">
          <img src={headerLogoUrl} alt="Fitback" className="h-[22px] w-fit" />

          <div className="flex flex-col gap-6">
            <h2 className="text-title-3 font-semibold text-gray-100">핏백(Fitback) 서비스 이용약관</h2>
            <p className="whitespace-pre-line text-body-3 text-gray-100">{INTRO}</p>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.heading} className="flex flex-col gap-[18px]">
              <h3 className="text-subtitle-2 font-semibold text-gray-100">{section.heading}</h3>
              <p className="whitespace-pre-line text-body-3 text-gray-100">{section.body}</p>
            </div>
          ))}

          <button
            type="button"
            onClick={onAgree}
            className="h-[52px] w-full rounded-full bg-lime text-button-3 font-medium text-black transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
