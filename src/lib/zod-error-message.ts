/**
 * Extracts the first error string from a Zod `.format()` JSON body.
 */
export function firstZodErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null
  }

  const walk = (obj: unknown): string | null => {
    if (!obj || typeof obj !== 'object') {
      return null
    }
    const rec = obj as Record<string, unknown>
    const errs = rec._errors
    if (Array.isArray(errs) && errs.length > 0) {
      const e = errs[0]
      return typeof e === 'string' ? e : null
    }
    for (const v of Object.values(rec)) {
      if (v && typeof v === 'object' && !Array.isArray(v)) {
        const found = walk(v)
        if (found) {
          return found
        }
      }
    }
    return null
  }

  return walk(data)
}
