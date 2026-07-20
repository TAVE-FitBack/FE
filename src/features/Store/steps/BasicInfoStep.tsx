import { useState } from 'react'
import { Input } from '../../../components/common/input'
import { StoreSetupLayout } from '../StoreSetupLayout'

export interface BasicInfo {
  name: string
  region: string
  phone: string
  businessNumber: string
}

const BUSINESS_NUMBER_PATTERN = /^\d{3}-\d{2}-\d{5}$/

interface BasicInfoStepProps {
  nickname: string
  initial: BasicInfo
  locked?: boolean
  onBack: () => void
  onNext: (info: BasicInfo) => void
}

export function BasicInfoStep({ nickname, initial, locked = false, onBack, onNext }: BasicInfoStepProps) {
  const [name, setName] = useState(initial.name)
  const [region, setRegion] = useState(initial.region)
  const [phone, setPhone] = useState(initial.phone)
  const [businessNumber, setBusinessNumber] = useState(initial.businessNumber)

  const businessNumberInvalid = businessNumber.length > 0 && !BUSINESS_NUMBER_PATTERN.test(businessNumber)

  return (
    <StoreSetupLayout
      nickname={nickname}
      onBack={onBack}
      onNext={() => onNext({ name, region, phone, businessNumber })}
      nextDisabled={name.trim().length === 0 || businessNumberInvalid}
    >
      <div className="mx-auto flex w-full max-w-[372px] flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-title-3 font-semibold text-white">매장 기본정보 설정</h2>
          <p className="text-body-3 text-gray-500">매장의 필수 정보를 입력해 주세요.</p>
        </div>

        <div className="flex w-full flex-col gap-9">
          <div className="flex flex-col gap-2">
            <label className="text-caption-3 text-gray-100">
              매장명<span className="text-lime">*</span>
            </label>
            <Input
              placeholder="예) 핏백"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              disabled={locked}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption-3 text-gray-100">지역</label>
            <Input placeholder="지역을 입력하세요." value={region} onChange={(e) => setRegion(e.target.value)} disabled={locked} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption-3 text-gray-100">매장 전화번호</label>
            <Input type="tel" placeholder="010-" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={locked} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption-3 text-gray-100">사업자번호</label>
            <Input
              placeholder="사업자 번호를 입력하세요"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              disabled={locked}
            />
            {businessNumberInvalid && (
              <p className="pl-2 text-caption-3 leading-none text-error">000-00-00000 형식으로 입력해주세요</p>
            )}
          </div>
        </div>

        <p className="text-center text-caption-3 text-gray-500">
          {locked
            ? '매장 업종을 선택해 매장이 이미 생성되어 이 정보는 더 이상 수정할 수 없습니다.'
            : (
              <>
                입력하신 정보는 서비스 이용 시 매장 정보로 활용됩니다.
                <br />
                정확한 정보를 입력해 주세요.
              </>
            )}
        </p>
      </div>
    </StoreSetupLayout>
  )
}
