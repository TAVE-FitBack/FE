import { useEffect, useState, type ReactNode } from 'react'
import {
  getConsultationDetail,
  updateConsultationStatus,
  type CustomerDetailResponse,
  type CustomerDetailStatus,
  type TimelineItem,
} from '../../api/consultationDetail'
import { ApiError } from '../../api/client'
import { CloseIcon } from '../Clients/registrationFormControls'
import { CONSULT_STATUS_LABEL, CONSULT_STATUS_STYLE } from '../Clients/ClientTable'
import { AiAnalysisTab, TEMPERATURE_BADGE_STYLE } from './AiAnalysisTab'
import { ActivityTimelineTab } from './ActivityTimelineTab'
import { MessageDraftPanel } from './MessageDraftPanel'
import { ConsultationMemoTab } from './ConsultationMemoTab'
import { CustomerInfoEditModal } from './CustomerInfoEditModal'

type DetailTab = 'analysis' | 'timeline' | 'memo'

const STATUS_ORDER: CustomerDetailStatus[] = ['PENDING', 'SCHEDULED', 'REGISTERED', 'NO_SHOW', 'LOST']

function formatDateOnly(iso: string): string {
  return iso.slice(0, 10)
}

function formatDateTime(iso: string): string {
  return `${iso.slice(0, 10)} / ${iso.slice(11, 16)}`
}

function elapsedDaysSince(iso: string): number {
  const diffMs = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)))
}

function latestTimelineDate(timeline: TimelineItem[], fallback: string | null): string {
  if (timeline.length === 0) return fallback ? formatDateOnly(fallback) : '-'
  const latest = timeline.reduce((a, b) => (a.occurredAt > b.occurredAt ? a : b))
  return formatDateOnly(latest.occurredAt)
}

/** 상담 경과 = 최초 상담(첫 접점) 이후 지난 일수 — timeline에 생성 이벤트가 있으면 그중 가장 이른 시각, 없으면 최신 상담일로 대체 */
function firstConsultationDate(timeline: TimelineItem[], fallback: string | null): string | null {
  const createdEvents = timeline.filter(
    (t) => t.activityType === 'CONSULTATION_CREATED' || t.activityType === 'INQUIRY_CONVERTED_TO_CONSULTATION',
  )
  if (createdEvents.length === 0) return fallback
  const earliest = createdEvents.reduce((a, b) => (a.occurredAt < b.occurredAt ? a : b))
  return earliest.occurredAt
}

interface ConsultationDetailModalProps {
  customerId: string
  initialStatus: CustomerDetailStatus
  onClose: () => void
  onUpdated: () => void
}

export function ConsultationDetailModal({ customerId, initialStatus, onClose, onUpdated }: ConsultationDetailModalProps) {
  const [detail, setDetail] = useState<CustomerDetailResponse | null>(null)
  const [status, setStatus] = useState<CustomerDetailStatus>(initialStatus)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [tab, setTab] = useState<DetailTab>('analysis')
  const [showMessagePanel, setShowMessagePanel] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusSaving, setStatusSaving] = useState(false)
  const [statusError, setStatusError] = useState('')

  function loadDetail() {
    return getConsultationDetail(customerId)
      .then((res) => setDetail(res))
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : '상담 정보를 불러오지 못했습니다.'))
  }

  useEffect(() => {
    loadDetail().finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId])

  async function handleStatusChange(next: CustomerDetailStatus) {
    if (statusSaving) return
    setStatusOpen(false)
    setStatusSaving(true)
    setStatusError('')
    try {
      // REGISTERED 전환 시 백엔드가 등록 종목(registeredServiceId) 귀속을 요구함 — 최신 상담의 종목을 그대로 사용
      const registeredServiceId = next === 'REGISTERED' ? detail?.latestConsultation?.consultedServiceId : undefined
      const res = await updateConsultationStatus(customerId, { status: next, registeredServiceId })
      setStatus(res.status)
      onUpdated()
    } catch (err) {
      setStatusError(err instanceof ApiError ? err.message : '고객 상태 변경에 실패했습니다.')
    } finally {
      setStatusSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-y-0 right-0 flex w-full max-w-[1072px] flex-col overflow-y-auto rounded-bl-[24px] rounded-tl-[30px] bg-gray-800 p-9"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-body-3 font-medium text-gray-200">상담 상세</h2>
          <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-500 hover:text-gray-300">
            <CloseIcon />
          </button>
        </div>

        {loading && <p className="mt-8 text-body-3 text-gray-500">불러오는 중...</p>}
        {loadError && <p className="mt-8 text-body-3 text-error">{loadError}</p>}

        {detail && (
          <>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-title-3 font-semibold text-lime">{detail.customer.name}</span>
                  {detail.aiInsight && (
                    <span
                      className={`rounded-[4px] px-2 py-0.5 text-caption-2 ${
                        TEMPERATURE_BADGE_STYLE[detail.aiInsight.leadTemperature] ?? 'bg-gray-400/10 text-gray-400'
                      }`}
                    >
                      {detail.aiInsight.leadTemperature}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-caption-3 text-gray-500">
                  <span>{detail.customer.phoneNum}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(detail.customer.phoneNum)}
                    aria-label="연락처 복사"
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <StatItem
                  label="상담 경과"
                  value={(() => {
                    const startedAt = firstConsultationDate(detail.timeline, detail.latestConsultation?.consultedAt ?? null)
                    return startedAt ? `${elapsedDaysSince(startedAt)}일` : '-'
                  })()}
                />
                <div className="h-10 w-px bg-gray-700" />
                <StatItem
                  label="최근 연락일"
                  value={latestTimelineDate(detail.timeline, detail.latestConsultation?.consultedAt ?? null)}
                />
                <div className="h-10 w-px bg-gray-700" />
                <StatItem
                  label="방문일"
                  value={detail.latestConsultation ? formatDateTime(detail.latestConsultation.consultedAt) : '-'}
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1 text-caption-3 text-gray-500 hover:text-gray-300"
                >
                  <PencilIcon />
                  정보 수정
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusOpen((v) => !v)}
                    disabled={statusSaving}
                    className={`flex h-11 items-center gap-2 rounded-full border px-6 text-button-3 font-medium ${CONSULT_STATUS_STYLE[status]}`}
                  >
                    {CONSULT_STATUS_LABEL[status]}
                    <ChevronDownIcon />
                  </button>
                  {statusError && (
                    <p className="absolute right-0 top-[calc(100%+4px)] w-[220px] text-right text-caption-3 text-error">{statusError}</p>
                  )}
                  {statusOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] z-10 flex flex-col rounded-[20px] border border-gray-700 bg-gray-800 p-3 shadow-lg">
                      {STATUS_ORDER.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleStatusChange(s)}
                          className="whitespace-nowrap rounded-lg px-3 py-2 text-left text-button-3 font-medium text-gray-100 hover:bg-gray-700/50"
                        >
                          {CONSULT_STATUS_LABEL[s]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 mb-2 h-[1px] w-full bg-gray-700" />

            <div className="flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <TabButton
                  active={tab === 'analysis'}
                  onClick={() => {
                    setTab('analysis')
                    loadDetail()
                  }}
                >
                  AI 상담분석
                </TabButton>
                <TabButton
                  active={tab === 'timeline'}
                  onClick={() => {
                    setTab('timeline')
                    loadDetail()
                  }}
                >
                  활동 타임라인
                </TabButton>
                <TabButton
                  active={tab === 'memo'}
                  onClick={() => {
                    setTab('memo')
                    loadDetail()
                  }}
                >
                  상담메모
                </TabButton>
              </div>
              {tab === 'analysis' && (
                <button
                  type="button"
                  onClick={() => setShowMessagePanel((v) => !v)}
                  className={`mb-3 flex h-10 items-center gap-2 rounded-full px-4 text-button-3 font-medium ${
                    showMessagePanel ? 'bg-gray-700 text-gray-200' : 'bg-lime text-gray-800'
                  }`}
                >
                  <SendIcon />
                  메시지 생성
                </button>
              )}
            </div>

            <div className="mt-6 flex min-h-0 flex-1 gap-6">
              {tab === 'analysis' && (
                <AiAnalysisTab
                  customerId={customerId}
                  detail={detail}
                  showMessagePanel={showMessagePanel}
                  onNextActionRegenerated={loadDetail}
                />
              )}
              {tab === 'timeline' && (
                <ActivityTimelineTab
                  customerId={customerId}
                  detail={detail}
                  onUpdated={() => {
                    loadDetail()
                    onUpdated()
                  }}
                />
              )}
              {tab === 'memo' && (
                <ConsultationMemoTab
                  customerId={customerId}
                  latestConsultation={detail.latestConsultation}
                  currentStatus={status}
                  onSaved={() => {
                    loadDetail()
                    onUpdated()
                  }}
                />
              )}

              {tab === 'analysis' && showMessagePanel && (
                <MessageDraftPanel customerId={customerId} followUpId={detail.activeFollowUp?.followUpId ?? null} />
              )}
            </div>
          </>
        )}

        {editOpen && detail && (
          <CustomerInfoEditModal
            customerId={customerId}
            initial={{
              name: detail.customer.name,
              gender: detail.customer.gender,
              birthDate: detail.customer.birthDate,
              phoneNum: detail.customer.phoneNum,
              preferredContactChannel: detail.customer.preferredContactChannel,
              visitedAt: detail.latestConsultation?.consultedAt ?? '',
            }}
            onClose={() => {
              setEditOpen(false)
              loadDetail()
            }}
            onSaved={() => {
              setEditOpen(false)
              loadDetail()
              onUpdated()
            }}
          />
        )}
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-caption-3 text-gray-500">{label}</span>
      <span className="text-body-3 font-medium text-gray-300">{value}</span>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center border-b-2 px-6 pb-[18px] pt-4 text-body-3 ${
        active ? 'border-lime font-medium text-lime' : 'border-transparent text-gray-400'
      }`}
    >
      {children}
    </button>
  )
}

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  )
}
