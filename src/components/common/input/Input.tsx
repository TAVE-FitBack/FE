import { useState, type InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ type = 'text', className = '', ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type={isPassword && showPassword ? 'text' : type}
        className={`w-full rounded-full border border-white/10 bg-white/5 px-[25px] pb-[18px] pt-[17px] text-body-3 text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-lime disabled:opacity-40 ${isPassword ? 'pr-[54px]' : ''}`}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          <EyeIcon visible={showPassword} />
        </button>
      )}
    </div>
  )
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}
