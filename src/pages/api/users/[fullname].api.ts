import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).end()
  }

  const fullname = String(request.query.fullname)

  if (!fullname) {
    return response.status(400).json({ message: 'Resource not found.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      fullname,
    },
  })

  if (user) {
    return response.status(409).json({ message: 'User already exists.' })
  }

  return response.status(200).end()
}
