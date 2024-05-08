import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).end()
  }

  const email = String(request.query.email)

  if (!email) {
    return response.status(400).json({ message: 'Resource not found.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (user) {
    return response.status(409).json({ message: 'email already exists.' })
  }

  return response.status(200).end()
}
