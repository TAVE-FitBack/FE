import type { RegistrationTrendSeries } from '../../../api/analysisReport'
import { getServiceColor } from './serviceColors'

const CHART_WIDTH = 480
const CHART_HEIGHT = 240
const PADDING_X = 12
const PADDING_TOP = 16
const PADDING_BOTTOM = 16

const TOTAL_COLOR = 'var(--color-lime)'

function xForIndex(i: number, count: number): number {
  const usableWidth = CHART_WIDTH - PADDING_X * 2
  return PADDING_X + (usableWidth * i) / (count - 1)
}

function yForValue(value: number, scaleMax: number): number {
  const usableHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM
  return PADDING_TOP + usableHeight * (1 - value / scaleMax)
}

/** 꺾은선 그래프 — 점들을 직선으로 이어 그림 (곡선 보간 없음) */
function buildLinePath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ')
}

interface TrendChartProps {
  months: string[]
  series: RegistrationTrendSeries[]
  totalSeriesKey: string
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

export function TrendChart({ months, series, totalSeriesKey, activeIndex, onActiveIndexChange }: TrendChartProps) {
  const maxRate = Math.max(1, ...series.flatMap((s) => s.points.map((p) => p.rate)))
  const scaleMax = maxRate * 1.15

  let nonTotalIndex = 0
  const seriesPoints = series.map((s) => {
    const color = s.key === totalSeriesKey ? TOTAL_COLOR : getServiceColor(s.name, nonTotalIndex++)
    return {
      key: s.key,
      name: s.name,
      color,
      points: s.points.map((p, i) => ({ x: xForIndex(i, months.length), y: yForValue(p.rate, scaleMax) })),
    }
  })

  const totalSeries = seriesPoints.find((s) => s.key === totalSeriesKey) ?? seriesPoints[0]
  const totalPoints = totalSeries?.points ?? []
  const activePoint = totalPoints[activeIndex]
  const activeRate = series.find((s) => s.key === totalSeriesKey)?.points[activeIndex]?.rate ?? 0

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * CHART_WIDTH
    let nearest = 0
    let nearestDist = Infinity
    for (let i = 0; i < months.length; i++) {
      const dist = Math.abs(xForIndex(i, months.length) - relX)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    }
    onActiveIndexChange(nearest)
  }

  if (totalPoints.length === 0) return null

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex min-w-0 flex-col gap-4">
        <h3 className="truncate text-subtitle-2 font-semibold text-gray-200">6개월 등록 추이</h3>
        <div className="flex min-w-0 items-center gap-6">
          {seriesPoints.map(({ key, name, color }) => {
            const isTotal = key === totalSeriesKey
            return (
              <div key={key} className="flex min-w-0 shrink items-center gap-3.5">
                <span className="h-[9px] w-5 shrink-0" style={{ backgroundColor: color, opacity: isTotal ? 1 : 0.3 }} />
                <span className={`truncate text-caption-3 ${isTotal ? 'font-medium text-white' : 'text-gray-500'}`}>{name}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative p-2">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full cursor-crosshair"
          onMouseMove={handleMove}
          onMouseLeave={() => onActiveIndexChange(months.length - 1)}
        >
          <defs>
            <linearGradient id="trendAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* crosshair */}
          <line
            x1={xForIndex(activeIndex, months.length)}
            x2={xForIndex(activeIndex, months.length)}
            y1={PADDING_TOP}
            y2={CHART_HEIGHT - PADDING_BOTTOM}
            stroke="var(--color-gray-700)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* area under total line */}
          <path
            d={`${buildLinePath(totalPoints)} L ${totalPoints[totalPoints.length - 1].x},${CHART_HEIGHT - PADDING_BOTTOM} L ${totalPoints[0].x},${CHART_HEIGHT - PADDING_BOTTOM} Z`}
            fill="url(#trendAreaFill)"
          />

          {seriesPoints.map(({ key, points, color }) => (
            <path
              key={key}
              d={buildLinePath(points)}
              fill="none"
              stroke={color}
              strokeWidth={key === totalSeriesKey ? 3 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* hover dots on every series at the active month */}
          {seriesPoints.map(({ key, points, color }) => (
            <circle key={key} cx={points[activeIndex]?.x} cy={points[activeIndex]?.y} r={key === totalSeriesKey ? 5 : 3} fill={color} />
          ))}
        </svg>

        {/* tooltip bubble for the total series */}
        {activePoint && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-gray-700 px-3 py-1.5 text-caption-2 font-medium text-gray-100 shadow-lg"
            style={{
              left: `${(activePoint.x / CHART_WIDTH) * 100}%`,
              top: `${(activePoint.y / CHART_HEIGHT) * 100}%`,
              marginTop: -10,
            }}
          >
            {activeRate}%
          </div>
        )}

        <div className="flex px-1" style={{ paddingLeft: PADDING_X, paddingRight: PADDING_X }}>
          {months.map((label, i) => (
            <button
              key={label}
              type="button"
              onMouseEnter={() => onActiveIndexChange(i)}
              className={`flex-1 text-center text-caption-3 ${i === activeIndex ? 'text-gray-100' : 'text-gray-500'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
