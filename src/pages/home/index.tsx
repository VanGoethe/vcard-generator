import { useEffect, useRef, useState } from 'react'
import { GenerateCardForm } from './components/GenerateCardFom/'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'

import {
  graphEmailToLocalPart,
  useMicrosoftProfile,
} from '@/hooks/useMicrosoftProfile'

let toastShownOnce = false

function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  if (value == null) {
    return undefined
  }
  return Array.isArray(value) ? value[0] : value
}

export default function Home() {
  const route = useRouter()
  const { inProgress, accounts } = useMsal()
  const isAuthenticated = accounts.length > 0
  const msalReady = inProgress === InteractionStatus.None
  const { profile: microsoftProfile, loading: profileLoading } =
    useMicrosoftProfile(isAuthenticated)
  const redirectedRef = useRef(false)
  const replaceToCardRef = useRef(false)
  const [skipRegistrationCheck, setSkipRegistrationCheck] = useState(false)

  const editUserId = route.isReady ? firstQueryValue(route.query.id) : undefined
  const isEditFromCard = Boolean(editUserId && editUserId.length > 0)

  useEffect(() => {
    if (!msalReady) {
      return
    }

    if (!isAuthenticated && !redirectedRef.current) {
      redirectedRef.current = true
      route.push('/auth').catch(() => {})
      if (!toastShownOnce) {
        toast('Account not verified! Please verify your account first.', {
          type: 'error',
        })
        toastShownOnce = true
      }
    }
  }, [route, msalReady, isAuthenticated])

  useEffect(() => {
    if (!msalReady || !isAuthenticated || profileLoading) {
      return
    }

    if (!route.isReady) {
      return
    }

    if (isEditFromCard) {
      setSkipRegistrationCheck(true)
      return
    }

    const localPart = graphEmailToLocalPart(microsoftProfile ?? {})
    if (!localPart) {
      return
    }

    if (replaceToCardRef.current) {
      return
    }

    let cancelled = false

    fetch(`/api/users/check-email?email=${encodeURIComponent(localPart)}`)
      .then((res) => res.json())
      .then((data: { exists?: boolean }) => {
        if (cancelled) {
          return
        }
        if (data?.exists === true) {
          if (!replaceToCardRef.current) {
            replaceToCardRef.current = true
            route
              .replace(`/cards/${encodeURIComponent(localPart)}`)
              .catch(() => {
                replaceToCardRef.current = false
                setSkipRegistrationCheck(true)
              })
          }
        } else {
          setSkipRegistrationCheck(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSkipRegistrationCheck(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    msalReady,
    isAuthenticated,
    profileLoading,
    microsoftProfile,
    route,
    route.isReady,
    isEditFromCard,
  ])

  if (!msalReady || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-gray-200">
        Loading...
      </div>
    )
  }

  if (profileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-gray-200">
        Loading...
      </div>
    )
  }

  const localPart = graphEmailToLocalPart(microsoftProfile ?? {})
  const waitingForRouter =
    Boolean(localPart) && !route.isReady && !skipRegistrationCheck
  const waitingForRegistrationCheck =
    Boolean(localPart) &&
    !skipRegistrationCheck &&
    !isEditFromCard &&
    route.isReady

  if (waitingForRouter || waitingForRegistrationCheck) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-gray-200">
        Loading...
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-900">
      <GenerateCardForm microsoftProfile={microsoftProfile} />
    </div>
  )
}
