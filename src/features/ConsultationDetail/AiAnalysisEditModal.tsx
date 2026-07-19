import { useState } from 'react'
import { updateAiAnalysis } from '../../api/consultationDetail'
import type { NonConversionReasonInfo } from '../../api/customerManagement'
import { ApiError } from '../../api/client'
import { CloseIcon, FieldLabel } from '../Clients/registrationFormControls'

interface AiAnalysisEditModalProps {
  customerId: string
  initialSummary: string
  initialLeadTemperature: string
  initialTemperatureBasis: string
  nonConversionReasons: NonConversionReasonInfo[]
  onClose: () => void
  onSaved: () => void
}

const TEMPERATURE_OPTIONS = ['HOT', 'WARM', 'HOLD', 'COLD', 'LOST']

export function AiAnalysisEditModal({
  customerId,
  initialSummary,
  initialLeadTemperature,
  initialTemperatureBasis,
  nonConversionReasons,
  onClose,
  onSaved,
}: AiAnalysisEditModalProps) {
  const [summary, setSummary] = useState(initialSummary)
  const [leadTemperature, setLeadTemperature] = useState(initialLeadTemperature)
  const [temperatureBasis, setTemperatureBasis] = useState(initialTemperatureBasis)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = summary.trim() !== '' && leadTemperature.trim() !== '' && temperatureBasis.trim() !== ''

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      // 주요 이탈요인(nonConversionReasons) 편집 UI는 이번 범위에 없어 기존 값을 그대로 전달
      await updateAiAnalysis(customerId, { summary, leadTemperature, temperatureBasis, nonConversionReasons })
      onSaved()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'AI 분석 수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6">
      <div className="relative flex w-full max-w-[480px] flex-col gap-6 rounded-[30px] bg-gray-800 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-subtitle-2 font-semibold text-gray-200">AI 분석 수정</h2>
          <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-500 hover:text-gray-300">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>고객 온도</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {TEMPERATURE_OPTIONS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setLeadTemperature(t)}
                className={`flex h-9 items-center justify-center rounded-full px-4 text-caption-3 font-medium ${
                  leadTemperature === t ? 'border border-lime bg-lime-light/20 text-gray-100' : 'bg-gray-700 text-gray-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>온도 판단 근거</FieldLabel>
          <textarea
            value={temperatureBasis}
            onChange={(e) => setTemperatureBasis(e.target.value)}
            placeholder="온도를 이렇게 판단한 이유를 입력하세요"
            className="min-h-[80px] w-full resize-none rounded-2xl border border-gray-700 bg-gray-900 p-4 text-body-3 text-gray-100 outline-none placeholder:text-gray-600 focus:border-lime"
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>AI 상담 요약</FieldLabel>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="상담 요약을 입력하세요"
            className="min-h-[120px] w-full resize-none rounded-2xl border border-gray-700 bg-gray-900 p-4 text-body-3 text-gray-100 outline-none placeholder:text-gray-600 focus:border-lime"
          />
        </div>

        {error && <p className="text-caption-3 text-error">{error}</p>}

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className={`flex h-12 items-center justify-center rounded-full text-button-3 font-medium ${
            canSubmit && !submitting ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
          }`}
        >
          {submitting ? '수정 중...' : '수정하기'}
        </button>
      </div>
    </div>
  )
}
