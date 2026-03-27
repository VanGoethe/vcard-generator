import { NextApiRequest, NextApiResponse } from 'next'

import { findUserByEmail } from '@/lib/prisma/utils/find-user-by-email'

/** Align with graphEmailToLocalPart: local part only, lowercased. */
function normalizeLocalEmailPart(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) {
    return null
  }
  const at = trimmed.indexOf('@')
  const local = at === -1 ? trimmed : trimmed.slice(0, at)
  const normalized = local.toLowerCase()
  return normalized || null
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).end()
  }

  const raw = request.query.email
  const segment = Array.isArray(raw) ? raw[0] : raw

  if (!segment || typeof segment !== 'string') {
    return response
      .status(400)
      .json({ message: 'Missing email query parameter.' })
  }

  let email: string
  try {
    const decoded = decodeURIComponent(segment)
    const normalized = normalizeLocalEmailPart(decoded)
    if (!normalized) {
      return response.status(400).json({ message: 'Invalid email.' })
    }
    email = normalized
  } catch {
    return response.status(400).json({ message: 'Invalid email.' })
  }

  const user = await findUserByEmail(email)

  return response.status(200).json({ exists: Boolean(user) })
}
