import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  generateMessageDraft,
  getMessageTemplateOptions,
  type MessageTemplateOptionsResponse,
  type MessageTone,
  type MessageVersionType,
} from '../../api/consultationDetail'
import { ApiError } from '../../api/client'
import { ChevronRightIcon, useDropdown } from '../Clients/registrationFormControls'

function PaperPlaneIcon({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.9 6.9L22 9.6l-5.4 4.8L18.2 22 12 18.1 5.8 22l1.6-7.6L2 9.6l7.1-.7z" />
    </svg>
  )
}

/** 메시지 초안 패널 전용 셀렉트 — Figma node 1231-9858: bg-gray-700, 테두리 없음, h-45px, pill 형태 */
function DarkSelectField({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}) {
  const { open, setOpen, triggerRef, menuRef, rect } = useDropdown()
  const selectedLabel = options.find((o) => o.value === value)?.label

  return (
    <div className="flex w-full flex-col gap-2">
      <span className="text-caption-3 text-gray-400">{label}</span>
      <div ref={triggerRef} className="relative w-full">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-[45px] w-full items-center justify-between rounded-full bg-gray-700 px-6 text-body-3 text-[#e5e2e1] outline-none"
        >
          <span className={selectedLabel ? '' : 'text-gray-500'}>{selectedLabel ?? placeholder}</span>
          <ChevronRightIcon className="rotate-90 text-gray-300" />
        </button>

        {open &&
          rect &&
          createPortal(
            <div
              ref={menuRef}
              data-popover-portal
              style={{ position: 'fixed', top: rect.top, left: rect.left, width: rect.width }}
              className="z-[90] rounded-[24px] border border-gray-700 bg-gray-800 p-3 shadow-lg"
            >
              <div className="flex max-h-60 flex-col overflow-y-auto">
                {options.length === 0 && <span className="px-3 py-2 text-caption-3 text-gray-600">옵션이 없습니다</span>}
                {options.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => {
                      onChange(o.value)
                      setOpen(false)
                    }}
                    className={`block w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-body-3 text-gray-100 ${
                      value === o.value ? 'bg-gray-700/50' : 'hover:bg-gray-700/50'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </div>
  )
}

interface MessageDraftPanelProps {
  customerId: string
  followUpId: string | null
}

export function MessageDraftPanel({ customerId, followUpId }: MessageDraftPanelProps) {
  const [options, setOptions] = useState<MessageTemplateOptionsResponse | null>(null)
  const [optionsError, setOptionsError] = useState('')

  const [tone, setTone] = useState<MessageTone | ''>('')
  const [versionType, setVersionType] = useState<MessageVersionType | ''>('')
  const [eventId, setEventId] = useState('')
  const [additionalInstruction, setAdditionalInstruction] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getMessageTemplateOptions(customerId)
      .then((res) => {
        setOptions(res)
        setTone((prev) => prev || res.tonePresets[0]?.tonePreset || '')
        setVersionType((prev) => prev || res.versionTypes[0]?.versionType || '')
      })
      .catch((err) => setOptionsError(err instanceof ApiError ? err.message : '메시지 생성 옵션을 불러오지 못했습니다.'))
  }, [customerId])

  const toneOptions = (options?.tonePresets ?? []).map((t) => ({ value: t.tonePreset, label: t.label }))
  const versionOptions = (options?.versionTypes ?? []).map((v) => ({ value: v.versionType, label: v.label }))
  const eventOptions = [{ value: '', label: '없음' }, ...(options?.events ?? []).map((e) => ({ value: e.eventId, label: e.title }))]
  const versionLabel = versionOptions.find((v) => v.value === versionType)?.label

  const canGenerate = followUpId !== null && tone !== '' && versionType !== ''

  async function handleGenerate() {
    if (!canGenerate || !followUpId || tone === '' || versionType === '' || generating) return
    setGenerating(true)
    setError('')
    try {
      const res = await generateMessageDraft(customerId, {
        followUpId,
        tonePreset: tone,
        versionType,
        eventId: eventId || undefined,
        additionalInstruction: additionalInstruction.trim() || undefined,
      })
      setDraft(res.content)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '메시지 생성에 실패했습니다.')
    } finally {
      setGenerating(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex w-full max-w-[368px] shrink-0 flex-col overflow-y-auto rounded-bl-[24px] rounded-br-[24px] border border-gray-700 bg-gray-900/40">
      <div className="flex flex-col gap-4 px-6 pb-3 pt-6">
        <h3 className="text-subtitle-2 font-medium text-gray-300">메시지 초안</h3>

        {optionsError && <p className="text-caption-3 text-error">{optionsError}</p>}
        {!followUpId && !optionsError && (
          <p className="text-caption-3 text-gray-500">진행 중인 후속 연락이 없어 메시지를 생성할 수 없습니다.</p>
        )}

        <DarkSelectField label="말투" placeholder="말투 선택" value={tone} options={toneOptions} onChange={(v) => setTone(v as MessageTone)} />
        <DarkSelectField
          label="길이"
          placeholder="길이 선택"
          value={versionType}
          options={versionOptions}
          onChange={(v) => setVersionType(v as MessageVersionType)}
        />
        <DarkSelectField label="혜택 안내" placeholder="혜택 선택" value={eventId} options={eventOptions} onChange={setEventId} />

        <div className="flex flex-col gap-2">
          <span className="text-caption-3 text-gray-400">추가정보 입력</span>
          <textarea
            value={additionalInstruction}
            onChange={(e) => setAdditionalInstruction(e.target.value)}
            placeholder="내용을 입력하세요"
            maxLength={500}
            className="h-[103px] w-full resize-none rounded-[24px] border border-gray-600 bg-gray-800 p-[17px] text-caption-3 text-gray-100 outline-none placeholder:text-gray-500 focus:border-lime"
          />
        </div>

        {error && <p className="text-caption-3 text-error">{error}</p>}
      </div>

      <div className="px-6 pb-6 pt-4">
        <button
          type="button"
          disabled={!canGenerate || generating}
          onClick={handleGenerate}
          className={`flex h-[37px] w-full items-center justify-center gap-2 rounded-full text-button-3 font-medium ${
            canGenerate && !generating ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
          }`}
        >
          <PaperPlaneIcon />
          {generating ? '생성 중...' : '메시지 생성'}
        </button>
      </div>

      {draft && (
        <>
          <div className="h-px w-full bg-gray-700" />
          <div className="flex flex-col gap-2 p-6">
            <div className="flex items-center gap-1">
              <span className="text-caption-3 text-lime">{versionLabel ?? '표준'} (권장)</span>
              <StarIcon />
            </div>
            <p className="whitespace-pre-wrap text-caption-1 text-gray-100">{draft}</p>
          </div>
          <div className="h-px w-full bg-gray-700" />
          <div className="flex items-center justify-between px-6 py-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-1 text-body-3 text-lime disabled:text-gray-500"
            >
              <RefreshIcon />
              다시 생성
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-full bg-lime px-6 py-2 text-body-3 font-medium text-gray-800"
            >
              <CopyIcon />
              {copied ? '복사됨' : '복사하기'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
