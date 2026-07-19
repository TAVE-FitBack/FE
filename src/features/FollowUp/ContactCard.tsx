import type { ContactStatus, FollowUpContact, ReplyStatus } from './data'
import { ReasonTags, TemperatureBadge, VisitBadge } from './badges'

interface ContactCardProps {
  contact: FollowUpContact
  onSendContact: (id: string) => void
  onMarkReplied: (id: string) => void
}

function ContactToggle({ status, onSend }: { status: ContactStatus; onSend: () => void }) {
  if (status === 'SENT') {
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

function ReplyToggle({ status, onMarkReplied }: { status: ReplyStatus; onMarkReplied: () => void }) {
  if (status === 'REPLIED') {
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

export function ContactCard({ contact, onSendContact, onMarkReplied }: ContactCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-900 p-[18px]">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-button-1 font-semibold text-gray-200">{contact.name}</span>
            <TemperatureBadge temperature={contact.temperature} />
          </div>
          <span className="text-caption-2 text-gray-400">최근 연락일 {contact.lastContactDate}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-caption-3 text-gray-400">{contact.service}</span>
            <span className="h-3 w-px bg-gray-700" />
            <span className="text-caption-3 text-gray-400">{contact.phone}</span>
          </div>
          <VisitBadge label={contact.visitBadge} />
        </div>
      </div>

      <div className="h-px w-full bg-gray-800" />

      <div className="flex flex-col gap-2">
        <ReasonTags reasons={contact.reasons} />
        <p className="truncate text-caption-3 text-gray-400">{contact.memo}</p>
      </div>

      <div className="flex items-center gap-3">
        <ContactToggle status={contact.contactStatus} onSend={() => onSendContact(contact.id)} />
        <ReplyToggle status={contact.replyStatus} onMarkReplied={() => onMarkReplied(contact.id)} />
      </div>
    </div>
  )
}
