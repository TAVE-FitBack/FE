import { useState, type ReactNode } from 'react'
import { StoreSetupLayout } from '../StoreSetupLayout'
import { EventFormModal } from '../EventFormModal'
import { createEvent, deleteEvent, updateEvent, type EventCreateRequest, type EventResponse, type EventType } from '../../../api/store'
import { ApiError } from '../../../api/client'
import type { TaggedItem } from './OperationInfoStep'

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  DISCOUNT: '할인 이벤트',
  PROMOTION: '프로모션',
  PACKAGE: '패키지',
  REFERRAL: '추천인 이벤트',
  OTHER: '기타 이벤트',
}

interface EventsStepProps {
  nickname: string
  services: TaggedItem[]
  onBack: () => void
  onNext: () => void
}

export function EventsStep({ nickname, services, onBack, onNext }: EventsStepProps) {
  const [events, setEvents] = useState<EventResponse[]>([])
  const [modalMode, setModalMode] = useState<'closed' | 'create' | EventResponse>('closed')
  const [listError, setListError] = useState('')
  const [deletingId, setDeletingId] = useState<string | undefined>()

  async function handleSave(data: EventCreateRequest) {
    if (modalMode === 'closed') return
    if (modalMode === 'create') {
      const res = await createEvent(data)
      setEvents((prev) => [...prev, res])
    } else {
      const res = await updateEvent(modalMode.id, { ...data, status: modalMode.status })
      setEvents((prev) => prev.map((e) => (e.id === res.id ? res : e)))
    }
    setModalMode('closed')
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    setListError('')
    try {
      await deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : '이벤트 삭제에 실패했습니다.')
    } finally {
      setDeletingId(undefined)
    }
  }

  return (
    <StoreSetupLayout
      nickname={nickname}
      onBack={onBack}
      onNext={onNext}
      secondaryAction={{ label: '나중에 설정하기', onClick: onNext }}
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-title-3 font-semibold text-white">서비스 및 혜택 관리</h2>
          <p className="text-body-3 text-white/50">매장에서 제공하는 서비스와 이벤트 정보를 등록하고 관리하세요.</p>
        </div>

        <div className="flex w-full flex-col gap-6 rounded-[30px] border border-gray-700 bg-white/5 p-8">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-subtitle-2 font-semibold text-lime">04</span>
                <span className="text-subtitle-2 font-medium text-gray-300">이벤트 설정</span>
                <span className="text-caption-2 text-gray-500">(선택)</span>
              </div>
              <p className="text-body-3 font-medium text-gray-400">진행 예정 또는 상시 이벤트/혜택을 입력해 주세요.</p>
            </div>
            <button
              type="button"
              onClick={() => setModalMode('create')}
              className="shrink-0 rounded-full bg-lime px-6 py-2 text-button-3 font-medium text-gray-900"
            >
              + 이벤트 추가
            </button>
          </div>

          {events.length === 0 ? (
            <p className="w-full py-12 text-center text-body-3 text-gray-500">아직 등록된 이벤트가 없습니다.</p>
          ) : (
            <div className="w-full overflow-x-auto rounded-[24px] border border-gray-700">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-800">
                    <Th>이벤트명</Th>
                    <Th>대상</Th>
                    <Th>유형</Th>
                    <Th>할인율</Th>
                    <Th>기간</Th>
                    <Th>상태</Th>
                    <Th center>관리</Th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => {
                    const service = services.find((s) => s.id === event.serviceId)
                    const status = getStatus(event)
                    const isDeleting = deletingId === event.id
                    return (
                      <tr key={event.id} className="border-t border-gray-700">
                        <Td className="text-lime">{event.title}</Td>
                        <Td>{service?.name ?? '전체 서비스'}</Td>
                        <Td>{EVENT_TYPE_LABELS[event.eventType]}</Td>
                        <Td>{event.discountRate != null ? `${event.discountRate.toFixed(2)}%` : '-'}</Td>
                        <Td>
                          {formatDate(event.startDate)} ~ {formatDate(event.endDate)}
                        </Td>
                        <Td>
                          <span
                            className={`rounded-full px-3 py-1 text-caption-2 ${
                              status.tone === 'lime' ? 'bg-lime/10 text-lime' : 'bg-gray-600 text-gray-100'
                            }`}
                          >
                            {status.label}
                          </span>
                        </Td>
                        <Td center>
                          <div className="flex items-center justify-center gap-3">
                            <button type="button" onClick={() => setModalMode(event)} aria-label="수정">
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(event.id)}
                              disabled={isDeleting}
                              aria-label="삭제"
                              className="disabled:opacity-40"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </Td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {listError && <p className="text-caption-3 leading-none text-error">{listError}</p>}
        </div>
      </div>

      {modalMode !== 'closed' && (
        <EventFormModal
          services={services}
          initialEvent={modalMode === 'create' ? undefined : modalMode}
          onSave={handleSave}
          onClose={() => setModalMode('closed')}
        />
      )}
    </StoreSetupLayout>
  )
}

function getStatus(event: EventResponse): { label: string; tone: 'lime' | 'gray' } {
  const today = new Date().toISOString().slice(0, 10)
  if (event.endDate < today) return { label: '종료', tone: 'gray' }
  if (event.startDate > today) return { label: '예정', tone: 'gray' }
  return { label: '진행중', tone: 'lime' }
}

function formatDate(date: string) {
  return date.replaceAll('-', '.')
}

function Th({ children, center }: { children: ReactNode; center?: boolean }) {
  return <th className={`p-4 text-body-3 font-normal text-gray-100 ${center ? 'text-center' : 'text-left'}`}>{children}</th>
}

function Td({ children, className = '', center }: { children: ReactNode; className?: string; center?: boolean }) {
  return <td className={`p-4 text-body-3 text-gray-100 ${center ? 'text-center' : ''} ${className}`}>{children}</td>
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-gray-100" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-error" aria-hidden>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  )
}
