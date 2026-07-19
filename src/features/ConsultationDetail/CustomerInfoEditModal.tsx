import { useState } from 'react'
import { ApiError, request } from '../../api/client'
import type { Gender } from '../../api/customerManagement'
import type { PreferredContactChannel } from '../../api/inquiries'
import {
  CloseIcon,
  DateField,
  DateTimeField,
  FieldLabel,
  GENDER_OPTIONS,
  ToggleGroup,
  inputClass,
} from '../Clients/registrationFormControls'

export interface CustomerInfoEditInitial {
  name: string
  gender: Gender
  birthDate: string
  phoneNum: string
  preferredContactChannel: PreferredContactChannel
  visitedAt: string
}

/**
 * TODO: 이 화면에 대응하는 백엔드 엔드포인트가 아직 없음(/api/customers/{customerId} 하위엔
 * 이름/생년월일/성별/연락처 수정 API가 없음, 2026-07-19 Swagger 기준). 실제 엔드포인트가
 * 추가되면 이 함수를 교체할 것 — 지금은 호출 시 항상 실패한다.
 */
function updateConsultationCustomerInfo(customerId: string, req: CustomerInfoEditInitial): Promise<void> {
  return request<void>(`/api/consultations/${customerId}/customer-info`, { method: 'PATCH', body: req })
}

interface CustomerInfoEditModalProps {
  customerId: string
  initial: CustomerInfoEditInitial
  onClose: () => void
  onSaved: (updated: CustomerInfoEditInitial) => void
}

export function CustomerInfoEditModal({ customerId, initial, onClose, onSaved }: CustomerInfoEditModalProps) {
  const [name, setName] = useState(initial.name)
  const [birthDate, setBirthDate] = useState(initial.birthDate)
  const [gender, setGender] = useState<Gender>(initial.gender)
  const [phone, setPhone] = useState(initial.phoneNum)
  const [visitDate, setVisitDate] = useState(initial.visitedAt.slice(0, 10))
  const [visitTime, setVisitTime] = useState(initial.visitedAt.slice(11, 16))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = name.trim() !== '' && birthDate !== '' && phone.trim() !== ''

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError('')
    try {
      const visitedAt = visitDate && visitTime ? `${visitDate}T${visitTime}:00` : initial.visitedAt
      await updateConsultationCustomerInfo(customerId, {
        name,
        gender,
        birthDate,
        phoneNum: phone,
        preferredContactChannel: initial.preferredContactChannel,
        visitedAt,
      })
      onSaved({ name, gender, birthDate, phoneNum: phone, preferredContactChannel: initial.preferredContactChannel, visitedAt })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '고객 정보 수정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-6">
      <div className="relative flex w-full max-w-[420px] flex-col gap-6 rounded-[30px] bg-gray-800 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-subtitle-2 font-semibold text-gray-200">고객 정보 수정</h2>
          <button type="button" onClick={onClose} aria-label="닫기" className="text-gray-500 hover:text-gray-300">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>이름</FieldLabel>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="고객 이름 입력"
            className={inputClass}
          />
        </div>

        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <FieldLabel>생년월일</FieldLabel>
            <DateField value={birthDate} onChange={setBirthDate} paddingClassName="px-[14px]" />
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <FieldLabel>성별</FieldLabel>
            <ToggleGroup options={GENDER_OPTIONS} value={gender} onChange={setGender} compact />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>연락처</FieldLabel>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>방문 시간</FieldLabel>
          <DateTimeField date={visitDate} time={visitTime} onDateChange={setVisitDate} onTimeChange={setVisitTime} />
        </div>

        {error && <p className="text-caption-3 text-error">{error}</p>}

        <button
          type="button"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
          className={`flex h-12 items-center justify-center rounded-full text-button-3 font-medium ${
            canSubmit && !submitting ? 'bg-lime text-gray-800' : 'cursor-not-allowed bg-gray-700 text-gray-500'
          }`}
        >
          {submitting ? '수정 중...' : '수정하기'}
        </button>
      </div>
    </div>
  )
}
