import { useEffect, useState } from 'react'
import { useMsal, useAccount } from '@azure/msal-react'

const GRAPH_ME = 'https://graph.microsoft.com/v1.0/me'
const SESSION_CACHE_KEY = '@msProfile'

export type MicrosoftGraphProfile = {
  displayName?: string | null
  jobTitle?: string | null
  mail?: string | null
  userPrincipalName?: string | null
  mobilePhone?: string | null
  businessPhones?: string[] | null
}

function parseGraphMe(json: unknown): MicrosoftGraphProfile {
  if (!json || typeof json !== 'object') {
    return {}
  }
  const o = json as Record<string, unknown>
  return {
    displayName: typeof o.displayName === 'string' ? o.displayName : null,
    jobTitle: typeof o.jobTitle === 'string' ? o.jobTitle : null,
    mail: typeof o.mail === 'string' ? o.mail : null,
    userPrincipalName:
      typeof o.userPrincipalName === 'string' ? o.userPrincipalName : null,
    mobilePhone: typeof o.mobilePhone === 'string' ? o.mobilePhone : null,
    businessPhones: Array.isArray(o.businessPhones)
      ? (o.businessPhones as string[])
      : null,
  }
}

/** Local part for the visit-card email field (no @, immap.org suffix added in UI). */
export function graphEmailToLocalPart(profile: MicrosoftGraphProfile): string {
  const raw = (profile.mail || profile.userPrincipalName || '').trim()
  if (!raw) {
    return ''
  }
  const at = raw.indexOf('@')
  if (at === -1) {
    return raw.toLowerCase()
  }
  return raw.slice(0, at).toLowerCase()
}

export function graphPhoneForForm(profile: MicrosoftGraphProfile): string {
  const mobile = profile.mobilePhone?.trim()
  if (mobile) {
    return mobile
  }
  const firstBusiness = profile.businessPhones?.[0]?.trim()
  return firstBusiness || ''
}

export function useMicrosoftProfile(enabled: boolean) {
  const { instance, accounts } = useMsal()
  const account = useAccount(accounts[0] || {})
  const [profile, setProfile] = useState<MicrosoftGraphProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setProfile(null)
      setError(null)
      return
    }

    if (!account) {
      setLoading(false)
      setProfile(null)
      setError(null)
      return
    }

    const cached = sessionStorage.getItem(SESSION_CACHE_KEY)
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as MicrosoftGraphProfile
        setProfile(parsed)
        setLoading(false)
        setError(null)
        return
      } catch {
        sessionStorage.removeItem(SESSION_CACHE_KEY)
      }
    }

    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)

      try {
        const tokenResponse = await instance.acquireTokenSilent({
          scopes: ['User.Read'],
          account,
        })

        const res = await fetch(GRAPH_ME, {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        })

        if (!res.ok) {
          throw new Error(`Microsoft Graph error: ${res.status}`)
        }

        const json: unknown = await res.json()
        const next = parseGraphMe(json)

        if (!cancelled) {
          sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(next))
          setProfile(next)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e : new Error('Profile load failed'))
          setProfile(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [enabled, account, instance])

  return { profile, loading, error }
}
