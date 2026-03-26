import { useState } from 'react'

import type { MicrosoftGraphProfile } from '@/hooks/useMicrosoftProfile'

import { CustomStep } from './CustomStep'
import { DescribeStep } from './DescribeStep'
import { ContactsStep } from './ContactsStep'

type GenerateCardFormProps = {
  microsoftProfile?: MicrosoftGraphProfile | null
}

export function GenerateCardForm({
  microsoftProfile = null,
}: GenerateCardFormProps) {
  const [navigateToStep, setNavigateToStep] = useState<
    'describeStep' | 'contactsStep' | 'customStep' | undefined
  >('describeStep')

  function handleNavigateToStep(
    step: 'describeStep' | 'contactsStep' | 'customStep',
  ) {
    setNavigateToStep(step)
  }

  return (
    <>
      {navigateToStep === 'describeStep' ? (
        <DescribeStep
          navigateTo={handleNavigateToStep}
          microsoftProfile={microsoftProfile}
        />
      ) : navigateToStep === 'contactsStep' ? (
        <ContactsStep
          navigateTo={handleNavigateToStep}
          microsoftProfile={microsoftProfile}
        />
      ) : (
        <CustomStep navigateTo={handleNavigateToStep} />
      )}
    </>
  )
}
