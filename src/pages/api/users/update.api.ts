import { prisma } from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { isValidPhoneNumber } from 'libphonenumber-js'

import { replaceSpaceToDash } from '@/utils/replace-space-to-dash'

const updateBodySchema = z.object({
  id: z.string(),
  fullname: z
    .string()
    .transform((name) => name.toLowerCase().replace(/\//g, '')),
  jobtitle: z.string(),
  email: z.string().refine((email) => !/@/.test(email), {
    message: 'You dont`t need to add an prefix(@immap.org) of your email',
  }),
  linkedin: z.preprocess(
    (val) => (val === null || val === undefined ? '' : val),
    z.string().transform((s) => s.toLowerCase().replace(/\//g, '')),
  ),
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
  if (request.method !== 'PUT') {
    return response.status(405).end()
  }

  const updateBody = updateBodySchema.safeParse(request.body)

  if (updateBody.success === false) {
    return response.status(400).json(updateBody.error.format())
  }

  const {
    data: {
      id,
      fullname,
      email,
      jobtitle,
      linkedin,
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
      linkedin: linkedin || '',
      fullname,
      phoneNumber,
      image_url: imageUrl,
      card_background_color: cardBackgroundColor,
      card_text_color: cardTextColor,
    },
  })

  try {
    await response.revalidate(`/cards/${email}`)
    await response.revalidate(`/${id}/${replaceSpaceToDash(fullname)}`)
  } catch (revalidateErr) {
    console.error('ISR revalidate failed:', revalidateErr)
  }

  return response.status(200).json(user)
}
