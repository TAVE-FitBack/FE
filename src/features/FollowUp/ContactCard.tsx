import type { FollowUpBoardItem } from '../../api/followUps'
import { ReasonTags, TemperatureBadge, VisitBadge } from './badges'

interface ContactCardProps {
  contact: FollowUpBoardItem
  onMarkReplied: (followUpId: string) => void
  onMarkSent: (messageTemplateId: string) => void
  onOpenDetail: (customerId: string, customerStatus: FollowUpBoardItem['customerStatus']) => void
}

function ContactToggle({ deliveryStatus, onSend }: { deliveryStatus: string | null; onSend: () => void }) {
  if (deliveryStatus === 'SENT') {
    return (
      <span className="flex flex-1 items-center justify-center rounded-full bg-gray-700 py-1.5 text-caption-3 font-medium text-white">
        연락 완료
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onSend}
      className="flex flex-1 items-center justify-center rounded-full bg-lime py-1.5 text-caption-3 font-medium text-gray-700"
    >
      연락 보내기
    </button>
  )
}

function ReplyToggle({ hasReply, onMarkReplied }: { hasReply: boolean; onMarkReplied: () => void }) {
  if (hasReply) {
    return (
      <span className="flex items-center justify-center rounded-full border border-lime px-6 py-1.5 text-caption-3 font-medium text-lime">
        답장 받음
      </span>
    )
  }
  return (
    <button
      type="button"
      onClick={onMarkReplied}
      className="flex items-center justify-center rounded-full border border-gray-500 px-6 py-1.5 text-caption-3 font-medium text-gray-200"
    >
      답장 유무
    </button>
  )
}

export function ContactCard({ contact, onMarkReplied, onMarkSent, onOpenDetail }: ContactCardProps) {
  function handleSend() {
    if (contact.latestMessageTemplateId) onMarkSent(contact.latestMessageTemplateId)
    onOpenDetail(contact.customerId, contact.customerStatus)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-900 p-[18px]">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-button-1 font-semibold text-gray-200">{contact.customerName}</span>
            <TemperatureBadge temperature={contact.leadTemperature} />
          </div>
          <span className="text-caption-2 text-gray-400">추천 연락일 {contact.recommendContactDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-caption-3 text-gray-400">{contact.serviceName}</span>
            <span className="h-3 w-px bg-gray-700" />
            <span className="text-caption-3 text-gray-400">{contact.phoneNum}</span>
          </div>
          <VisitBadge label="-" />
        </div>
      </div>

      <div className="h-px w-full bg-gray-800" />

      <div className="flex flex-col gap-2">
        <ReasonTags reasons={contact.nonConversionReasons.map((r) => r.reasonType)} />
        <p className="truncate text-caption-3 text-gray-400">{contact.memo}</p>
      </div>

      <div className="flex items-center gap-3">
        <ContactToggle deliveryStatus={contact.latestMessageDeliveryStatus} onSend={handleSend} />
        <ReplyToggle hasReply={contact.hasReply} onMarkReplied={() => onMarkReplied(contact.followUpId)} />
      </div>
    </div>
  )
}
