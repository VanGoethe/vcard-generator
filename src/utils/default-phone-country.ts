import { isSupportedCountry } from 'libphonenumber-js'
import type { CountryCode } from 'libphonenumber-js'

const FALLBACK: CountryCode = 'US'

/**
 * Best-effort default country from browser locale (client only).
 * Falls back to US when region is missing or unsupported.
 */
export function guessDefaultCountry(): CountryCode {
  if (typeof window === 'undefined') {
    return FALLBACK
  }

  try {
    const candidates = [
      typeof Intl !== 'undefined'
        ? Intl.DateTimeFormat().resolvedOptions().locale
        : undefined,
      navigator.language,
    ].filter((x): x is string => Boolean(x))

    for (const loc of candidates) {
      try {
        const region = new Intl.Locale(loc).region
        if (region && isSupportedCountry(region)) {
          return region
        }
      } catch {
        /* ignore invalid locale strings */
      }
    }
  } catch {
    /* ignore */
  }

  return FALLBACK
}
