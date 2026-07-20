/** 종목명 기준 고정 색상 — 스피닝/회원권/PT는 항상 이 색으로 표시 (배열 순서에 따라 바뀌지 않음) */
const SERVICE_COLOR_BY_NAME: Record<string, string> = {
  스피닝: 'var(--color-lime)',
  회원권: 'var(--color-blue)',
  PT: 'var(--color-coral)',
}

const FALLBACK_PALETTE = ['var(--color-gray-500)', 'var(--color-coral-light)', 'var(--color-blue-light)']

/** 매핑에 없는 종목명은 폴백 팔레트를 순서대로 배정 */
export function getServiceColor(name: string, fallbackIndex: number): string {
  return SERVICE_COLOR_BY_NAME[name] ?? FALLBACK_PALETTE[fallbackIndex % FALLBACK_PALETTE.length]
}

export type ConversionBarColor = 'coral' | 'lime' | 'blue'

const SERVICE_BAR_COLOR_BY_NAME: Record<string, ConversionBarColor> = {
  PT: 'coral',
  회원권: 'blue',
  스피닝: 'lime',
}

const FALLBACK_BAR_COLORS: ConversionBarColor[] = ['coral', 'lime', 'blue']

export function getServiceBarColor(name: string, fallbackIndex: number): ConversionBarColor {
  return SERVICE_BAR_COLOR_BY_NAME[name] ?? FALLBACK_BAR_COLORS[fallbackIndex % FALLBACK_BAR_COLORS.length]
}
