import { useRef, useState } from 'react'
import type { Gender, InquiryNewResponse, InquiryStatus } from '../../api/customerManagement'
import {
  createInquiry,
  checkInquiryPreview,
  type InquiryCheckPreviewResponse,
  type InquiryCreateRequest,
  type PreferredContactChannel,
} from '../../api/inquiries'
import { ApiError } from '../../api/client'
import {
  AI_CHECK_ITEMS,
  CheckCircleIcon,
  CloseIcon,
  DateField,
  DateTimeField,
  FieldLabel,
  GENDER_OPTIONS,
  SelectField,
  SparkleIcon,
  ToggleGroup,
  inputClass,
} from './registrationFormControls'

interface NewInquiryModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
  filterOptions: InquiryNewResponse | null
}

const CONTACT_CHANNEL_OPTIONS: { value: PreferredContactChannel; label: string }[] = [
  { value: 'SMS', label: '문자' },
  { value: 'PHONE', label: '전화' },
  { value: 'KAKAO', label: '카카오' },
]

export function NewInquiryModal({ open, onClose, onCreated, filterOptions }: NewInquiryModalProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [phone, setPhone] = useState('')
  const [preferredContactChannel, setPreferredContactChannel] = useState<PreferredContactChannel | ''>('')
  const [inquiryDate, setInquiryDate] = useState('')
  const [inquiryTime, setInquiryTime] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [inflowPathId, setInflowPathId] = useState('')
  const [counselorId, setCounselorId] = useState('')
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatus | ''>('')
  const [visitScheduledDate, setVisitScheduledDate] = useState('')
  const [visitScheduledTime, setVisitScheduledTime] = useState('')
  const [memo, setMemo] = useState('')
  const [attachments, setAttachments] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [aiCheckResult, setAiCheckResult] = useState<InquiryCheckPreviewResponse | null>(null)
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (!open) return null

  const services = filterOptions?.services ?? []
  const inflowPaths = filterOptions?.inflowPaths ?? []
  const counselors = filterOptions?.counselors ?? []
  const statusOptions = (filterOptions?.inquiryStatuses ?? [])
    .filter((s) => s.status !== 'CONVERTED')
    .map((s) => ({ value: s.status, label: s.label }))

  function resetCheck() {
    setAiCheckResult(null)
    setCheckError('')
  }

  function buildRequest(): InquiryCreateRequest | null {
    if (
      name.trim() === '' ||
      gender === '' ||
      birthDate === '' ||
      phone.trim() === '' ||
      preferredContactChannel === '' ||
      inflowPathId === '' ||
      serviceId === '' ||
      counselorId === '' ||
      inquiryStatus === '' ||
      inquiryDate === '' ||
      inquiryTime === '' ||
      memo.trim() === ''
    ) {
      return null
    }
    return {
      customer: {
        name,
        gender,
        birthDate,
        phoneNum: phone,
        preferredContactChannel,
        inflowPathId,
      },
      inquiry: {
        serviceId,
        userId: counselorId,
        inquiryStatus,
        inquiredAt: `${inquiryDate}T${inquiryTime}:00`,
        visitScheduledAt: visitScheduledDate && visitScheduledTime ? `${visitScheduledDate}T${visitScheduledTime}:00` : undefined,
        rawText: memo,
      },
    }
  }

  const canCheck = buildRequest() !== null
  const canSubmit = aiCheckResult !== null && canCheck

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setAttachments((prev) => [...prev, ...Array.from(fileList).map((f) => f.name)])
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((f) => f !== fileName))
  }

  async function handleCheck() {
    const req = buildRequest()
    if (!req || checking) return
    setChecking(true)
    setCheckError('')
    try {
      const result = await checkInquiryPreview(req)
      setAiCheckResult(result)
    } catch (err) {
      setCheckError(err instanceof ApiError ? err.message : 'AI 중간점검에 실패했습니다.')
    } finally {
      setChecking(false)
    }
  }

  async function handleSubmit() {
    const req = buildRequest()
    if (!req || !canSubmit || submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await createInquiry(req)
      onCreated()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : '문의 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const checkedCount = AI_CHECK_ITEMS.filter((item) => {
    const value = aiCheckResult?.[item]
    return value !== undefined && value !== null && value !== ''
  }).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="relative flex h-[844px] max-h-[calc(100vh-48px)] w-[1304px] max-w-[calc(100vw-48px)] flex-col overflow-y-auto rounded-[30px] bg-gray-800 p-9 lg:overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-8 top-8 text-gray-500 hover:text-gray-300"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-1 flex-col gap-8 lg:min-h-0 lg:flex-row">
          <div className="scrollbar-thin flex w-full flex-col gap-6 lg:w-[327px] lg:min-h-0 lg:shrink-0 lg:overflow-y-auto lg:overflow-x-hidden lg:pr-2">
            <h2 className="text-subtitle-2 font-semibold text-gray-200">기본정보 입력</h2>

            <div className="flex flex-col gap-2">
              <FieldLabel>이름</FieldLabel>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  resetCheck()
                }}
                placeholder="고객 이름 입력"
                className={inputClass}
              />
            </div>

            <div className="flex items-start gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <FieldLabel>생년월일</FieldLabel>
                <DateField
                  value={birthDate}
                  onChange={(v) => {
                    setBirthDate(v)
                    resetCheck()
                  }}
                  paddingClassName="px-[14px]"
                />
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <FieldLabel>성별</FieldLabel>
                <ToggleGroup
                  options={GENDER_OPTIONS}
                  value={gender}
                  onChange={(v) => {
                    setGender(v)
                    resetCheck()
                  }}
                  compact
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>연락처</FieldLabel>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  resetCheck()
                }}
                placeholder="010-0000-0000"
                className="w-full rounded-full border border-gray-700 bg-gray-900 px-[25px] py-[11px] text-body-3 text-white outline-none placeholder:text-gray-600 focus:border-lime"
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>선호 연락 방식</FieldLabel>
              <ToggleGroup
                options={CONTACT_CHANNEL_OPTIONS}
                value={preferredContactChannel}
                onChange={(v) => {
                  setPreferredContactChannel(v)
                  resetCheck()
                }}
              />
            </div>

            <div className="h-px w-full bg-gray-700" />

            <div className="flex flex-col gap-2">
              <FieldLabel>문의 시간</FieldLabel>
              <DateTimeField
                date={inquiryDate}
                time={inquiryTime}
                onDateChange={(v) => {
                  setInquiryDate(v)
                  resetCheck()
                }}
                onTimeChange={(v) => {
                  setInquiryTime(v)
                  resetCheck()
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>종목</FieldLabel>
              <ToggleGroup
                options={services.map((s) => ({ value: s.serviceId, label: s.name }))}
                value={serviceId}
                onChange={(v) => {
                  setServiceId(v)
                  resetCheck()
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>방문경로</FieldLabel>
              <SelectField
                placeholder="방문경로 선택"
                value={inflowPathId}
                options={inflowPaths.map((p) => ({ value: p.inflowPathId, label: p.name }))}
                onChange={(v) => {
                  setInflowPathId(v)
                  resetCheck()
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>상담자</FieldLabel>
              <SelectField
                placeholder="상담자 선택"
                value={counselorId}
                options={counselors.map((c) => ({ value: c.userId, label: c.name }))}
                onChange={(v) => {
                  setCounselorId(v)
                  resetCheck()
                }}
              />
            </div>
          </div>

          <div className="hidden w-px shrink-0 bg-gray-700 lg:block" />
          <div className="h-px w-full bg-gray-700 lg:hidden" />

          <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
            <h2 className="text-subtitle-2 font-semibold text-gray-200">상담내용 입력</h2>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <FieldLabel>문의 상태</FieldLabel>
                <ToggleGroup
                  options={statusOptions}
                  value={inquiryStatus}
                  onChange={(v) => {
                    setInquiryStatus(v)
                    resetCheck()
                  }}
                />
              </div>
              <div className="flex w-full flex-col gap-2 lg:w-[357px] lg:shrink-0">
                <FieldLabel>방문 예정일</FieldLabel>
                <DateTimeField
                  date={visitScheduledDate}
                  time={visitScheduledTime}
                  onDateChange={(v) => {
                    setVisitScheduledDate(v)
                    resetCheck()
                  }}
                  onTimeChange={(v) => {
                    setVisitScheduledTime(v)
                    resetCheck()
                  }}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 lg:flex-row">
              <div className="flex w-full flex-col rounded-[30px] border border-gray-700 bg-gray-900 lg:h-[546px]">
                <textarea
                  value={memo}
                  onChange={(e) => {
                    setMemo(e.target.value)
                    resetCheck()
                  }}
                  placeholder={'상담 내용을 자유롭게 적어주세요. AI가 자동으로 분류해 드립니다.'}
                  className="min-h-[200px] w-full flex-1 resize-none bg-transparent p-6 text-body-3 text-gray-100 outline-none placeholder:text-gray-500"
                />
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleFilesSelected(e.target.files)
                      e.target.value = ''
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0 rounded-full border border-gray-700 bg-black px-6 py-2 text-body-3 text-gray-500"
                  >
                    + 상담 자료 첨부
                  </button>
                  {attachments.map((fileName) => (
                    <button
                      key={fileName}
                      type="button"
                      onClick={() => removeAttachment(fileName)}
                      title="클릭하여 삭제"
                      className="max-w-[180px] truncate rounded-full bg-gray-800 px-6 py-2 text-caption-3 text-gray-100"
                    >
                      {fileName}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex w-full shrink-0 flex-col gap-5 rounded-[30px] border border-gray-700 p-5 lg:h-[546px] lg:w-[357px]"
                style={{ backgroundImage: 'linear-gradient(87deg, var(--color-gray-900) 17.7%, var(--color-gray-700) 281%)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-button-2 font-medium text-gray-200">AI가 확인한 정보</h3>
                  <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-caption-2 text-lime">
                    확인됨 {checkedCount}/{AI_CHECK_ITEMS.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {AI_CHECK_ITEMS.map((item) => {
                    const value = aiCheckResult?.[item]
                    const isChecked = value !== undefined && value !== null && value !== ''
                    return (
                      <div key={item} className="flex items-start gap-6">
                        <div className="flex shrink-0 items-center gap-2">
                          <CheckCircleIcon className={isChecked ? 'text-lime' : 'text-gray-600'} />
                          <span className="whitespace-nowrap text-caption-3 text-gray-500">{item}</span>
                        </div>
                        <span className="text-caption-3 text-gray-500">{isChecked ? String(value) : '아직 확인되지 않음'}</span>
                      </div>
                    )
                  })}
                </div>

                {checkError && <p className="text-caption-3 text-error">{checkError}</p>}

                <button
                  type="button"
                  disabled={!canCheck || checking}
                  onClick={handleCheck}
                  className={`mt-auto flex w-fit items-center gap-2 self-end rounded-full px-6 py-2 text-body-3 font-medium ${
                    canCheck && !checking ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
                  }`}
                >
                  <SparkleIcon />
                  {checking ? '점검 중...' : 'AI 중간점검'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {submitError && <p className="text-caption-3 text-error">{submitError}</p>}
              <button
                type="button"
                disabled={!canSubmit || submitting}
                onClick={handleSubmit}
                className={`flex h-12 items-center justify-center rounded-full px-8 text-button-3 font-medium ${
                  canSubmit && !submitting ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
                }`}
              >
                {submitting ? '등록 중...' : '문의 등록하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
