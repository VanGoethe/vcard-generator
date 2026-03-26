import { useEffect, useRef } from 'react'
import { GenerateCardForm } from './components/GenerateCardFom/'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { useIsAuthenticated } from '@azure/msal-react'

import { useMicrosoftProfile } from '@/hooks/useMicrosoftProfile'

let toastShownOnce = false

export default function Home() {
  const route = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const { profile: microsoftProfile } = useMicrosoftProfile(isAuthenticated)
  const redirectedRef = useRef(false)

  useEffect(() => {
    if (!route.isReady) {
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
  }, [route, route.isReady, isAuthenticated])

  // `isReady === false` while Next.js hydrates the router; `undefined` can occur
  // in tests with next-router-mock — treat as ready so we do not block forever.
  if (route.isReady === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-900 text-gray-200">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
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
