import React from 'react'
import { MsalProvider } from '@azure/msal-react'

import { msalInstance } from '@/lib/msalClient'

type Props = {
  children: React.ReactNode
}

/**
 * MsalProvider internally calls initialize() and handleRedirectPromise(),
 * transitioning inProgress from Startup → None once ready.
 * Components should check inProgress before acting on auth state.
 */
export function MsalProviderWrapper({ children }: Props) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>
}
