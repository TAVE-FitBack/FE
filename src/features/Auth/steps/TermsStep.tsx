import { useState } from 'react'
import { StepProgress } from '../StepProgress'
import { TermsDetailStep } from './TermsDetailStep'

export interface TermsAgreements {
  age: boolean
  terms: boolean
  privacy: boolean
}

interface TermsStepProps {
  onNext: (agreements: TermsAgreements) => void
}

export function TermsStep({ onNext }: TermsStepProps) {
  const [age, setAge] = useState(false)
  const [terms, setTerms] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [detailView, setDetailView] = useState(false)

  const allAgreed = age && terms && privacy

  function toggleAll() {
    const next = !allAgreed
    setAge(next)
    setTerms(next)
    setPrivacy(next)
  }

  function handleAgreeFromDetail() {
    setTerms(true)
    setPrivacy(true)
    setDetailView(false)
  }

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="flex flex-col items-start gap-4 pt-2">
        <h2 className="text-subtitle-2 font-semibold text-gray-100">약관 동의</h2>
        <StepProgress currentStep={1} totalSteps={3} />
      </div>

      <div className="flex w-full flex-col items-start justify-center gap-6">
        <label className="flex cursor-pointer items-center gap-4 pl-2 pr-1">
          <RoundCheck checked={allAgreed} onChange={toggleAll} />
          <span className="text-button-1 font-medium text-gray-100">모든 약관에 동의합니다.</span>
        </label>

        <div className="h-px w-full bg-white/10" />

        <div className="flex w-full flex-col items-start gap-6 pl-2">
          <label className="flex cursor-pointer items-center gap-4">
            <RoundCheck checked={age} onChange={() => setAge((v) => !v)} />
            <span className="text-button-1 font-medium text-gray-100">(필수) 만 14세 이상입니다.</span>
          </label>

          <TermsRow
            label="이용약관"
            checked={terms}
            onChange={() => setTerms((v) => !v)}
            onViewDetail={() => setDetailView(true)}
          />
          <TermsRow
            label="개인정보 수집 및 이용"
            checked={privacy}
            onChange={() => setPrivacy((v) => !v)}
            onViewDetail={() => setDetailView(true)}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onNext({ age, terms, privacy })}
        disabled={!allAgreed}
        className={`h-[52px] w-full rounded-full text-button-3 font-medium transition-colors disabled:cursor-not-allowed ${
          allAgreed ? 'bg-lime text-black' : 'bg-gray-500 text-gray-600'
        }`}
      >
        다음
      </button>

      {detailView && (
        <TermsDetailStep onBack={() => setDetailView(false)} onAgree={handleAgreeFromDetail} />
      )}
    </div>
  )
}

function TermsRow({
  label,
  checked,
  onChange,
  onViewDetail,
}: {
  label: string
  checked: boolean
  onChange: () => void
  onViewDetail: () => void
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <label className="flex cursor-pointer items-center gap-4">
        <RoundCheck checked={checked} onChange={onChange} />
        <span className="text-button-1 font-medium text-gray-100">
          (필수) <span className="underline">{label}</span> 동의
        </span>
      </label>
      <button
        type="button"
        onClick={onViewDetail}
        aria-label={`${label} 더보기`}
        className="flex h-8 w-8 items-center justify-center"
      >
        <ChevronRight />
      </button>
    </div>
  )
}

function RoundCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <span className="relative h-6 w-6 shrink-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`h-full w-full cursor-pointer appearance-none rounded-full border transition-colors ${
          checked ? 'border-lime bg-lime' : 'border-gray-500 bg-gray-700'
        }`}
      />
      {checked && (
        <svg
          viewBox="0 0 14 10"
          fill="none"
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[10px] w-[14px] -translate-x-1/2 -translate-y-1/2"
        >
          <path d="M1 5l4 4 8-8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0 text-gray-500">
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
