import { useRef, useState } from 'react'
import type { ConsultationNewResponse, CustomerStatus, Gender } from '../../api/customerManagement'
import {
  checkConsultationPreview,
  createConsultation,
  searchConsultationCustomerByPhone,
  type ConsultationCheckPreviewResponse,
  type ConsultationCreateRequest,
} from '../../api/consultations'
import { ApiError } from '../../api/client'
import type { CustomerInfo, PreferredContactChannel } from '../../api/inquiries'
import { getCurrentUser } from '../../api/token'
import {
  AI_CHECK_ITEMS,
  CheckCircleIcon,
  ChevronRightIcon,
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

interface NewConsultationModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
  onNavigateToCustomer: (customerId: string) => void
  filterOptions: ConsultationNewResponse | null
}

const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: 'PENDING', label: '보류' },
  { value: 'SCHEDULED', label: '등록 예정' },
  { value: 'REGISTERED', label: '등록 완료' },
  { value: 'LOST', label: '이탈' },
]

const CONTACT_CHANNEL_OPTIONS: { value: PreferredContactChannel; label: string }[] = [
  { value: 'SMS', label: '문자' },
  { value: 'PHONE', label: '전화' },
  { value: 'KAKAO', label: '카카오' },
]

const MAX_ATTACHMENTS = 3
const MAX_ATTACHMENT_SIZE = 1024 * 1024

export function NewConsultationModal({ open, onClose, onCreated, onNavigateToCustomer, filterOptions }: NewConsultationModalProps) {
  const [name, setName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [phone, setPhone] = useState('')
  const [preferredContactChannel, setPreferredContactChannel] = useState<PreferredContactChannel | ''>('')
  const [visitDate, setVisitDate] = useState('')
  const [visitTime, setVisitTime] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [inflowPathId, setInflowPathId] = useState('')
  const [counselorId, setCounselorId] = useState('')
  const [status, setStatus] = useState<CustomerStatus | ''>('')
  const [memo, setMemo] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [attachmentError, setAttachmentError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [searching, setSearching] = useState(false)
  const [foundCustomer, setFoundCustomer] = useState<CustomerInfo | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [searchError, setSearchError] = useState('')

  const [aiCheckResult, setAiCheckResult] = useState<ConsultationCheckPreviewResponse | null>(null)
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const [defaultCounselorAppliedFor, setDefaultCounselorAppliedFor] = useState<ConsultationNewResponse | null>(null)
  if (filterOptions && filterOptions !== defaultCounselorAppliedFor && !counselorId) {
    setDefaultCounselorAppliedFor(filterOptions)
    const currentUser = getCurrentUser()
    const self = currentUser && filterOptions.counselors.find((c) => c.userId === currentUser.id)
    if (self) setCounselorId(self.userId)
  }

  if (!open) return null

  function resetSearch() {
    setFoundCustomer(null)
    setHasSearched(false)
    setRedirectUrl(null)
    setSearchError('')
  }

  function resetCheck() {
    setAiCheckResult(null)
    setCheckError('')
  }

  async function handleSearch() {
    if (phone.trim() === '' || searching) return
    setSearching(true)
    setSearchError('')
    try {
      const result = await searchConsultationCustomerByPhone(phone)
      setFoundCustomer(result.exists ? result.customer : null)
      setRedirectUrl(result.exists ? result.redirectUrl : null)
      setHasSearched(true)
    } catch (err) {
      setSearchError(err instanceof ApiError ? err.message : '고객 검색에 실패했습니다.')
    } finally {
      setSearching(false)
    }
  }

  function handleGoToConsultation() {
    // redirectUrl은 "/customers/{customerId}/detail" 형태의 경로 문자열 — 이 앱은 라우터가 없는
    // 상태 기반 SPA라 window.location.href로 이동하면 새로고침되어 로그인 세션이 끊기므로,
    // customerId만 뽑아 상위 컴포넌트가 상세 모달을 열도록 콜백으로 넘긴다.
    const customerId = redirectUrl?.match(/\/customers\/([^/]+)\/detail/)?.[1]
    if (customerId) onNavigateToCustomer(customerId)
  }

  const services = filterOptions?.services ?? []
  const inflowPaths = filterOptions?.inflowPaths ?? []
  const counselors = filterOptions?.counselors ?? []

  function buildRequest(): ConsultationCreateRequest | null {
    if (
      name.trim() === '' ||
      gender === '' ||
      birthDate === '' ||
      phone.trim() === '' ||
      preferredContactChannel === '' ||
      inflowPathId === '' ||
      serviceId === '' ||
      counselorId === '' ||
      status === '' ||
      visitDate === '' ||
      visitTime === '' ||
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
      consultation: {
        consultedServiceId: serviceId,
        consultedAt: `${visitDate}T${visitTime}:00+09:00`,
        userId: counselorId,
        registrationStatus: status,
        rawText: memo,
      },
    }
  }

  const canCheck = buildRequest() !== null
  const canSubmit = aiCheckResult !== null && canCheck

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setAttachmentError('')
    const incoming = Array.from(fileList)
    const accepted: File[] = []
    for (const file of incoming) {
      if (!file.name.toLowerCase().endsWith('.txt')) {
        setAttachmentError('.txt 파일만 첨부할 수 있습니다.')
        continue
      }
      if (file.size > MAX_ATTACHMENT_SIZE) {
        setAttachmentError('파일당 최대 1MB까지 첨부할 수 있습니다.')
        continue
      }
      accepted.push(file)
    }
    setAttachments((prev) => {
      const next = [...prev, ...accepted]
      if (next.length > MAX_ATTACHMENTS) {
        setAttachmentError('상담 자료는 최대 3개까지 첨부할 수 있습니다.')
        return next.slice(0, MAX_ATTACHMENTS)
      }
      return next
    })
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((f) => f.name !== fileName))
  }

  async function handleCheck() {
    const req = buildRequest()
    if (!req || checking) return
    setChecking(true)
    setCheckError('')
    try {
      const result = await checkConsultationPreview(req)
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
    req.aiCheckPreview = aiCheckResult ?? undefined
    setSubmitting(true)
    setSubmitError('')
    try {
      await createConsultation(req, attachments)
      onCreated()
      onClose()
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : '상담 등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const resultByLabel = new Map((aiCheckResult?.items ?? []).map((item) => [item.label, item]))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
      <div className="scrollbar-thin relative flex h-[844px] max-h-[calc(100vh-48px)] w-[1304px] max-w-[calc(100vw-48px)] flex-col overflow-y-auto rounded-[30px] bg-gray-800 p-9 lg:overflow-hidden">
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
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value)
                    resetSearch()
                    resetCheck()
                  }}
                  placeholder="010-0000-0000"
                  className="min-w-0 flex-1 rounded-full border border-gray-700 bg-gray-900 px-[25px] py-[11px] text-body-3 text-white outline-none placeholder:text-gray-600 focus:border-lime"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={phone.trim() === '' || searching}
                  className={`flex h-[46px] shrink-0 items-center justify-center rounded-full px-5 text-caption-3 font-medium ${
                    phone.trim() !== '' && !searching ? 'bg-lime text-gray-800' : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {searching ? '검색 중...' : '검색하기'}
                </button>
              </div>
              {foundCustomer && (
                <div className="flex items-center justify-between py-1 pl-3">
                  <span className="text-body-3 text-white">
                    {foundCustomer.name} | {foundCustomer.phoneNum}
                  </span>
                  <button
                    type="button"
                    onClick={handleGoToConsultation}
                    className="flex items-center gap-1 text-caption-3 font-medium text-lime"
                  >
                    이동하기
                    <ChevronRightIcon />
                  </button>
                </div>
              )}
              {hasSearched && !foundCustomer && !searchError && (
                <p className="pl-3 text-caption-3 text-gray-500">등록된 고객이 없습니다</p>
              )}
              {searchError && <p className="text-caption-3 text-error">{searchError}</p>}
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
              <FieldLabel>방문 시간</FieldLabel>
              <DateTimeField
                date={visitDate}
                time={visitTime}
                onDateChange={(v) => {
                  setVisitDate(v)
                  resetCheck()
                }}
                onTimeChange={(v) => {
                  setVisitTime(v)
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

            <div className="flex flex-col gap-2">
              <FieldLabel>상담 상태</FieldLabel>
              <ToggleGroup
                options={STATUS_OPTIONS}
                value={status}
                onChange={(v) => {
                  setStatus(v)
                  resetCheck()
                }}
              />
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
                    accept=".txt"
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
                  {attachments.map((file) => (
                    <button
                      key={file.name}
                      type="button"
                      onClick={() => removeAttachment(file.name)}
                      title="클릭하여 삭제"
                      className="max-w-[180px] truncate rounded-full bg-gray-800 px-6 py-2 text-caption-3 text-gray-100"
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
                {attachmentError && <p className="px-4 pb-3 text-caption-3 text-error">{attachmentError}</p>}
              </div>

              <div
                className="flex w-full shrink-0 flex-col gap-5 rounded-[30px] border border-gray-700 p-5 lg:h-[546px] lg:w-[357px]"
                style={{ backgroundImage: 'linear-gradient(87deg, var(--color-gray-900) 17.7%, var(--color-gray-700) 281%)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-button-2 font-medium text-gray-200">AI가 확인한 정보</h3>
                  <span className="rounded-full bg-lime/10 px-2.5 py-0.5 text-caption-2 text-lime">
                    확인됨 {aiCheckResult?.confirmedCount ?? 0}/{aiCheckResult?.totalCount ?? AI_CHECK_ITEMS.length}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {AI_CHECK_ITEMS.map((label) => {
                    const item = resultByLabel.get(label)
                    const isChecked = item?.confirmed ?? false
                    return (
                      <div key={label} className="flex items-start gap-6">
                        <div className="flex shrink-0 items-center gap-2">
                          <CheckCircleIcon className={isChecked ? 'text-lime' : 'text-gray-600'} />
                          <span className="whitespace-nowrap text-caption-3 text-gray-500">{label}</span>
                        </div>
                        <span className="text-caption-3 text-gray-500">{isChecked ? item?.value : '아직 확인되지 않음'}</span>
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
                {submitting ? '등록 중...' : '상담 등록하기'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
