import { prisma } from '@/lib/prisma'
import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'

interface UserPageProps {
  user: {
    id: string
    name: string
    email: string
    username: string
    linkedin: string
    github: string
    image_url: string | null
    description: string
  }
}

export default function UserPage({ user }: UserPageProps) {
  return (
    <div className="bg-gradient-radial from-zinc-900/95 to-zinc-900 w-full h-screen flex justify-center items-center">
      <div className="bg-zinc-800 max-w-[500px] w-full p-9 rounded-md flex flex-col items-center justify-between gap-6">
        {user.image_url && (
          <Image
            className="rounded-md"
            src={user.image_url}
            alt={user.username}
            width={90}
            height={90}
            quality={100}
          />
        )}

        <div className="flex flex-col gap-1 w-full items-center ">
          <strong className="text-2xl capitalize font-medium">
            {user.name}
          </strong>
          <span className="flex flex-col break-all">{user.description}</span>
        </div>

        <div className="grid grid-cols-3 w-full gap-2">
          <Link
            href="bruno.luiz@email.com"
            target="_blank"
            className="text-sm bg-blue-600 rounded-md py-4 flex h-12 gap-2 justify-center items-center w-full transition-colors"
          >
            Email
          </Link>
          <Link
            href={`https://www.github.com/${user.github}`}
            target="_blank"
            className="text-sm bg-blue-600 rounded-md py-4 flex h-12 gap-2 justify-center items-center w-full transition-colors"
          >
            Github
          </Link>
          <Link
            href={`https://www.linkedin.com/in/${user.linkedin}`}
            target="_blank"
            className="text-sm bg-blue-600 rounded-md py-4 flex h-12 gap-2 justify-center items-center w-full transition-colors"
          >
            Linkedin
          </Link>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = String(params?.id)

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      github: true,
      linkedin: true,
      description: true,
      image_url: true,
    },
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: { user },
    revalidate: 60 * 60 * 24, // 1 day
  }
}