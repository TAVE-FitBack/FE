import type { AiRecommendation } from '../../../api/analysisReport'

interface AiRecommendationsCardProps {
  items: AiRecommendation[]
}

export function AiRecommendationsCard({ items }: AiRecommendationsCardProps) {
  return (
    <div
      className="flex h-full min-w-0 flex-col gap-4 rounded-[30px] border border-gray-700 px-7 py-5"
      style={{ backgroundImage: 'linear-gradient(50deg, var(--color-gray-800) 38%, var(--color-gray-900) 125%)' }}
    >
      <h3 className="truncate border-b border-gray-700 pb-3 text-body-2 font-medium text-gray-300">AI 개선사항 제안</h3>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-lime" />
            <div className="flex flex-col gap-0.5">
              <span className="text-body-3 font-medium text-gray-200">{item.title}</span>
              {item.description && <span className="text-caption-3 text-gray-500">{item.description}</span>}
            </div>
          </li>
        ))}
        {items.length === 0 && <p className="text-caption-3 text-gray-500">AI 개선사항 제안이 없습니다.</p>}
      </ul>
    </div>
  )
}
