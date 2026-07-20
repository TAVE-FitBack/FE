import { useState, type ReactNode } from 'react'
import { StoreSetupLayout } from '../StoreSetupLayout'
import { TagSelect } from '../TagSelect'
import { createInflowPath, createService, deleteInflowPath, deleteService, type StoreType } from '../../../api/store'
import { ApiError } from '../../../api/client'

export interface TaggedItem {
  name: string
  id: string
}

export interface OperationInfo {
  storeType?: StoreType
  services: TaggedItem[]
  inflowPaths: TaggedItem[]
}

export interface OperationInfoSubmission {
  services: TaggedItem[]
  inflowPaths: TaggedItem[]
}

interface OperationInfoStepProps {
  nickname: string
  initial: OperationInfo
  onBack: () => void
  onNext: (info: OperationInfoSubmission) => void
  onSelectStoreType: (storeType: StoreType) => Promise<void>
}

const BUSINESS_TYPE_OPTIONS: { label: string; value: StoreType }[] = [
  { label: '헬스장', value: 'GYM' },
  { label: 'PT 스튜디오', value: 'PT_STUDIO' },
  { label: '필라테스', value: 'PILATES' },
  { label: '요가', value: 'YOGA' },
  { label: '크로스핏', value: 'CROSSFIT' },
  { label: '스피닝', value: 'SPINNING' },
  { label: '골프 아카데미', value: 'GOLF_ACADEMY' },
  { label: '수영장', value: 'SWIMMING' },
  { label: '기타', value: 'OTHER' },
]
const BUSINESS_TYPE_LABELS = BUSINESS_TYPE_OPTIONS.map((o) => o.label)

const SERVICE_PRESETS = ['헬스권', '스피닝', '골프', 'PT', '요가', '기타']
const INFLOW_PATH_PRESETS = ['워크인', '전화', '네이버예약', '지인소개', '인스타그램', '네이버톡톡', '기타']

export function OperationInfoStep({ nickname, initial, onBack, onNext, onSelectStoreType }: OperationInfoStepProps) {
  const initialBusinessTypeLabel = BUSINESS_TYPE_OPTIONS.find((o) => o.value === initial.storeType)?.label ?? ''

  const [businessType, setBusinessType] = useState<string[]>(initialBusinessTypeLabel ? [initialBusinessTypeLabel] : [])
  const [businessTypePending, setBusinessTypePending] = useState<string | undefined>()
  const [businessTypeError, setBusinessTypeError] = useState('')
  const storeCreated = businessType.length > 0

  const [serviceOptions, setServiceOptions] = useState<string[]>(() => {
    const custom = initial.services.map((s) => s.name).filter((n) => !SERVICE_PRESETS.includes(n))
    return [...SERVICE_PRESETS, ...custom]
  })
  const [services, setServices] = useState<TaggedItem[]>(initial.services)
  const [servicePending, setServicePending] = useState<string | undefined>()
  const [serviceError, setServiceError] = useState('')

  const [inflowPathOptions, setInflowPathOptions] = useState<string[]>(() => {
    const custom = initial.inflowPaths.map((p) => p.name).filter((n) => !INFLOW_PATH_PRESETS.includes(n))
    return [...INFLOW_PATH_PRESETS, ...custom]
  })
  const [inflowPaths, setInflowPaths] = useState<TaggedItem[]>(initial.inflowPaths)
  const [inflowPathPending, setInflowPathPending] = useState<string | undefined>()
  const [inflowPathError, setInflowPathError] = useState('')

  async function selectBusinessType(label: string) {
    if (businessTypePending || storeCreated) return
    const preset = BUSINESS_TYPE_OPTIONS.find((o) => o.label === label)!
    setBusinessTypePending(label)
    setBusinessTypeError('')
    try {
      await onSelectStoreType(preset.value)
      setBusinessType([label])
    } catch (err) {
      setBusinessTypeError(err instanceof ApiError ? err.message : '매장 생성에 실패했습니다.')
    } finally {
      setBusinessTypePending(undefined)
    }
  }

  async function toggleService(name: string) {
    if (servicePending) return
    const existing = services.find((s) => s.name === name)
    setServicePending(name)
    setServiceError('')
    try {
      if (existing) {
        await deleteService(existing.id)
        setServices((prev) => prev.filter((s) => s.name !== name))
      } else {
        const res = await createService(name)
        setServices((prev) => [...prev, { name, id: res.id }])
      }
    } catch (err) {
      setServiceError(err instanceof ApiError ? err.message : '서비스 저장에 실패했습니다.')
    } finally {
      setServicePending(undefined)
    }
  }

  function addCustomService(name: string) {
    setServiceOptions((prev) => (prev.includes(name) ? prev : [...prev, name]))
    void toggleService(name)
  }

  async function toggleInflowPath(name: string) {
    if (inflowPathPending) return
    const existing = inflowPaths.find((p) => p.name === name)
    setInflowPathPending(name)
    setInflowPathError('')
    try {
      if (existing) {
        await deleteInflowPath(existing.id)
        setInflowPaths((prev) => prev.filter((p) => p.name !== name))
      } else {
        const res = await createInflowPath(name)
        setInflowPaths((prev) => [...prev, { name, id: res.id }])
      }
    } catch (err) {
      setInflowPathError(err instanceof ApiError ? err.message : '방문 경로 저장에 실패했습니다.')
    } finally {
      setInflowPathPending(undefined)
    }
  }

  function addCustomInflowPath(name: string) {
    setInflowPathOptions((prev) => (prev.includes(name) ? prev : [...prev, name]))
    void toggleInflowPath(name)
  }

  const nextDisabled = !storeCreated || services.length === 0 || inflowPaths.length === 0

  function handleNext() {
    onNext({ services, inflowPaths })
  }

  return (
    <StoreSetupLayout nickname={nickname} onBack={onBack} onNext={handleNext} nextDisabled={nextDisabled}>
      <div className="mx-auto flex w-full max-w-[680px] flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-title-3 font-semibold text-white">업종 및 운영 방식 설정</h2>
          <p className="text-body-3 text-white/50">AI가 상담 맥락을 더 정확하게 이해할 수 있도록 매장의 운영 방식을 알려주세요.</p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <Section index="01" title="매장 업종" description="대표 업종을 선택해 주세요. 선택 시 매장이 바로 생성됩니다." error={businessTypeError}>
            <TagSelect
              options={BUSINESS_TYPE_LABELS}
              selected={businessType}
              onToggle={selectBusinessType}
              allowCustom={false}
              pendingValue={businessTypePending}
              disabled={storeCreated}
            />
          </Section>

          <Section
            index="02"
            title="제공 서비스"
            note="(복수 선택)"
            description={storeCreated ? '현재 제공하는 서비스를 모두 선택해 주세요.' : '먼저 매장 업종을 선택해 주세요.'}
            error={serviceError}
          >
            <TagSelect
              options={serviceOptions}
              selected={services.map((s) => s.name)}
              onToggle={toggleService}
              onAddCustom={addCustomService}
              pendingValue={servicePending}
              disabled={!storeCreated}
            />
          </Section>

          <Section
            index="03"
            title="방문 경로 설정"
            note="(복수 선택)"
            description={storeCreated ? '상담 및 체험 예약은 어디에서 접수하나요?' : '먼저 매장 업종을 선택해 주세요.'}
            error={inflowPathError}
          >
            <TagSelect
              options={inflowPathOptions}
              selected={inflowPaths.map((p) => p.name)}
              onToggle={toggleInflowPath}
              onAddCustom={addCustomInflowPath}
              pendingValue={inflowPathPending}
              disabled={!storeCreated}
            />
          </Section>
        </div>
      </div>
    </StoreSetupLayout>
  )
}

function Section({
  index,
  title,
  note,
  description,
  error,
  children,
}: {
  index: string
  title: string
  note?: string
  description: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-6 rounded-[30px] border border-gray-700 bg-white/5 p-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-subtitle-2 font-semibold text-lime">{index}</span>
          <span className="text-subtitle-2 font-medium text-gray-300">{title}</span>
          {note && <span className="text-caption-2 text-gray-500">{note}</span>}
        </div>
        <p className="text-body-3 font-medium text-gray-400">{description}</p>
      </div>
      {children}
      {error && <p className="text-caption-3 leading-none text-error">{error}</p>}
    </div>
  )
}
