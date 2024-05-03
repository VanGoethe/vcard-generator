import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const updateBodySchema = z.object({
  id: z.string(),
  fullname: z
    .string()
    .transform((name) => name.toLowerCase().replace(/\//g, '')),
  jobtitle: z.string(),
  email: z.string().email(),
  linkedin: z
    .string()
    .regex(/^([a-z\d\-]+)$/i)
    .transform((linkedin) => linkedin.toLowerCase().replace(/\//g, '')),
  skype: z
    .string()
    .regex(/^([a-z\d\-]+)$/i)
    .transform((skype) => skype.toLowerCase().replace(/\//g, '')),
  timezone: z.string(),
  phoneNumber: z.string(),
  imageUrl: z.string().nullable(),
  cardBackgroundColor: z
    .string()
    .transform((cardBackgroundColor) => cardBackgroundColor.toUpperCase()),
  cardTextColor: z
    .string()
    .transform((cardTextColor) => cardTextColor.toUpperCase()),
})

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'PUT') {
    return response.status(405).end()
  }

  const updateBody = updateBodySchema.safeParse(request.body)

  if (updateBody.success === false) {
    return response.status(409).json(updateBody.error.format())
  }

  const {
    data: {
      id,
      fullname,
      email,
      jobtitle,
      linkedin,
      skype,
      timezone,
      phoneNumber,
      imageUrl,
      cardBackgroundColor,
      cardTextColor,
    },
  } = updateBody

  const userExists = await prisma.user.findUnique({
    where: {
      id,
    },
  })

  if (!userExists) {
    return response.status(404).json({ message: 'User not found.' })
  }

  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      jobtitle,
      email,
      linkedin,
      fullname,
      timezone,
      phoneNumber,
      skype,
      image_url: imageUrl,
      card_background_color: cardBackgroundColor,
      card_text_color: cardTextColor,
    },
  })

  return response.status(200).json(user)
}
