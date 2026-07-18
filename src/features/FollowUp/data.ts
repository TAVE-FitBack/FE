export type FollowUpTab = 'today' | 'upcoming' | 'ended'
export type FollowUpRound = 1 | 2 | 3
export type LeadTemperature = 'HOT' | 'WARM' | 'HOLD' | 'COLD' | 'LOST'
export type ContactStatus = 'PENDING' | 'SENT'
export type ReplyStatus = 'UNKNOWN' | 'REPLIED'
export type Gender = '여성' | '남성'

export const GENDER_OPTIONS: Gender[] = ['여성', '남성']
export const SERVICE_OPTIONS = ['헬스권', '요가', 'PT', '스피닝']
export const REASON_OPTIONS = [
  '가격 부담',
  '일정 불일치',
  '비교 검토',
  '목표 불명확',
  '초보 불안',
  '체험 후 결정',
  '거리/접근성',
  '이용조건 안맞음',
  '이직/이사',
  '시설 불만족',
]
export const STATUS_OPTIONS = ['미방문/노쇼', '보류', '등록 완료', '등록 예정', '이탈', '문의접수', '방문예정', '방문 취소']
export const TEMPERATURE_OPTIONS: LeadTemperature[] = ['HOT', 'WARM', 'HOLD', 'COLD', 'LOST']
export const VISIT_PATH_OPTIONS = ['네이버 예약', '워크인', '전화', '지인소개', '인스타']
export const MANAGERS = ['이담당', '박담당', '정담당']

export type ManagementStage = 1 | 2 | 3

export interface FollowUpContact {
  id: string
  name: string
  gender: Gender
  temperature: LeadTemperature
  lastContactDate: string
  service: string
  phone: string
  visitBadge: string
  reasons: string[]
  memo: string
  round: FollowUpRound
  contactStatus: ContactStatus
  replyStatus: ReplyStatus
  tab: FollowUpTab
  visitPath: string
  stage: ManagementStage
  registrationStatus: string
  visitDate: string
  manager: string
}

const NAMES = ['김철수', '이서연', '박지훈', '최수아', '정도윤', '한지민', '오세훈', '강하늘', '윤아름']

function buildContact(i: number, round: FollowUpRound, tab: FollowUpTab): FollowUpContact {
  const temperatures: LeadTemperature[] = ['HOT', 'WARM', 'HOLD', 'COLD', 'LOST']
  const stages: ManagementStage[] = [1, 2, 3]
  return {
    id: `${tab}-${round}-${i}`,
    name: NAMES[(i + round) % NAMES.length],
    gender: i % 2 === 0 ? '여성' : '남성',
    temperature: temperatures[(i + round) % temperatures.length],
    lastContactDate: '2023-05-20',
    service: SERVICE_OPTIONS[i % SERVICE_OPTIONS.length],
    phone: '010-1234-5678',
    visitBadge: '방문 예정',
    reasons: ['이직/이사', '이용조건 안맞음', '초보 불안'],
    memo: '지난 달에도 6~12개월권 문의했었는데 이번달 이벤트 문의..',
    round,
    contactStatus: i === 0 ? 'SENT' : 'PENDING',
    replyStatus: i === 1 ? 'REPLIED' : 'UNKNOWN',
    tab,
    visitPath: VISIT_PATH_OPTIONS[i % VISIT_PATH_OPTIONS.length],
    stage: stages[(i + round) % stages.length],
    registrationStatus: '등록 완료',
    visitDate: '2023.05.20',
    manager: MANAGERS[i % MANAGERS.length],
  }
}

function buildRound(round: FollowUpRound, tab: FollowUpTab, count: number): FollowUpContact[] {
  return Array.from({ length: count }, (_, i) => buildContact(i, round, tab))
}

// 목업 데이터 — 실제 후속 연락 API가 나오면 이 파일을 교체합니다.
export const MOCK_CONTACTS: FollowUpContact[] = [
  ...buildRound(1, 'upcoming', 3),
  ...buildRound(2, 'upcoming', 3),
  ...buildRound(3, 'upcoming', 3),
  ...buildRound(1, 'today', 2),
  ...buildRound(2, 'today', 1),
  ...buildRound(3, 'today', 2),
  ...buildRound(1, 'ended', 2),
  ...buildRound(2, 'ended', 2),
  ...buildRound(3, 'ended', 1),
]
