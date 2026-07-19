import type { FollowUpBoardColumn, FollowUpBoardItem } from '../../api/followUps'
import { ContactCard } from './ContactCard'

interface FollowUpBoardProps {
  columns: FollowUpBoardColumn[]
  onMarkReplied: (followUpId: string) => void
  onMarkSent: (messageTemplateId: string) => void
  onOpenDetail: (customerId: string, customerStatus: FollowUpBoardItem['customerStatus']) => void
}

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
  column,
  onMarkReplied,
  onMarkSent,
  onOpenDetail,
}: {
  column: FollowUpBoardColumn
  onMarkReplied: (followUpId: string) => void
  onMarkSent: (messageTemplateId: string) => void
  onOpenDetail: (customerId: string, customerStatus: FollowUpBoardItem['customerStatus']) => void
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-3xl bg-gray-800">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-baseline gap-1.5">
          <h3 className="text-subtitle-2 font-semibold text-gray-200">{column.title}</h3>
          <span className="text-caption-2 text-gray-500">({column.count}명)</span>
        </div>
        <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white/5 hover:text-gray-300">
          <MoreDotsIcon />
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-5">
        {column.items.length === 0 && <span className="px-2 text-caption-3 text-gray-600">대상자가 없습니다</span>}
        {column.items.map((c) => (
          <ContactCard key={c.followUpId} contact={c} onMarkReplied={onMarkReplied} onMarkSent={onMarkSent} onOpenDetail={onOpenDetail} />
        ))}
      </div>
    </div>
  )
}

export function FollowUpBoard({ columns, onMarkReplied, onMarkSent, onOpenDetail }: FollowUpBoardProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      {columns.map((column) => (
        <BoardColumn
          key={column.contactRound}
          column={column}
          onMarkReplied={onMarkReplied}
          onMarkSent={onMarkSent}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  )
}
