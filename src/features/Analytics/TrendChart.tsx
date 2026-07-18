import { useState } from 'react'
import { MONTH_LABELS, SERIES_COLOR, SERIES_LABEL, TREND_DATA, type SeriesKey } from './data'

const SERIES_ORDER: SeriesKey[] = ['total', 'pt', 'gym', 'spinning']

const CHART_WIDTH = 480
const CHART_HEIGHT = 240
const PADDING_X = 12
const PADDING_TOP = 16
const PADDING_BOTTOM = 16

function xForIndex(i: number, count: number): number {
  const usableWidth = CHART_WIDTH - PADDING_X * 2
  return PADDING_X + (usableWidth * i) / (count - 1)
}

function yForValue(value: number): number {
  const usableHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM
  return PADDING_TOP + usableHeight * (1 - value / 100)
}

/** Catmull-Rom -> cubic Bezier smoothing so the trend reads as a curve, not a jagged polyline. */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return ''
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`
  }
  return d
}

export function TrendChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const activeIndex = hoveredIndex ?? MONTH_LABELS.length - 1

  const seriesPoints = SERIES_ORDER.map((key) => ({
    key,
    points: TREND_DATA[key].map((v, i) => ({ x: xForIndex(i, MONTH_LABELS.length), y: yForValue(v) })),
  }))

  const totalPoints = seriesPoints.find((s) => s.key === 'total')!.points
  const activePoint = totalPoints[activeIndex]

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = ((e.clientX - rect.left) / rect.width) * CHART_WIDTH
    let nearest = 0
    let nearestDist = Infinity
    for (let i = 0; i < MONTH_LABELS.length; i++) {
      const dist = Math.abs(xForIndex(i, MONTH_LABELS.length) - relX)
      if (dist < nearestDist) {
        nearestDist = dist
        nearest = i
      }
    }
    setHoveredIndex(nearest)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h3 className="text-subtitle-2 font-semibold text-gray-200">6개월 등록 추이</h3>
        <div className="flex items-center gap-6">
          {SERIES_ORDER.map((key) => (
            <div key={key} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SERIES_COLOR[key] }} />
              <span className="text-caption-3 text-gray-300">{SERIES_LABEL[key]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative rounded-2xl bg-black/20 p-2">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full cursor-crosshair"
          onMouseMove={handleMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="trendAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-lime)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--color-lime)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* crosshair */}
          <line
            x1={xForIndex(activeIndex, MONTH_LABELS.length)}
            x2={xForIndex(activeIndex, MONTH_LABELS.length)}
            y1={PADDING_TOP}
            y2={CHART_HEIGHT - PADDING_BOTTOM}
            stroke="var(--color-gray-700)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          {/* area under total line */}
          <path
            d={`${buildSmoothPath(totalPoints)} L ${totalPoints[totalPoints.length - 1].x},${CHART_HEIGHT - PADDING_BOTTOM} L ${totalPoints[0].x},${CHART_HEIGHT - PADDING_BOTTOM} Z`}
            fill="url(#trendAreaFill)"
          />

          {seriesPoints.map(({ key, points }) => (
            <path
              key={key}
              d={buildSmoothPath(points)}
              fill="none"
              stroke={SERIES_COLOR[key]}
              strokeWidth={key === 'total' ? 3 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* hover dots on every series at the active month */}
          {seriesPoints.map(({ key, points }) => (
            <circle key={key} cx={points[activeIndex].x} cy={points[activeIndex].y} r={key === 'total' ? 5 : 3} fill={SERIES_COLOR[key]} />
          ))}
        </svg>

        {/* tooltip bubble for the total series */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-gray-700 px-3 py-1.5 text-caption-2 font-medium text-gray-100 shadow-lg"
          style={{
            left: `${(activePoint.x / CHART_WIDTH) * 100}%`,
            top: `${(activePoint.y / CHART_HEIGHT) * 100}%`,
            marginTop: -10,
          }}
        >
          {TREND_DATA.total[activeIndex]}%
        </div>

        <div className="flex px-1" style={{ paddingLeft: PADDING_X, paddingRight: PADDING_X }}>
          {MONTH_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              onMouseEnter={() => setHoveredIndex(i)}
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
