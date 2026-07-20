import { useState } from 'react'
import type { CustomerDetailResponse, TimelineDetail, TimelineItem } from '../../api/consultationDetail'

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 6 15 12 9 18" />
    </svg>
  )
}

const NO_PREVIEW_BOX_TYPES = new Set([
  'CUSTOMER_STATUS_CHANGED',
  'NEXT_ACTION_CREATED',
  'NEXT_ACTION_REGENERATED',
  'FOLLOW_UP_CREATED',
  'FOLLOW_UP_COMPLETED',
])

function formatOccurredAt(iso: string): string {
  return `${iso.slice(0, 10)} ${iso.slice(11, 16)}`
}

/** 타입별 상세 패널 부가 메타 정보 — 값이 없는 필드는 자동으로 숨김 */
function getDetailMeta(detail: TimelineDetail): { label: string; value: string }[] {
  const rows: { label: string; value: string | undefined | null }[] = (() => {
    switch (detail.type) {
      case 'CONSULTATION':
        return [
          { label: '담당자', value: detail.counselorName },
          { label: '서비스', value: detail.consultedServiceName },
          { label: '회차', value: detail.sessionNo !== undefined ? `${detail.sessionNo}회차` : undefined },
        ]
      case 'MESSAGE_TEMPLATE':
        return [
          { label: '톤', value: detail.tonePreset },
          { label: '버전', value: detail.versionType },
          { label: '전송 상태', value: detail.deliveryStatus },
          { label: '전송 일시', value: detail.sentAt ?? undefined },
        ]
      case 'AI_ANALYSIS':
        return [
          { label: '고객 온도', value: detail.leadTemperature },
          { label: '우선순위 점수', value: detail.priorityScore !== undefined ? String(detail.priorityScore) : undefined },
          { label: '상태', value: detail.status },
        ]
      case 'FOLLOW_UP':
        return [
          { label: '추천 연락일', value: detail.recommendContactDate },
          { label: '상태', value: detail.status },
          { label: '연락 회차', value: detail.contactRound !== undefined ? `${detail.contactRound}차` : undefined },
        ]
      case 'STATUS_CHANGE':
        return [{ label: '상태 변경', value: detail.beforeStatus && detail.afterStatus ? `${detail.beforeStatus} → ${detail.afterStatus}` : undefined }]
      case 'INQUIRY_CONVERSION':
        return [{ label: '신규 고객 생성', value: detail.newCustomerCreated !== undefined ? (detail.newCustomerCreated ? '예' : '아니오') : undefined }]
      default:
        return []
    }
  })()
  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value))
}

function TimelineRow({
  item,
  isLatest,
  isLast,
  active,
  onSelect,
}: {
  item: TimelineItem
  isLatest: boolean
  isLast: boolean
  active: boolean
  onSelect: () => void
}) {
  const showBox = !NO_PREVIEW_BOX_TYPES.has(item.activityType)

  return (
    <div className="flex gap-4">
      <div className="flex w-4 shrink-0 flex-col items-center">
        <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-gray-900 ${isLatest ? 'bg-lime' : 'bg-gray-700'}`} />
        {!isLast && <span className="w-px flex-1 bg-gray-700" />}
      </div>

      <div className={`flex flex-1 flex-col gap-3 rounded-lg px-2 pb-6 ${active ? 'bg-white/5' : ''}`}>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-caption-2 text-gray-500">{formatOccurredAt(item.occurredAt)}</span>
            <span className="text-body-3 text-gray-200">{item.title}</span>
          </div>
          <button
            type="button"
            onClick={onSelect}
            className="flex shrink-0 items-center gap-1 text-caption-3 font-medium text-gray-400 hover:text-gray-200"
          >
            상세 보기
            <ChevronIcon />
          </button>
        </div>

        {(item.summary || item.description) &&
          (showBox ? (
            <div className="rounded-lg bg-gray-900 px-4 py-2 text-caption-3 text-gray-400">
              <p className="line-clamp-2 whitespace-pre-wrap">{item.summary || item.description}</p>
            </div>
          ) : (
            <p className="text-caption-3 text-lime">{item.summary || item.description}</p>
          ))}
      </div>
    </div>
  )
}

interface ActivityTimelineTabProps {
  detail: CustomerDetailResponse
}

export function ActivityTimelineTab({ detail }: ActivityTimelineTabProps) {
  const sorted = [...detail.timeline].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.timelineId ?? null)
  const selected = sorted.find((t) => t.timelineId === selectedId) ?? null

  if (sorted.length === 0) {
    return <div className="flex flex-1 items-center justify-center text-body-3 text-gray-500">아직 활동 내역이 없습니다.</div>
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 gap-6">
      <div className="flex w-[437px] shrink-0 flex-col">
        <h3 className="pb-3 pl-6 text-subtitle-2 font-semibold text-lime">활동 타임라인</h3>
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto pl-6 pr-3">
          {sorted.map((item, i) => (
            <TimelineRow
              key={item.timelineId}
              item={item}
              isLatest={i === 0}
              isLast={i === sorted.length - 1}
              active={item.timelineId === selectedId}
              onSelect={() => setSelectedId(item.timelineId)}
            />
          ))}
        </div>
      </div>

      <div className="h-auto w-px shrink-0 bg-gray-700" />

      <div className="scrollbar-thin flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
        {selected ? (
          <>
            <div className="flex flex-col gap-1">
              <h4 className="text-subtitle-2 font-semibold text-gray-300">{selected.detail?.heading || selected.title}</h4>
              <span className="text-caption-2 text-gray-500">{formatOccurredAt(selected.occurredAt)}</span>
            </div>
            {selected.detail && getDetailMeta(selected.detail).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getDetailMeta(selected.detail).map((row) => (
                  <span key={row.label} className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-caption-3 text-gray-300">
                    {row.label}: {row.value}
                  </span>
                ))}
              </div>
            )}
            <div className="flex-1 whitespace-pre-wrap rounded-[24px] border border-gray-700 bg-gray-900/40 p-6 text-body-3 text-gray-100">
              {selected.detail?.body || selected.description || '내용이 없습니다.'}
            </div>
          </>
        ) : (
          <p className="text-body-3 text-gray-500">항목을 선택하면 상세 내용을 볼 수 있어요.</p>
        )}
      </div>
    </div>
  )
}
