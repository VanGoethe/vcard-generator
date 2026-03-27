import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

const registerBodySchema = z.object({
  fullname: z
    .string()
    .transform((name) => name.toLowerCase().replace(/\//g, '')),
  // username: z.string().regex(/^([a-z\d\-]+)$/i),
  jobtitle: z.string(),
  email: z.string().refine((email) => !/@/.test(email), {
    message: 'You dont`t need to add an prefix(@immap.org) of your email',
  }),
  linkedin: z.string().optional(),
  phoneNumber: z.string().refine((v) => isValidPhoneNumber(v), {
    message: 'Invalid phone number.',
  }),
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
  if (request.method !== 'POST') {
    return response.status(405).end()
  }

  const registerBody = registerBodySchema.safeParse(request.body)

  if (registerBody.success === false) {
    return response.status(400).json(registerBody.error.format())
  }

  const {
    data: {
      fullname,
      email,
      jobtitle,
      linkedin,
      phoneNumber,
      imageUrl,
      cardBackgroundColor,
      cardTextColor,
    },
  } = registerBody

  const userExists = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userExists) {
    return response.status(409).json({ message: 'email already exists.' })
  }

  const user = await prisma.user.create({
    data: {
      jobtitle,
      email: `${email}`,
      linkedin: linkedin || '', // If linkedin is undefined, use an empty string
      fullname,
      phoneNumber,
      image_url: imageUrl,
      card_background_color: cardBackgroundColor,
      card_text_color: cardTextColor,
    },
  })

  return response.status(201).json(user)
}
