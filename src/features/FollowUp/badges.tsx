import type { CustomerStatus } from '../../api/customerManagement'
import { CONSULT_STATUS_LABEL, CONSULT_STATUS_STYLE } from '../Clients/ClientTable'

const TEMPERATURE_STYLE: Record<string, string> = {
  HOT: 'bg-coral/10 text-coral',
  WARM: 'bg-coral-light/20 text-coral-light',
  HOLD: 'bg-lime-light/10 text-lime-light',
  COLD: 'bg-blue-light/20 text-blue-light',
  LOST: 'bg-gray-400/10 text-gray-400',
}
const TEMPERATURE_FALLBACK_STYLE = 'bg-gray-400/10 text-gray-400'

export function TemperatureBadge({ temperature }: { temperature: string }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] leading-none ${TEMPERATURE_STYLE[temperature] ?? TEMPERATURE_FALLBACK_STYLE}`}>
      {temperature}
    </span>
  )
}

export function VisitBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex h-7 w-[71px] shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-lime/10 text-caption-2 text-lime">
      {label}
    </span>
  )
}

export function RegistrationStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span
      className={`inline-flex h-7 w-[71px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border text-caption-2 ${CONSULT_STATUS_STYLE[status]}`}
    >
      {CONSULT_STATUS_LABEL[status]}
    </span>
  )
}

export function ReasonTags({ reasons }: { reasons: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {reasons.map((reason) => (
        <span key={reason} className="whitespace-nowrap rounded bg-[rgba(237,6,2,0.4)] px-2 py-0.5 text-[11px] leading-none text-gray-300">
          {reason}
        </span>
      ))}
    </div>
  )
}
