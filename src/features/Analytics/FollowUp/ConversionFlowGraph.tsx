import type { ConversionRoundStat } from '../../../api/analysisReport'

export interface ConversionFlowGraphProps {
  /** 후속관리 거치지 않고 상담 직후 바로 등록된 인원(즉시등록) — conversionGraph.unattributedRegisteredCount */
  immediateRegistered: number
  /** 상담 후 등록보류 → 후속관리 진입 인원 — conversionGraph.initialNonRegisteredCount */
  pendingTotal: number
  rounds: ConversionRoundStat[]
  /** 최종 미등록/이탈 — conversionGraph.nonRegisteredOrLostCount */
  finalNonRegistered: number
  /** 후속관리를 통해 최종 등록된 인원(즉시등록은 제외됨) — conversionGraph.finalRegisteredCount */
  finalRegisteredTotal: number
}

const ROUND_COL_WIDTH = 132
const ROUND_START_X = 270
const BOX_W = 123
const SATELLITE_W = 116
const COMPACT_H = 39
const COMPACT_Y = 8

function RoundGroupBox({
  title,
  inProgress,
  completed,
  style,
}: {
  title: string
  inProgress: number
  completed: number
  style: React.CSSProperties
}) {
  return (
    <div className="absolute flex w-[123px] flex-col justify-end gap-[5px]" style={style}>
      <div className="absolute top-0 flex h-full w-full flex-col items-center gap-[11px] rounded-[14px] bg-gray-800 px-3.5 pt-2">
        <div className="flex items-center gap-2.5 whitespace-nowrap text-caption-1 text-white">
          <span>{title}</span>
          <span> 총 {inProgress + completed}건</span>
        </div>
      </div>
      <div className="relative flex h-[55px] shrink-0 flex-col justify-center rounded-xl bg-gray-700 px-3.5 py-4">
        <div className="flex items-center gap-3 whitespace-nowrap text-caption-3">
          <span className="text-gray-400">진행 중</span>
          <span className="text-lime-light">{inProgress}건</span>
        </div>
      </div>
      <div className="relative flex h-[55px] shrink-0 flex-col justify-center rounded-xl bg-gray-700 px-3.5 py-4">
        <div className="flex items-center gap-3 whitespace-nowrap text-caption-3">
          <span className="text-gray-400">진행 완료</span>
          <span className="text-lime">{completed}건</span>
        </div>
      </div>
    </div>
  )
}

/** Figma node 978:9586과 동일한 디자인 — 보더가 있는 컴팩트 단일행 박스 */
function SingleBox({
  label,
  value,
  valueColor,
  bordered,
  style,
}: {
  label: string
  value: string
  valueColor: string
  bordered?: boolean
  style: React.CSSProperties
}) {
  return (
    <div
      className={`absolute flex flex-col justify-center rounded-xl px-3.5 py-4 ${bordered ? 'border border-gray-600 bg-gray-800' : 'bg-gray-700'}`}
      style={style}
    >
      <div className="flex items-center gap-3 whitespace-nowrap text-caption-3">
        <span className="text-white">{label}</span>
        <span className={valueColor}>{value}</span>
      </div>
    </div>
  )
}

function FinalBox({ registeredTotal, conversionRate, style }: { registeredTotal: number; conversionRate: number; style: React.CSSProperties }) {
  return (
    <div className="absolute flex flex-col justify-center gap-2.5 rounded-xl border border-gray-600 bg-gray-800 px-3.5 py-5" style={style}>
      <div className="flex items-center gap-3 whitespace-nowrap text-caption-3">
        <span className="text-white">최종 등록</span>
        <span className="text-blue">{registeredTotal}건</span>
      </div>
      <div className="flex items-center gap-3 whitespace-nowrap text-caption-3">
        <span className="text-white">전체 전환율</span>
        <span className="text-blue">{conversionRate}%</span>
      </div>
    </div>
  )
}

/** 두 박스 사이를 직각 꺾은선(엘보 커넥터)으로 잇는 화살표 — Figma의 곡선 커넥터 이미지 대신 근사치로 그림 */
function Connector({ points }: { points: [number, number][] }) {
  const d = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ')
  const [lastX, lastY] = points[points.length - 1]
  const [prevX, prevY] = points[points.length - 2] ?? points[0]
  const angle = Math.atan2(lastY - prevY, lastX - prevX)
  const arrowSize = 5
  const a1 = angle + Math.PI - 0.4
  const a2 = angle + Math.PI + 0.4
  return (
    <>
      <path d={d} fill="none" stroke="var(--color-gray-600)" strokeWidth="1.5" />
      <path
        d={`M ${lastX},${lastY} L ${lastX + arrowSize * Math.cos(a1)},${lastY + arrowSize * Math.sin(a1)} M ${lastX},${lastY} L ${lastX + arrowSize * Math.cos(a2)},${lastY + arrowSize * Math.sin(a2)}`}
        fill="none"
        stroke="var(--color-gray-600)"
        strokeWidth="1.5"
      />
    </>
  )
}

export function ConversionFlowGraph({
  immediateRegistered,
  pendingTotal,
  rounds,
  finalNonRegistered,
  finalRegisteredTotal,
}: ConversionFlowGraphProps) {
  const consultationTotal = immediateRegistered + pendingTotal
  const conversionPool = finalRegisteredTotal + finalNonRegistered
  const overallConversionRate = conversionPool > 0 ? Math.round((finalRegisteredTotal / conversionPool) * 100) : 0

  const immediateX = 8 + BOX_W + 9
  const satelliteX = ROUND_START_X + rounds.length * ROUND_COL_WIDTH
  const finalX = satelliteX
  const canvasWidth = finalX + SATELLITE_W + 8
  const compactMidY = COMPACT_Y + COMPACT_H / 2

  return (
    <div
      className="flex h-full min-w-0 flex-col gap-6 rounded-[30px] border border-gray-700 px-7 py-5"
      style={{ backgroundImage: 'linear-gradient(35deg, var(--color-gray-800) 38%, var(--color-gray-900) 125%)' }}
    >
      <h3 className="truncate text-body-2 text-gray-300">미등록자 후속관리 후 전환 그래프</h3>

      <div className="scrollbar-thin relative w-full overflow-x-auto">
        <div className="relative h-[348px]" style={{ width: canvasWidth }}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${canvasWidth} 348`}>
            {/* 대면상담 -> 등록성사(즉시) */}
            <Connector points={[[8 + BOX_W, compactMidY], [immediateX, compactMidY]]} />
            {/* 대면상담 -> 등록보류 */}
            <Connector
              points={[
                [8 + BOX_W / 2, COMPACT_Y + COMPACT_H],
                [8 + BOX_W / 2, 320],
                [90, 320],
              ]}
            />
            {/* 등록보류 -> 1차관리 */}
            <Connector points={[[206, 320], [ROUND_START_X, 320]]} />

            {rounds.map((_, i) => {
              const x = ROUND_START_X + i * ROUND_COL_WIDTH
              const satX = ROUND_START_X + (i + 1) * ROUND_COL_WIDTH
              const isLast = i === rounds.length - 1
              const satY = isLast ? 229 : 143
              return (
                <g key={i}>
                  {/* 이 차수 진행완료 -> 등록성사(이 차수) satellite (위쪽) */}
                  <Connector
                    points={[
                      [x + BOX_W, 316],
                      [x + BOX_W + 5, 316],
                      [x + BOX_W + 5, satY],
                      [satX, satY],
                    ]}
                  />
                  {/* 이 차수 진행완료 -> 다음 차수(이월), 마지막 차수는 생략 */}
                  {!isLast && <Connector points={[[x + BOX_W, 300], [satX, 300]]} />}
                </g>
              )
            })}

            {/* 마지막 차수 등록성사 -> 최종등록 (같은 열, 위로) */}
            <Connector
              points={[
                [satelliteX + SATELLITE_W - 20, 229],
                [satelliteX + SATELLITE_W - 20, 100],
                [finalX, 100],
              ]}
            />
          </svg>

          <SingleBox
            label="대면상담"
            value={`총 ${consultationTotal}건`}
            valueColor="text-white"
            bordered
            style={{ left: 8, top: COMPACT_Y, width: BOX_W, height: COMPACT_H }}
          />
          <SingleBox
            label="등록성사"
            value={`${immediateRegistered}건`}
            valueColor="text-blue"
            bordered
            style={{ left: immediateX, top: COMPACT_Y, width: BOX_W, height: COMPACT_H }}
          />
          <SingleBox
            label="등록보류"
            value={`${pendingTotal}건`}
            valueColor="text-coral"
            style={{ left: 90, top: 293, width: 116, height: 55 }}
          />

          {rounds.map((round, i) => (
            <RoundGroupBox
              key={round.contactRound}
              title={`${round.contactRound}차관리`}
              inProgress={round.pendingCount}
              completed={round.sentCount}
              style={{ left: ROUND_START_X + i * ROUND_COL_WIDTH, top: 180, height: 168 }}
            />
          ))}
          {rounds.map((round, i) => (
            <SingleBox
              key={`reg-${round.contactRound}`}
              label="등록성사"
              value={`${round.registeredCount}건`}
              valueColor="text-blue"
              bordered={i < rounds.length - 1}
              style={{
                left: ROUND_START_X + (i + 1) * ROUND_COL_WIDTH,
                top: i < rounds.length - 1 ? 124 : 210,
                width: SATELLITE_W,
                height: 39,
              }}
            />
          ))}

          <SingleBox
            label="미등록"
            value={`${finalNonRegistered}건`}
            valueColor="text-coral"
            style={{ left: satelliteX, top: 293, width: SATELLITE_W, height: 55 }}
          />
          <FinalBox registeredTotal={finalRegisteredTotal} conversionRate={overallConversionRate} style={{ left: finalX, top: 49, width: SATELLITE_W, height: 114 }} />
        </div>
      </div>
    </div>
  )
}
