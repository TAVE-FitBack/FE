import { useState, type KeyboardEvent } from 'react'

interface TagSelectProps {
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  onAddCustom?: (value: string) => void
  allowCustom?: boolean
  otherPlaceholder?: string
  pendingValue?: string
  disabled?: boolean
}

export function TagSelect({
  options,
  selected,
  onToggle,
  onAddCustom,
  allowCustom = true,
  otherPlaceholder = '기타 : (입력 후 ENTER 시 항목 생성)',
  pendingValue,
  disabled = false,
}: TagSelectProps) {
  const [otherInput, setOtherInput] = useState('')

  function handleOtherKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const value = otherInput.trim()
    if (!value || pendingValue || disabled) return
    if (options.includes(value)) {
      if (!selected.includes(value)) onToggle(value)
    } else {
      onAddCustom?.(value)
    }
    setOtherInput('')
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selected.includes(option)
          const isPending = pendingValue === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              disabled={disabled || (Boolean(pendingValue) && !isPending)}
              className={`flex h-[52px] items-center gap-3 rounded-full border px-[17px] text-caption-2 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isSelected
                  ? 'border-lime bg-lime/10 text-lime'
                  : 'border-gray-600 bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {isSelected ? <CheckIcon /> : <span className="size-[16px] shrink-0 rounded-full border border-gray-500" />}
              <span className="truncate">{isPending ? '처리 중...' : option}</span>
            </button>
          )
        })}
      </div>

      {allowCustom && (
        <input
          type="text"
          value={otherInput}
          onChange={(e) => setOtherInput(e.target.value)}
          onKeyDown={handleOtherKeyDown}
          placeholder={otherPlaceholder}
          disabled={disabled || Boolean(pendingValue)}
          className="h-[52px] w-full rounded-full border border-gray-600 bg-white/5 px-[17px] text-body-3 text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-lime disabled:opacity-50"
        />
      )}
    </div>
  )
}

function CheckIcon() {
  return (
    <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-lime">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden>
        <path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
