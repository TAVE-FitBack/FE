import { useState } from 'react'
import type { CustomerDetailResponse, TimelineItem } from '../../api/consultationDetail'
import { AiAnalysisEditModal } from './AiAnalysisEditModal'

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 6 15 12 9 18" />
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

        {item.description &&
          (showBox ? (
            <div className="rounded-lg bg-gray-900 px-4 py-2 text-caption-3 text-gray-400">
              <p className="line-clamp-2 whitespace-pre-wrap">{item.description}</p>
            </div>
          ) : (
            <p className="text-caption-3 text-lime">{item.description}</p>
          ))}
      </div>
    </div>
  )
}

interface ActivityTimelineTabProps {
  customerId: string
  detail: CustomerDetailResponse
  onUpdated: () => void
}

export function ActivityTimelineTab({ customerId, detail, onUpdated }: ActivityTimelineTabProps) {
  const sorted = [...detail.timeline].sort((a, b) => (a.occurredAt < b.occurredAt ? 1 : -1))
  const [selectedId, setSelectedId] = useState<string | null>(sorted[0]?.timelineId ?? null)
  const [editOpen, setEditOpen] = useState(false)
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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
        {selected ? (
          <>
            <div className="flex flex-col gap-1">
              <h4 className="text-subtitle-2 font-semibold text-gray-300">{selected.title}</h4>
              <span className="text-caption-2 text-gray-500">{formatOccurredAt(selected.occurredAt)}</span>
            </div>
            <div className="flex-1 whitespace-pre-wrap rounded-[24px] border border-gray-700 bg-gray-900/40 p-6 text-body-3 text-gray-100">
              {selected.description || '내용이 없습니다.'}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex h-[38px] items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 text-caption-3 font-medium text-gray-400"
              >
                <PencilIcon />
                수정하기
              </button>
            </div>
          </>
        ) : (
          <p className="text-body-3 text-gray-500">항목을 선택하면 상세 내용을 볼 수 있어요.</p>
        )}
      </div>

      {editOpen && (
        <AiAnalysisEditModal
          customerId={customerId}
          initialSummary={detail.latestConsultation?.summary ?? ''}
          initialLeadTemperature={detail.aiInsight?.leadTemperature ?? ''}
          initialTemperatureBasis={detail.aiInsight?.temperatureBasis ?? ''}
          nonConversionReasons={detail.nonConversionReasons}
          onClose={() => {
            setEditOpen(false)
            onUpdated()
          }}
          onSaved={() => {
            setEditOpen(false)
            onUpdated()
          }}
        />
      )}
    </div>
  )
}
