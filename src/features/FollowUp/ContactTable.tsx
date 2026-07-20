import type { ReactNode } from 'react'
import type { FollowUpEndedItem } from '../../api/followUps'
import { GENDER_SHORT } from './data'
import { ReasonTags, RegistrationStatusBadge } from './badges'

interface ContactTableProps {
  contacts: FollowUpEndedItem[]
}

const COL_WIDTHS = [40, 61, 124, 61, 87, 152, undefined, 149, 95, 95, 60, 44]

function ColGroup() {
  return (
    <colgroup>
      {COL_WIDTHS.map((w, i) => (
        <col key={i} style={w ? { width: `${w}px` } : undefined} />
      ))}
    </colgroup>
  )
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="truncate px-3 py-2.5 text-caption-3 font-medium text-gray-400">{children}</th>
}

function Cell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`overflow-hidden px-3 py-4 align-middle text-caption-3 text-gray-300 ${className}`}>{children}</td>
}

function RowCheckbox() {
  return (
    <label className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        className="peer absolute inset-0 h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-600 bg-gray-800 checked:border-transparent checked:bg-lime"
      />
      <svg
        className="pointer-events-none hidden h-[7px] w-[10px] text-gray-800 peer-checked:block"
        viewBox="0 0 14 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="1 5 5 9 13 1" />
      </svg>
    </label>
  )
}

function MoreMenuButton() {
  return (
    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white/5 hover:text-gray-300">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="5" r="2" />
        <circle cx="12" cy="12" r="2" />
        <circle cx="12" cy="19" r="2" />
      </svg>
    </button>
  )
}

function StageIndicator({ stage }: { stage: 1 | 2 | 3 }) {
  return (
    <div className="flex w-fit items-center rounded-full bg-gray-900 p-1">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center">
          {n > 1 && (
            <div className="flex w-6 items-center justify-center">
              <div className="h-px w-4 bg-gray-700" />
            </div>
          )}
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full text-caption-2 font-semibold ${
              n === stage ? 'bg-lime text-gray-800' : 'bg-gray-700 text-gray-400'
            }`}
          >
            {n}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContactTable({ contacts }: ContactTableProps) {
  return (
    <div className="scrollbar-thin overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
        <ColGroup />
        <thead>
          <tr className="border-b border-gray-700 bg-gray-800">
            <HeaderCell>
              <RowCheckbox />
            </HeaderCell>
            <HeaderCell>이름</HeaderCell>
            <HeaderCell>연락처/성별</HeaderCell>
            <HeaderCell>종목</HeaderCell>
            <HeaderCell>방문경로</HeaderCell>
            <HeaderCell>관리 단계</HeaderCell>
            <HeaderCell>메모</HeaderCell>
            <HeaderCell>미등록 사유</HeaderCell>
            <HeaderCell>등록 상태</HeaderCell>
            <HeaderCell>방문 일자</HeaderCell>
            <HeaderCell>담당자</HeaderCell>
            <HeaderCell> </HeaderCell>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 && (
            <tr>
              <td colSpan={12} className="px-3 py-8 text-center text-caption-3 text-gray-600">
                대상자가 없습니다
              </td>
            </tr>
          )}
          {contacts.map((c) => (
            <tr key={c.followUpId} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/40">
              <Cell>
                <RowCheckbox />
              </Cell>
              <Cell>
                <span className="truncate text-gray-300">{c.customerName}</span>
              </Cell>
              <Cell className="truncate text-gray-400">
                {c.phoneNum} · {GENDER_SHORT[c.gender]}
              </Cell>
              <Cell className="truncate">{c.serviceName}</Cell>
              <Cell className="truncate text-gray-400">-</Cell>
              <Cell>
                <StageIndicator stage={c.contactRound as 1 | 2 | 3} />
              </Cell>
              <Cell>
                <span className="line-clamp-2 text-caption-3 text-gray-400">{c.memo}</span>
              </Cell>
              <Cell>
                <ReasonTags reasons={c.nonConversionReasons.map((r) => r.reasonType)} />
              </Cell>
              <Cell>
                <RegistrationStatusBadge status={c.customerStatus} />
              </Cell>
              <Cell className="truncate text-gray-400">-</Cell>
              <Cell className="truncate text-gray-400">-</Cell>
              <Cell>
                <MoreMenuButton />
              </Cell>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
