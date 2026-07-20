import { useState, type ReactNode } from 'react'
import type { EventCreateRequest, EventResponse, EventType } from '../../api/store'
import { ApiError } from '../../api/client'
import type { TaggedItem } from './steps/OperationInfoStep'
import { DatePickerField, SelectField } from '../Clients/registrationFormControls'

const EVENT_TYPE_OPTIONS: { label: string; value: EventType }[] = [
  { label: '할인', value: 'DISCOUNT' },
  { label: '프로모션', value: 'PROMOTION' },
  { label: '패키지', value: 'PACKAGE' },
  { label: '추천인', value: 'REFERRAL' },
  { label: '기타', value: 'OTHER' },
]

interface EventFormModalProps {
  services: TaggedItem[]
  initialEvent?: EventResponse
  onSave: (data: EventCreateRequest) => Promise<void>
  onClose: () => void
}

export function EventFormModal({ services, initialEvent, onSave, onClose }: EventFormModalProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? '')
  const [eventType, setEventType] = useState<EventType | ''>(initialEvent?.eventType ?? '')
  const [description, setDescription] = useState(initialEvent?.description ?? '')
  const [discountRate, setDiscountRate] = useState(initialEvent?.discountRate?.toString() ?? '')
  const [serviceId, setServiceId] = useState(initialEvent?.serviceId ?? '')
  const [startDate, setStartDate] = useState(initialEvent?.startDate ?? '')
  const [endDate, setEndDate] = useState(initialEvent?.endDate ?? '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = title.trim().length > 0 && eventType !== '' && startDate !== '' && endDate !== ''

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await onSave({
        title: title.trim(),
        eventType: eventType as EventType,
        description: description.trim() || undefined,
        discountRate: discountRate ? Number(discountRate) : undefined,
        serviceId: serviceId || undefined,
        startDate,
        endDate,
      })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '이벤트 저장에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-[30px] bg-gray-800 p-8">
        <h3 className="text-subtitle-2 font-semibold text-white">{initialEvent ? '이벤트 수정' : '이벤트 추가'}</h3>

        <div className="flex flex-col gap-5">
          <Field label="이벤트 이름" required>
            <TextInput value={title} onChange={setTitle} placeholder="예) 여름맞이 10% 할인" />
          </Field>

          <Field label="이벤트 유형" required>
            <SelectField
              placeholder="선택해 주세요"
              value={eventType}
              options={EVENT_TYPE_OPTIONS}
              onChange={(v) => setEventType(v as EventType)}
            />
          </Field>

          <Field label="설명">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이벤트 설명을 입력하세요"
              rows={3}
              className="w-full resize-none rounded-[20px] border border-white/10 bg-white/5 px-[17px] py-[13px] text-body-3 text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-lime"
            />
          </Field>

          <Field label="할인율 (%)">
            <TextInput type="number" value={discountRate} onChange={setDiscountRate} placeholder="예) 10" />
          </Field>

          <Field label="대상 서비스">
            <SelectField
              placeholder="전체 서비스"
              value={serviceId}
              options={[{ value: '', label: '전체 서비스' }, ...services.map((s) => ({ value: s.id, label: s.name }))]}
              onChange={setServiceId}
            />
          </Field>

          <div className="flex gap-3">
            <Field label="시작일" required>
              <DatePickerField value={startDate} onChange={setStartDate} />
            </Field>
            <Field label="종료일" required>
              <DatePickerField value={endDate} onChange={setEndDate} />
            </Field>
          </div>
        </div>

        {error && <p className="text-caption-3 leading-none text-error">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] flex-1 rounded-full bg-gray-700 text-button-3 font-medium text-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="h-[52px] flex-1 rounded-full text-button-3 font-medium tracking-tight transition-colors disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-600 bg-lime text-black"
          >
            {submitting ? '저장 중...' : '완료'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <label className="text-caption-3 text-gray-100">
        {label}
        {required && <span className="text-lime">*</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[52px] w-full rounded-full border border-white/10 bg-white/5 px-[17px] text-body-3 text-gray-100 outline-none transition-colors placeholder:text-gray-500 focus:border-lime"
    />
  )
}
