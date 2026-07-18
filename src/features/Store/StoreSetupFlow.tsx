import { useState, type FormEvent } from 'react'
import { Input } from '../../components/common/input'
import { RightPanel } from '../Auth/RightPanel'
import { setupStore, type StoreType } from '../../api/store'
import { ApiError } from '../../api/client'

interface StoreSetupFlowProps {
  onComplete: (storeId: string) => void
}

const STORE_TYPE_OPTIONS: { value: StoreType; label: string }[] = [
  { value: 'GYM', label: '헬스장' },
  { value: 'OTHER', label: '기타' },
]

const BUSINESS_NUMBER_PATTERN = /^\d{3}-\d{2}-\d{5}$/

export function StoreSetupFlow({ onComplete }: StoreSetupFlowProps) {
  const [name, setName] = useState('')
  const [storeType, setStoreType] = useState<StoreType | null>(null)
  const [phone, setPhone] = useState('')
  const [businessNumber, setBusinessNumber] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const businessNumberInvalid = businessNumber.length > 0 && !BUSINESS_NUMBER_PATTERN.test(businessNumber)
  const canSubmit = name.trim().length > 0 && storeType !== null && !businessNumberInvalid

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await setupStore({
        name,
        storeType: storeType!,
        phone: phone || undefined,
        businessNumber: businessNumber || undefined,
        address: address || undefined,
      })
      onComplete(res.storeId)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '매장 설정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex w-full shrink-0 flex-col items-center justify-center px-6 py-12 lg:w-[48.3%]">
        <div className="w-full max-w-[392px]">
          <div className="mb-[42px] flex flex-col gap-2">
            <h1 className="pt-2 text-center font-bold tracking-tight text-title-3 text-white">매장 정보 설정</h1>
            <p className="text-center text-body-3 text-white/50">첫 로그인이시네요. 매장 정보를 입력해 주세요.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-caption-3 text-gray-100">매장명</label>
              <Input
                placeholder="매장명을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption-3 text-gray-100">업종</label>
              <div className="flex gap-2">
                {STORE_TYPE_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setStoreType(o.value)}
                    className={`h-[54px] flex-1 rounded-full border text-button-3 font-medium transition-colors ${
                      storeType === o.value
                        ? 'border-lime bg-lime/10 text-lime'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption-3 text-gray-100">전화번호</label>
              <Input
                type="tel"
                placeholder="02-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption-3 text-gray-100">사업자등록번호</label>
              <Input
                placeholder="000-00-00000"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
              />
              {businessNumberInvalid && (
                <p className="pl-2 text-caption-3 leading-none text-error">000-00-00000 형식으로 입력해주세요</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-caption-3 text-gray-100">주소</label>
              <Input placeholder="매장 주소를 입력해주세요" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>

            {error && <p className="pl-2 text-caption-3 leading-none text-error">{error}</p>}

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={`mt-2 h-[54px] w-full rounded-full text-button-3 font-medium tracking-tight transition-colors disabled:cursor-not-allowed ${
                canSubmit && !submitting ? 'bg-lime text-black' : 'bg-gray-500 text-gray-600'
              }`}
            >
              {submitting ? '설정 중...' : '매장 설정 완료'}
            </button>
          </form>
        </div>
      </div>

      <RightPanel />
    </div>
  )
}
