import React, { useEffect, useState } from 'react'
import { MsalProvider } from '@azure/msal-react'

import { msalInstance } from '@/lib/msalClient'

type Props = {
  children: React.ReactNode
}

/**
 * MSAL Browser 3.x requires `initialize()` and redirect responses should be
 * handled via `handleRedirectPromise()` before the app uses accounts.
 */
export function MsalProviderWrapper({ children }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    msalInstance
      .initialize()
      .then(() => msalInstance.handleRedirectPromise())
      .then(() => {
        if (!cancelled) {
          setReady(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return (
      <div className="bg-zinc-900 flex min-h-screen w-full items-center justify-center text-gray-200">
        Loading...
      </div>
    )
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}
