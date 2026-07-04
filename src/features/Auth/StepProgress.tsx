interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const percent = (currentStep / totalSteps) * 100

  return (
    <div className="relative h-[3px] w-full shrink-0 rounded-full bg-gray-900">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-lime transition-[width] duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
