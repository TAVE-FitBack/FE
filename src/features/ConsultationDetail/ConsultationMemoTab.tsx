import { useRef, useState } from 'react'
import {
  checkReconsultationPreview,
  createReconsultation,
  type CustomerDetailStatus,
  type LatestConsultation,
  type ReconsultationCheckPreviewResponse,
  type ReconsultationInfo,
  type ReconsultationStatus,
} from '../../api/consultationDetail'
import { ApiError } from '../../api/client'
import { AI_CHECK_ITEMS, CheckCircleIcon, SparkleIcon } from '../Clients/registrationFormControls'

function toReconsultationStatus(status: CustomerDetailStatus): ReconsultationStatus {
  return status === 'NO_SHOW' ? 'PENDING' : status
}

interface ConsultationMemoTabProps {
  customerId: string
  latestConsultation: LatestConsultation | null
  currentStatus: CustomerDetailStatus
  onSaved: () => void
}

export function ConsultationMemoTab({ customerId, latestConsultation, currentStatus, onSaved }: ConsultationMemoTabProps) {
  // 상담메모 탭 = 재상담 등록 폼과 동일 — 매번 새 상담 회차를 등록하는 것이라 이전 메모를 프리필하지 않고 항상 빈 칸으로 시작
  const [memo, setMemo] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [aiCheckResult, setAiCheckResult] = useState<ReconsultationCheckPreviewResponse | null>(null)
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const canCheck = memo.trim() !== '' && latestConsultation !== null
  const canSave = aiCheckResult !== null && canCheck

  function resetCheck() {
    setAiCheckResult(null)
    setCheckError('')
  }

  function buildConsultationInfo(): ReconsultationInfo | null {
    if (!latestConsultation || memo.trim() === '') return null
    return {
      consultedServiceId: latestConsultation.consultedServiceId,
      consultedAt: new Date().toISOString(),
      userId: latestConsultation.userId,
      rawText: memo,
    }
  }

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    setAttachments((prev) => [...prev, ...Array.from(fileList)])
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((f) => f.name !== fileName))
  }

  async function handleCheck() {
    const consultation = buildConsultationInfo()
    if (!consultation || checking) return
    setChecking(true)
    setCheckError('')
    try {
      const result = await checkReconsultationPreview(customerId, consultation)
      setAiCheckResult(result)
    } catch (err) {
      setCheckError(err instanceof ApiError ? err.message : 'AI 중간점검에 실패했습니다.')
    } finally {
      setChecking(false)
    }
  }

  async function handleSave() {
    const consultation = buildConsultationInfo()
    if (!consultation || !canSave || saving) return
    setSaving(true)
    setSaveError('')
    try {
      await createReconsultation(
        customerId,
        {
          consultation,
          registrationStatus: toReconsultationStatus(currentStatus),
          aiCheckPreview: aiCheckResult ?? undefined,
        },
        attachments,
      )
      setMemo('')
      setAttachments([])
      resetCheck()
      onSaved()
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : '상담 메모 저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const resultByLabel = new Map((aiCheckResult?.items ?? []).map((item) => [item.label, item]))

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <h3 className="text-subtitle-2 font-semibold text-gray-200">상담 메모</h3>

      <div className="flex flex-1 gap-4">
        <div className="flex w-full flex-col rounded-[30px] border border-gray-700 bg-gray-900">
          <textarea
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value)
              resetCheck()
            }}
            placeholder={'상담 내용을 자유롭게 적어주세요. AI가 자동으로 분류해 드립니다.'}
            className="min-h-[300px] w-full flex-1 resize-none bg-transparent p-6 text-body-3 text-gray-100 outline-none placeholder:text-gray-500"
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
              + 자료 첨부
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
        </div>

        <div
          className="flex w-full max-w-[357px] shrink-0 flex-col gap-5 rounded-[30px] border border-gray-700 p-5"
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
            className={`mt-auto flex w-fit items-center gap-2 self-center rounded-full px-6 py-2 text-body-3 font-medium ${
              canCheck && !checking ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
            }`}
          >
            <SparkleIcon />
            {checking ? '점검 중...' : 'AI 중간점검'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {saveError && <p className="text-caption-3 text-error">{saveError}</p>}
        <button
          type="button"
          disabled={!canSave || saving}
          onClick={handleSave}
          className={`flex h-12 items-center justify-center rounded-full px-8 text-button-3 font-medium ${
            canSave && !saving ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
          }`}
        >
          {saving ? '저장 중...' : '상담 등록하기'}
        </button>
      </div>
    </div>
  )
}
