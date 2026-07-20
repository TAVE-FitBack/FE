import { useState } from 'react'
import { regenerateNextAction, type ConsultationSignalItem, type CustomerDetailResponse } from '../../api/consultationDetail'
import type { AiCheckPreviewKey } from '../../api/aiCheckPreview'
import { ApiError } from '../../api/client'

function SparklesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 5.9L20 10l-6.2 2.1L12 18l-1.8-5.9L4 10l6.2-2.1z" />
    </svg>
  )
}

function BulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0 0 12 2z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

/** 고객 온도(HOT/WARM/HOLD/COLD/LOST) 배지·텍스트 색상 — Figma node 840-6801 */
export const TEMPERATURE_BADGE_STYLE: Record<string, string> = {
  HOT: 'bg-coral/20 text-coral',
  WARM: 'bg-[rgba(237,143,2,0.2)] text-[#ed8f02]',
  HOLD: 'bg-lime-light/10 text-lime-light tracking-[-0.44px]',
  COLD: 'bg-blue/20 text-blue',
  LOST: 'bg-gray-400/10 text-gray-400',
}
export const TEMPERATURE_TEXT_COLOR: Record<string, string> = {
  HOT: 'text-coral',
  WARM: 'text-[#ed8f02]',
  HOLD: 'text-lime-light',
  COLD: 'text-blue',
  LOST: 'text-gray-400',
}
const DEFAULT_TEMPERATURE_COLOR = 'text-gray-400'

/** persuasionPoint/actionBasis는 자유형식 JSON이라 배열/객체/문자열 어떤 형태로 와도 방어적으로 문자열 목록으로 정리 */
function toStringList(value: unknown): string[] {
  if (value === null || value === undefined) return []
  if (Array.isArray(value)) return value.map((v) => String(v))
  if (typeof value === 'object') return Object.entries(value as Record<string, unknown>).map(([k, v]) => `${k}: ${v}`)
  return [String(value)]
}

/** 새 AI 상담분석 카드에 표시할 4개 signal key와 라벨 — consultationSignalSnapshot.items 중 이 4개만, 이 순서로 표시
 *  (서버 응답엔 표시 순서 필드가 없어 Figma 레이아웃 순서를 프론트에서 고정) */
const SIGNAL_DISPLAY_ORDER: AiCheckPreviewKey[] = ['EXERCISE_GOAL', 'INJURY_HISTORY', 'INTEREST_SERVICE', 'EXERCISE_EXPERIENCE']

const SIGNAL_DISPLAY_LABELS: Partial<Record<AiCheckPreviewKey, string>> = {
  EXERCISE_GOAL: '운동 목적',
  INJURY_HISTORY: '부상 경험',
  INTEREST_SERVICE: '관심 상품',
  EXERCISE_EXPERIENCE: '운동 경험',
}

function SignalField({ item }: { item: ConsultationSignalItem }) {
  const label = SIGNAL_DISPLAY_LABELS[item.key] ?? item.label
  const value = item.value ?? ''

  return (
    <div className="flex flex-col gap-3">
      <div className="h-px w-full bg-gray-700" />
      <div className="flex flex-col gap-2">
        <span className="text-caption-3 font-medium text-gray-400">{label}</span>
        <p className="text-body-3 text-gray-200">{value}</p>
      </div>
    </div>
  )
}

interface AiAnalysisTabProps {
  customerId: string
  detail: CustomerDetailResponse
  showMessagePanel: boolean
  onNextActionRegenerated: () => void
}

export function AiAnalysisTab({ customerId, detail, showMessagePanel, onNextActionRegenerated }: AiAnalysisTabProps) {
  const [regenerating, setRegenerating] = useState(false)
  const [regenerateError, setRegenerateError] = useState('')

  async function handleRegenerate() {
    if (regenerating) return
    setRegenerating(true)
    setRegenerateError('')
    try {
      await regenerateNextAction(customerId)
      onNextActionRegenerated()
    } catch (err) {
      setRegenerateError(err instanceof ApiError ? err.message : '다음 최적 액션 재생성에 실패했습니다.')
    } finally {
      setRegenerating(false)
    }
  }

  const mainConcerns = detail.nonConversionReasons
  const persuasionPoints = toStringList(detail.nextBestAction?.persuasionPoint)
  const signalItems = (detail.consultationSignalSnapshot?.items ?? [])
    .filter((item) => item.key in SIGNAL_DISPLAY_LABELS)
    .sort((a, b) => SIGNAL_DISPLAY_ORDER.indexOf(a.key) - SIGNAL_DISPLAY_ORDER.indexOf(b.key))

  const card = (
    <div
      className="scrollbar-thin flex h-[474px] w-[642px] shrink-0 flex-col gap-4 overflow-y-auto rounded-[30px] border border-gray-700 p-5"
      style={{ backgroundImage: 'linear-gradient(222deg, var(--color-gray-800) 4%, var(--color-gray-600) 218%)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SparklesIcon />
          <span className="text-button-3 font-medium text-lime">상담 포인트</span>
        </div>
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={regenerating}
          className="flex items-center gap-1 text-caption-3 font-medium text-lime hover:text-lime-light disabled:text-gray-500"
        >
          <RefreshIcon />
          {regenerating ? '재생성 중...' : '다시 생성'}
        </button>
      </div>

      {regenerateError && <p className="text-caption-3 text-error">{regenerateError}</p>}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-caption-3 text-gray-400">고객 온도</span>
          <span
            className={`text-subtitle-1 font-semibold ${
              detail.aiInsight ? (TEMPERATURE_TEXT_COLOR[detail.aiInsight.leadTemperature] ?? DEFAULT_TEMPERATURE_COLOR) : DEFAULT_TEMPERATURE_COLOR
            }`}
          >
            {detail.aiInsight?.leadTemperature ?? '-'}
          </span>
        </div>
        {mainConcerns.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-caption-3 text-gray-400">주요 고민 지점</span>
            <div className="flex flex-wrap gap-2">
              {mainConcerns.map((reason, i) => (
                <span key={i} className="rounded-full border border-gray-700 bg-gray-700 px-3 py-1 text-caption-3 text-gray-200">
                  {reason.reasonType}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {detail.latestConsultation?.summary && (
        <div className="flex flex-col gap-1">
          <span className="text-caption-3 text-gray-400">AI 상담 요약</span>
          {(() => {
            const [headline, ...rest] = detail.latestConsultation.summary.split('\n').filter((line) => line.trim() !== '')
            return (
              <>
                <p className="text-body-3 text-gray-200">{headline}</p>
                {rest.length > 0 && (
                  <ul className="list-disc pl-6">
                    {rest.map((line, i) => (
                      <li key={i} className="text-body-3 text-gray-200">
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )
          })()}
        </div>
      )}

      {detail.nextBestAction && (
        <div className="flex flex-col gap-3 rounded-[20px] bg-white/10 p-5 backdrop-blur-[2px]">
          <div className="flex items-center gap-2">
            <BulbIcon />
            <span className="text-button-3 font-medium text-lime">다음 최적 액션</span>
          </div>
          <p className="text-body-3 text-white">
            <span className="font-bold">{detail.nextBestAction.title}</span> : {detail.nextBestAction.description}
          </p>
          {persuasionPoints.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-body-3 font-bold text-white">설득 포인트</span>
              <ul className="list-disc pl-6">
                {persuasionPoints.map((point, i) => (
                  <li key={i} className="text-body-3 text-white">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )

  if (showMessagePanel) {
    if (signalItems.length === 0) return card
    return (
      <div className="flex flex-col gap-8">
        {card}
        <div className="grid w-[642px] grid-cols-2 gap-x-4 gap-y-8">
          {signalItems.map((item) => (
            <SignalField key={item.key} item={item} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 flex-1 gap-6">
      {card}
      <div className="flex w-[310px] shrink-0 flex-col gap-8">
        {signalItems.map((item) => (
          <SignalField key={item.key} item={item} />
        ))}
      </div>
    </div>
  )
}
