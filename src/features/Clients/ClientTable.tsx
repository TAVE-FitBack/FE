import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { ClientTab } from '../../pages/ClientsPage'
import type { ConsultationItem, CustomerStatus, InquiryItem, InquiryStatus, ManagementStage } from '../../api/customerManagement'
import { useDropdown } from './registrationFormControls'

interface ClientTableProps {
  tab: ClientTab
  consultRows: ConsultationItem[]
  inquiryRows: InquiryItem[]
  onConvertInquiry: (inquiryId: string) => void
  onDeleteInquiry: (inquiryId: string) => void
  onOpenConsultation: (customerId: string, customerStatus: CustomerStatus) => void
  hasMore: boolean
  onLoadMore: () => void
}

const CONSULT_COL_WIDTHS = [40, 61, 124, 61, 87, 152, undefined, 185, 95, 95, 60, 44]
const INQUIRY_COL_WIDTHS = [40, 61, 124, 61, 87, undefined, 95, 95, 95, 60, 44]

function ColGroup({ widths }: { widths: (number | undefined)[] }) {
  return (
    <colgroup>
      {widths.map((w, i) => (
        <col key={i} style={w ? { width: `${w}px` } : undefined} />
      ))}
    </colgroup>
  )
}

export function ClientTable({
  tab,
  consultRows,
  inquiryRows,
  onConvertInquiry,
  onDeleteInquiry,
  onOpenConsultation,
  hasMore,
  onLoadMore,
}: ClientTableProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore) return
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore])

  return (
    <div className="rounded-lg border border-gray-700">
      <div className="max-h-[640px] overflow-auto">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-left">
          <ColGroup widths={tab === 'consult' ? CONSULT_COL_WIDTHS : INQUIRY_COL_WIDTHS} />
          {tab === 'consult' ? (
            <ConsultTable rows={consultRows} onOpen={onOpenConsultation} />
          ) : (
            <InquiryTable rows={inquiryRows} onConvert={onConvertInquiry} onDelete={onDeleteInquiry} />
          )}
        </table>
        {hasMore && (
          <div ref={sentinelRef} className="flex items-center justify-center py-4 text-caption-3 text-gray-500">
            불러오는 중...
          </div>
        )}
      </div>
    </div>
  )
}

function HeaderCell({ children }: { children: ReactNode }) {
  return <th className="truncate px-3 py-2.5 text-caption-3 font-medium text-gray-400">{children}</th>
}

function Cell({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent) => void
}) {
  return (
    <td onClick={onClick} className={`overflow-hidden px-3 py-4 align-middle text-caption-3 text-gray-300 ${className}`}>
      {children}
    </td>
  )
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

function MoreDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  )
}

function MoreMenuButton() {
  return (
    <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white/5 hover:text-gray-300">
      <MoreDotsIcon />
    </button>
  )
}

function InquiryRowActionsMenu({ onConvert, onDelete }: { onConvert: () => void; onDelete: () => void }) {
  const { open, setOpen, triggerRef, menuRef, rect } = useDropdown()

  return (
    <div ref={triggerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="더보기"
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-white/5 hover:text-gray-300"
      >
        <MoreDotsIcon />
      </button>

      {open &&
        rect &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: 'fixed', top: rect.top, right: window.innerWidth - (rect.left + rect.width) }}
            className="z-[70] flex flex-col items-start rounded-[20px] border border-gray-700 bg-gray-800 p-4 shadow-lg"
          >
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onDelete()
              }}
              className="w-full whitespace-nowrap py-2 text-left text-button-3 font-medium text-gray-100 hover:text-coral"
            >
              삭제하기
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onConvert()
              }}
              className="w-full whitespace-nowrap py-2 text-left text-button-3 font-medium text-gray-100 hover:text-lime"
            >
              상담으로 이동
            </button>
          </div>,
          document.body,
        )}
    </div>
  )
}

const GENDER_LABEL: Record<'MALE' | 'FEMALE', string> = { MALE: '남', FEMALE: '여' }

function formatDate(value: string | null | undefined): string {
  if (!value) return '-'
  return value.slice(0, 10).replaceAll('-', '.')
}

const MANAGEMENT_STAGE_LABEL: Record<ManagementStage, string> = {
  CONSULTATION: '상담',
  FIRST_FOLLOW_UP: '1차 팔로업',
  SECOND_FOLLOW_UP: '2차 팔로업',
  TRIAL: '체험',
  FINAL_DECISION: '최종 결정',
}

function StageCell({ row }: { row: ConsultationItem }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-caption-3 text-gray-200">{MANAGEMENT_STAGE_LABEL[row.managementStage]}</span>
      {row.followUpManagementStage.type !== 'NONE' && (
        <span className="text-caption-2 text-gray-500">{row.followUpManagementStage.label}</span>
      )}
    </div>
  )
}

function ReasonTags({ reasons }: { reasons: ConsultationItem['nonConversionReasons'] }) {
  if (reasons.length === 0) return null
  return (
    <div className="flex max-h-[50px] max-w-[220px] flex-wrap gap-1 overflow-hidden">
      {reasons.map((reason, i) => (
        <span
          key={`${reason.reasonType}-${i}`}
          className="whitespace-nowrap rounded-[4px] bg-[rgba(237,6,2,0.4)] px-2 py-0.5 text-caption-2 text-gray-300"
        >
          {reason.reasonType}
        </span>
      ))}
    </div>
  )
}

export const CONSULT_STATUS_LABEL: Record<CustomerStatus, string> = {
  REGISTERED: '등록 완료',
  SCHEDULED: '등록 예정',
  PENDING: '보류',
  NO_SHOW: '미방문/노쇼',
  LOST: '이탈',
}

export const CONSULT_STATUS_STYLE: Record<CustomerStatus, string> = {
  REGISTERED: 'bg-lime/10 border-lime/30 text-lime',
  SCHEDULED: 'bg-blue/10 border-blue/30 text-blue',
  PENDING: 'bg-gray-400/10 border-gray-400/30 text-gray-500',
  NO_SHOW: 'bg-white/10 border-white/30 text-white',
  LOST: 'bg-coral/10 border-coral/30 text-coral',
}

const INQUIRY_STATUS_STYLE: Record<InquiryStatus, string> = {
  RECEIVED: 'bg-white/10 text-white',
  VISIT_SCHEDULED: 'bg-lime/10 text-lime',
  VISIT_CANCELED: 'bg-coral/10 text-coral',
  CONVERTED: 'bg-lime/10 text-lime',
}

function StatusBadge({ label, className, bordered = false }: { label: string; className: string; bordered?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 w-[71px] items-center justify-center whitespace-nowrap rounded-full text-caption-2 ${
        bordered ? 'border' : ''
      } ${className}`}
    >
      {label}
    </span>
  )
}

function ConsultTable({ rows, onOpen }: { rows: ConsultationItem[]; onOpen: (customerId: string, customerStatus: CustomerStatus) => void }) {
  return (
    <>
      <thead>
        <tr className="sticky top-0 z-10 border-b border-gray-700 bg-gray-800">
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
          <HeaderCell>문의 일자</HeaderCell>
          <HeaderCell>담당자</HeaderCell>
          <HeaderCell> </HeaderCell>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.customerId}
            onClick={() => onOpen(row.customerId, row.customerStatus)}
            className="cursor-pointer border-b border-gray-800 last:border-b-0 hover:bg-gray-800/40"
          >
            <Cell onClick={(e) => e.stopPropagation()}>
              <RowCheckbox />
            </Cell>
            <Cell className="truncate">{row.name}</Cell>
            <Cell className="truncate text-gray-400">
              {row.phoneNum} · {GENDER_LABEL[row.gender]}
            </Cell>
            <Cell className="truncate">{row.serviceName}</Cell>
            <Cell className="truncate text-gray-400">{row.inflowPathName}</Cell>
            <Cell>
              <StageCell row={row} />
            </Cell>
            <Cell>
              <span className="line-clamp-2 text-caption-2 text-gray-400">{row.latestMemo}</span>
            </Cell>
            <Cell>
              <ReasonTags reasons={row.nonConversionReasons} />
            </Cell>
            <Cell>
              <StatusBadge label={CONSULT_STATUS_LABEL[row.customerStatus]} className={CONSULT_STATUS_STYLE[row.customerStatus]} bordered />
            </Cell>
            <Cell className="truncate text-gray-400">{formatDate(row.latestConsultAt)}</Cell>
            <Cell className="truncate text-gray-400">{row.counselorName}</Cell>
            <Cell onClick={(e) => e.stopPropagation()}>
              <MoreMenuButton />
            </Cell>
          </tr>
        ))}
      </tbody>
    </>
  )
}

function InquiryTable({
  rows,
  onConvert,
  onDelete,
}: {
  rows: InquiryItem[]
  onConvert: (inquiryId: string) => void
  onDelete: (inquiryId: string) => void
}) {
  return (
    <>
      <thead>
        <tr className="sticky top-0 z-10 border-b border-gray-700 bg-gray-800">
          <HeaderCell>
            <RowCheckbox />
          </HeaderCell>
          <HeaderCell>이름</HeaderCell>
          <HeaderCell>연락처/성별</HeaderCell>
          <HeaderCell>종목</HeaderCell>
          <HeaderCell>방문경로</HeaderCell>
          <HeaderCell>메모</HeaderCell>
          <HeaderCell>상태</HeaderCell>
          <HeaderCell>문의 일자</HeaderCell>
          <HeaderCell>방문 예정일</HeaderCell>
          <HeaderCell>담당자</HeaderCell>
          <HeaderCell> </HeaderCell>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.inquiryId} className="border-b border-gray-800 last:border-b-0 hover:bg-gray-800/40">
            <Cell>
              <RowCheckbox />
            </Cell>
            <Cell className="truncate">{row.name}</Cell>
            <Cell className="truncate text-gray-400">
              {row.phoneNum} · {GENDER_LABEL[row.gender]}
            </Cell>
            <Cell className="truncate">{row.serviceName}</Cell>
            <Cell className="truncate text-gray-400">{row.inflowPathName}</Cell>
            <Cell>
              <span className="line-clamp-2 text-caption-2 text-gray-400">{row.memo}</span>
            </Cell>
            <Cell>
              <StatusBadge label={row.inquiryStatusName} className={INQUIRY_STATUS_STYLE[row.inquiryStatus]} />
            </Cell>
            <Cell className="truncate text-gray-400">{formatDate(row.inquiredAt)}</Cell>
            <Cell className="truncate text-gray-400">{formatDate(row.visitScheduledAt)}</Cell>
            <Cell className="truncate text-gray-400">{row.counselorName}</Cell>
            <Cell>
              <InquiryRowActionsMenu onConvert={() => onConvert(row.inquiryId)} onDelete={() => onDelete(row.inquiryId)} />
            </Cell>
          </tr>
        ))}
      </tbody>
    </>
  )
}
