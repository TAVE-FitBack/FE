import { useState } from 'react'
import { getCurrentUser } from '../../api/token'
import { setupStore } from '../../api/store'
import { ApiError } from '../../api/client'
import { WelcomeStep } from './steps/WelcomeStep'
import { RoleSelectStep } from './steps/RoleSelectStep'
import { BasicInfoStep, type BasicInfo } from './steps/BasicInfoStep'
import { OperationInfoStep, type OperationInfo, type OperationInfoSubmission } from './steps/OperationInfoStep'
import { EventsStep } from './steps/EventsStep'
import { CompleteStep } from './steps/CompleteStep'

interface StoreSetupFlowProps {
  onComplete: (storeId: string) => void
}

type Step = 'welcome' | 'role' | 'basicInfo' | 'operationInfo' | 'events' | 'complete'

const EMPTY_BASIC_INFO: BasicInfo = { name: '', region: '', phone: '', businessNumber: '' }
const EMPTY_OPERATION_INFO: OperationInfo = { storeType: undefined, services: [], inflowPaths: [] }

export function StoreSetupFlow({ onComplete }: StoreSetupFlowProps) {
  const nickname = getCurrentUser()?.nickname ?? ''
  const [step, setStep] = useState<Step>('welcome')
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(EMPTY_BASIC_INFO)
  const [operationInfo, setOperationInfo] = useState<OperationInfo>(EMPTY_OPERATION_INFO)
  const [storeId, setStoreId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  if (step === 'welcome') {
    return <WelcomeStep nickname={nickname} onNext={() => setStep('role')} />
  }

  if (step === 'role') {
    return (
      <RoleSelectStep
        nickname={nickname}
        onBack={() => setStep('welcome')}
        onNext={() => setStep('basicInfo')}
        onSkip={() => onComplete('')}
      />
    )
  }

  if (step === 'basicInfo') {
    return (
      <BasicInfoStep
        nickname={nickname}
        initial={basicInfo}
        onBack={() => setStep('role')}
        onNext={(info) => {
          setBasicInfo(info)
          setStep('operationInfo')
        }}
      />
    )
  }

  async function handleOperationInfoNext(info: OperationInfoSubmission) {
    setOperationInfo(info)
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await setupStore({
        name: basicInfo.name,
        storeType: info.storeType,
        phone: basicInfo.phone || undefined,
        businessNumber: basicInfo.businessNumber || undefined,
        address: basicInfo.region || undefined,
      })
      setStoreId(res.storeId)
      setStep('events')
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : '매장 설정에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'operationInfo') {
    return (
      <OperationInfoStep
        nickname={nickname}
        initial={operationInfo}
        submitting={submitting}
        submitError={submitError}
        onBack={() => setStep('basicInfo')}
        onNext={handleOperationInfoNext}
      />
    )
  }

  if (step === 'events') {
    return (
      <EventsStep
        nickname={nickname}
        services={operationInfo.services}
        onBack={() => setStep('operationInfo')}
        onNext={() => setStep('complete')}
      />
    )
  }

  return <CompleteStep onEnter={() => onComplete(storeId)} />
}
