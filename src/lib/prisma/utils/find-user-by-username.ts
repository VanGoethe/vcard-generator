import { prisma } from '..'

export async function findUserByFullname(fullname: string) {
  const user = prisma.user.findUnique({
    where: {
      fullname,
    },
  })

  return user
}
