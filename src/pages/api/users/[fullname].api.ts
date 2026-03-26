import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

function normalizeFullname(value: string) {
  return value.toLowerCase().replace(/\//g, '')
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).end()
  }

  const raw = request.query.fullname
  const segment = Array.isArray(raw) ? raw[0] : raw

  if (!segment || typeof segment !== 'string') {
    return response.status(400).json({ message: 'Resource not found.' })
  }

  let fullname: string
  try {
    fullname = normalizeFullname(decodeURIComponent(segment))
  } catch {
    return response.status(400).json({ message: 'Resource not found.' })
  }

  if (!fullname.trim()) {
    return response.status(400).json({ message: 'Resource not found.' })
  }

  const user = await prisma.user.findFirst({
    where: {
      fullname,
    },
  })

  if (user) {
    return response.status(409).json({ message: 'fullname already exists.' })
  }

  return response.status(200).end()
}
