import { PublicClientApplication } from '@azure/msal-browser'
import type { Configuration } from '@azure/msal-browser'

import { env, publicAppUrl } from '@/env'

const msalRedirectUri = publicAppUrl.replace(/\/$/, '')

export const msalConfig: Configuration = {
  auth: {
    clientId: env.NEXT_PUBLIC_MSAL_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${env.NEXT_PUBLIC_MSAL_TENANT_ID}`,
    redirectUri: msalRedirectUri,
  },
}

/** Singleton MSAL browser client (must call `initialize()` before use). */
export const msalInstance = new PublicClientApplication(msalConfig)
