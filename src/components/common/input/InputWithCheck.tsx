import type { InputHTMLAttributes } from 'react'
import { Input } from './Input'

export interface InputWithCheckProps extends InputHTMLAttributes<HTMLInputElement> {
  onCheck: () => void
  checkLabel?: string
  checkedLabel?: string
  status?: 'idle' | 'valid' | 'invalid'
  validMessage?: string
  invalidMessage?: string
}

export function InputWithCheck({
  onCheck,
  checkLabel = '중복확인',
  checkedLabel = '확인 완료',
  status = 'idle',
  validMessage = '사용가능한 닉네임입니다.',
  invalidMessage = '사용 중인 닉네임입니다.',
  ...props
}: InputWithCheckProps) {
  const checked = status !== 'idle'

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex gap-2">
        <Input className="flex-1" {...props} />
        <button
          type="button"
          onClick={onCheck}
          disabled={checked}
          className={`h-[52px] w-[92px] shrink-0 rounded-full text-button-3 font-medium transition-colors disabled:cursor-not-allowed ${
            checked ? 'bg-lime text-gray-750' : 'bg-gray-500 text-gray-600'
          }`}
        >
          {checked ? checkedLabel : checkLabel}
        </button>
      </div>
      {status === 'valid' && <p className="pl-2 text-caption-3 leading-none text-lime">{validMessage}</p>}
      {status === 'invalid' && <p className="pl-2 text-caption-3 leading-none text-error">{invalidMessage}</p>}
    </div>
  )
}
