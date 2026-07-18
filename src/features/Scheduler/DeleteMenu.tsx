interface DeleteMenuProps {
  onEdit: () => void
  onDelete: () => void
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  )
}

export function DeleteMenu({ onEdit, onDelete }: DeleteMenuProps) {
  return (
    <div className="flex w-[120px] flex-col overflow-hidden rounded-[4px] border border-gray-600">
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-1.5 border-b border-gray-600 bg-gray-700 px-3 py-1 text-caption-2 text-white hover:bg-gray-600"
      >
        <TrashIcon />
        삭제하기
      </button>
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 bg-gray-700 px-3 py-1 text-caption-2 text-white hover:bg-gray-600"
      >
        <PencilIcon />
        수정하기
      </button>
    </div>
  )
}

