/** 서버가 저장 가능한 signal key 7종 */
export type AiCheckPreviewKey =
  | 'INTEREST_SERVICE'
  | 'EXERCISE_GOAL'
  | 'EXERCISE_EXPERIENCE'
  | 'INJURY_HISTORY'
  | 'CUSTOMER_REQUEST'
  | 'COUNSELOR_RESPONSE'
  | 'SPECIAL_NOTE'

export interface AiCheckPreviewItem {
  key: AiCheckPreviewKey
  label: string
  confirmed: boolean
  value?: string
}

/** AI 중간점검(check-preview) 응답이자, 등록 요청에 그대로 실어 보내는 aiCheckPreview의 모양.
 *  서버가 이미 이 구조로 내려주므로 프론트에서 재가공하지 않고 그대로 전달한다. */
export interface AiCheckPreview {
  confirmedCount: number
  totalCount: number
  items: AiCheckPreviewItem[]
}
