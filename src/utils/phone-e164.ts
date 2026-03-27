import parsePhoneNumberFromString from 'libphonenumber-js'
import type { CountryCode } from 'libphonenumber-js'

import { guessDefaultCountry } from './default-phone-country'

/**
 * Parses national or international phone text to E.164 when possible.
 * Uses default country for national numbers; full international (+…) parses without it.
 */
export function normalizePhoneToE164(
  raw: string,
  defaultCountry: CountryCode = guessDefaultCountry(),
): string | undefined {
  const trimmed = raw.trim()
  if (!trimmed) {
    return undefined
  }

  try {
    const parsed = parsePhoneNumberFromString(trimmed, defaultCountry)
    if (parsed?.isValid()) {
      return parsed.number
    }
  } catch {
    /* ignore */
  }

  try {
    const parsed = parsePhoneNumberFromString(trimmed)
    if (parsed?.isValid()) {
      return parsed.number
    }
  } catch {
    /* ignore */
  }

  return undefined
}
