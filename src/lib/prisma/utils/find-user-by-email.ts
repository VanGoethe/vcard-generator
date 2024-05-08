import { prisma } from '..'

export async function findUserByEmail(email: string) {
  const user = prisma.user.findUnique({
    where: {
      email,
    },
  })

  return user
}
