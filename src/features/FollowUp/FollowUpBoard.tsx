import { ContactCard } from './ContactCard'
import type { FollowUpContact, FollowUpRound } from './data'

interface FollowUpBoardProps {
  contacts: FollowUpContact[]
  onSendContact: (id: string) => void
  onMarkReplied: (id: string) => void
}

const ROUNDS: { round: FollowUpRound; label: string }[] = [
  { round: 1, label: '1차 연락 대상자' },
  { round: 2, label: '2차 연락 대상자' },
  { round: 3, label: '3차 연락 대상자' },
]

function MoreDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

function BoardColumn({
  label,
  contacts,
  onSendContact,
  onMarkReplied,
}: {
  label: string
  contacts: FollowUpContact[]
  onSendContact: (id: string) => void
  onMarkReplied: (id: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-3xl bg-gray-800">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-subtitle-2 font-semibold text-gray-200">{label}</h3>
          <span className="text-caption-2 text-gray-500">({contacts.length}명)</span>
        </div>
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white/5 hover:text-gray-300">
          <MoreDotsIcon />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-5">
        {contacts.length === 0 && <span className="px-2 text-caption-3 text-gray-600">대상자가 없습니다</span>}
        {contacts.map((c) => (
          <ContactCard key={c.id} contact={c} onSendContact={onSendContact} onMarkReplied={onMarkReplied} />
        ))}
      </div>
    </div>
  )
}

export function FollowUpBoard({ contacts, onSendContact, onMarkReplied }: FollowUpBoardProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      {ROUNDS.map(({ round, label }) => (
        <BoardColumn
          key={round}
          label={label}
          contacts={contacts.filter((c) => c.round === round)}
          onSendContact={onSendContact}
          onMarkReplied={onMarkReplied}
        />
      ))}
    </div>
  )
}
