export interface ConversionRate {
  key: string
  label: string
  percent: number
  color: 'coral' | 'lime' | 'blue'
}

interface ConversionRateCardProps {
  rates: ConversionRate[]
}

const BAR_GRADIENT: Record<ConversionRate['color'], string> = {
  coral: 'bg-gradient-to-r from-coral-light to-coral',
  lime: 'bg-gradient-to-r from-lime-light to-lime',
  blue: 'bg-gradient-to-l from-blue to-blue-light',
}

export function ConversionRateCard({ rates }: ConversionRateCardProps) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-[28px] border border-gray-700 bg-gray-800 p-6">
      <h3 className="text-body-2 text-gray-200">종목별 등록 전환율</h3>
      <div className="flex flex-col gap-[38px]">
        {rates.map(({ key, label, percent, color }) => (
          <div key={key} className="relative h-9 w-full overflow-hidden rounded-full bg-black/30">
            <div
              className={`flex h-full items-center justify-between rounded-full px-5 text-white ${BAR_GRADIENT[color]}`}
              style={{ width: `${percent}%` }}
            >
              <span className="text-caption-2 font-bold">{label}</span>
              <span className="text-button-1 font-semibold">{percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
