import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import { findUserByEmail } from '@/lib/prisma/utils/find-user-by-email'
import { MergedVisitCardLayout } from '@/components/visit-card/MergedVisitCardLayout'

interface CardProps {
  user: {
    id: string
    fullname: string
    email: string
    jobtitle: string
    linkedin: string
    phoneNumber: string
    image_url: string | null
    card_background_color: string
    card_text_color: string
  }
}

export default function Card({ user }: CardProps) {
  return (
    <>
      <NextSeo
        title={`${user.fullname} visit card | Visit Card Generator`}
        description={`Visit card of ${user.fullname}`}
      />

      <MergedVisitCardLayout user={user} showOwnerActions />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const email = String(params?.email)

  const foundUser = await findUserByEmail(email)

  if (!foundUser) {
    return {
      notFound: true,
    }
  }

  const user = {
    ...foundUser,
    created_at: new Date(foundUser.created_at).toISOString(),
  }

  return {
    props: { user },
    revalidate: 60 * 60 * 24, // 1 day
  }
}
