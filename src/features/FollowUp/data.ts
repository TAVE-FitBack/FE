import type { CustomerStatus, Gender } from '../../api/customerManagement'

export type FollowUpTab = 'today' | 'upcoming' | 'ended'
export type FollowUpRound = 1 | 2 | 3

export const GENDER_OPTIONS: Gender[] = ['MALE', 'FEMALE']
export const GENDER_LABEL: Record<Gender, string> = { MALE: '남성', FEMALE: '여성' }
export const GENDER_SHORT: Record<Gender, string> = { MALE: '남', FEMALE: '여' }

export const STATUS_OPTIONS: CustomerStatus[] = ['REGISTERED', 'PENDING', 'SCHEDULED', 'LOST', 'NO_SHOW']
export const CUSTOMER_STATUS_LABEL: Record<CustomerStatus, string> = {
  REGISTERED: '등록 완료',
  PENDING: '보류',
  SCHEDULED: '등록 예정',
  LOST: '이탈',
  NO_SHOW: '미방문/노쇼',
}

export const TEMPERATURE_OPTIONS: string[] = ['HOT', 'WARM', 'HOLD', 'COLD', 'LOST']
