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

const BOX_W = 124
const GAP_W = 30
const COL_W = BOX_W + GAP_W
const MAIN_TOP = 8
const HEADER_H = 40
const ROW_H = 55
const ROW_GAP = 5
const GROUP_BOTTOM = MAIN_TOP + HEADER_H + ROW_H + ROW_GAP + ROW_H + 9
const SINGLE_TOP = MAIN_TOP + HEADER_H
const STAIR_STEP = 37
const FINAL_HEIGHT = 168

function stairTop(i: number) {
  return GROUP_BOTTOM + Math.max(126 - i * STAIR_STEP, 20)
}

interface Row {
  label: string
  value: string
  valueColor: string
}

/** 헤더(제목 + 총건수) + N개의 내용 행으로 이루어진 박스 — 상담/n차 관리/최종등록 박스에 공용으로 사용 */
function GroupBox({
  title,
  total,
  rows,
  style,
  borderColor,
}: {
  title: string
  total: number
  rows: Row[]
  style: React.CSSProperties
  borderColor?: string
}) {
  return (
    <div
      className={`absolute flex w-[132px] flex-col gap-[5px] rounded-[14px] bg-gray-800 px-3.5 pt-2 pb-2 ${borderColor ?? ''}`}
      style={style}
    >
      <div className="flex items-center gap-1 whitespace-nowrap text-caption-1 text-white">
        <span>{title}</span>
        <span> 총 {total}건</span>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex h-[55px] shrink-0 flex-col justify-center rounded-xl bg-gray-700 px-3.5 py-4"
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap text-caption-3">
            <span className="text-gray-400">{row.label}</span>
            <span className={row.valueColor}>{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

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
      <div className="flex items-center gap-1.5 whitespace-nowrap text-caption-3">
        <span className="text-white">{label}</span>
        <span className={valueColor}>{value}</span>
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
  const overallConversionRate =
    conversionPool > 0 ? Math.round((finalRegisteredTotal / conversionPool) * 100) : 0

  const consultationX = 0
  const pendingX = COL_W
  const roundX = (i: number) => COL_W * (2 + i)
  const nonRegX = COL_W * (2 + rounds.length)
  const finalX = nonRegX

  const mainMidY = MAIN_TOP + HEADER_H + ROW_H / 2
  const stairMidY = (i: number) => stairTop(i) + ROW_H / 2
  const finalTop = stairTop(rounds.length - 1) - 13
  const finalMidY = finalTop + FINAL_HEIGHT / 2

  const canvasWidth = finalX + BOX_W + 8
  const canvasHeight = Math.max(GROUP_BOTTOM, finalTop + FINAL_HEIGHT) + 8

  return (
    <div
      className="flex h-full min-w-0 flex-col gap-6 rounded-[30px] border border-gray-700 px-7 py-5"
      style={{
        backgroundImage:
          'linear-gradient(35deg, var(--color-gray-800) 38%, var(--color-gray-900) 125%)',
      }}
    >
      <h3 className="truncate text-body-2 text-gray-300">미등록자 후속관리 후 전환 그래프</h3>

      <div className="scrollbar-thin relative w-full overflow-x-auto">
        <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          >
            {/* 상담 -> 등록보류 -> 1차관리 -> ... -> 마지막관리 -> 미등록 (한 줄 체인) */}
            <Connector
              points={[
                [consultationX + BOX_W, mainMidY],
                [pendingX, mainMidY],
              ]}
            />
            <Connector
              points={[
                [pendingX + BOX_W, mainMidY],
                [roundX(0), mainMidY],
              ]}
            />
            {rounds.slice(0, -1).map((_, i) => (
              <Connector
                key={`chain-${i}`}
                points={[
                  [roundX(i) + BOX_W, mainMidY],
                  [roundX(i + 1), mainMidY],
                ]}
              />
            ))}
            <Connector
              points={[
                [roundX(rounds.length - 1) + BOX_W, mainMidY],
                [nonRegX, mainMidY],
              ]}
            />

            {rounds.map((_, i) => (
              <g key={`stair-${i}`}>
                {/* n차 관리 -> n차 등록전환 (박스 바로 아래로) */}
                <Connector
                  points={[
                    [roundX(i) + BOX_W / 2, GROUP_BOTTOM],
                    [roundX(i) + BOX_W / 2, stairTop(i)],
                  ]}
                />
                {/* n차 등록전환 -> (n+1)차 등록전환 / 최종등록 (계단식 이월) */}
                {i < rounds.length - 1 ? (
                  <Connector
                    points={[
                      [roundX(i) + BOX_W, stairMidY(i)],
                      [roundX(i) + BOX_W + GAP_W / 2, stairMidY(i)],
                      [roundX(i) + BOX_W + GAP_W / 2, stairMidY(i + 1)],
                      [roundX(i + 1), stairMidY(i + 1)],
                    ]}
                  />
                ) : (
                  <Connector
                    points={[
                      [roundX(i) + BOX_W, stairMidY(i)],
                      [roundX(i) + BOX_W + GAP_W / 2, stairMidY(i)],
                      [roundX(i) + BOX_W + GAP_W / 2, finalMidY],
                      [finalX, finalMidY],
                    ]}
                  />
                )}
              </g>
            ))}
          </svg>

          <SingleBox
            label="상담"
            value={`${consultationTotal}건`}
            valueColor="text-lime"
            style={{ left: consultationX, top: SINGLE_TOP, width: BOX_W, height: ROW_H }}
          />
          <SingleBox
            label="등록보류"
            value={`${pendingTotal}건`}
            valueColor="text-coral"
            style={{ left: pendingX, top: SINGLE_TOP, width: BOX_W, height: ROW_H }}
          />

          {rounds.map((round, i) => (
            <GroupBox
              key={round.contactRound}
              title={`${round.contactRound}차 관리`}
              total={round.pendingCount + round.sentCount}
              rows={[
                {
                  label: '진행중',
                  value: `${round.pendingCount}건`,
                  valueColor: 'text-lime-light',
                },
                { label: '진행완료', value: `${round.sentCount}건`, valueColor: 'text-lime' },
              ]}
              style={{ left: roundX(i), top: MAIN_TOP }}
            />
          ))}

          <SingleBox
            label="미등록"
            value={`${finalNonRegistered}건`}
            valueColor="text-coral"
            style={{ left: nonRegX, top: SINGLE_TOP, width: BOX_W, height: ROW_H }}
          />

          {rounds.map((round, i) => (
            <SingleBox
              key={`stairbox-${round.contactRound}`}
              label={`${round.contactRound}차 등록전환`}
              value={`${round.registeredCount}건`}
              valueColor="text-blue"
              bordered
              style={{ left: roundX(i), top: stairTop(i), width: BOX_W, height: ROW_H }}
            />
          ))}

          <GroupBox
            title="최종 등록"
            total={conversionPool}
            rows={[
              { label: '등록 완료', value: `${finalRegisteredTotal}건`, valueColor: 'text-blue' },
              { label: '등록률', value: `${overallConversionRate}%`, valueColor: 'text-blue' },
            ]}
            style={{ left: finalX, top: finalTop, height: FINAL_HEIGHT }}
            borderColor="border border-lime"
          />
        </div>
      </div>
    </div>
  )
}
