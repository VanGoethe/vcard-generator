import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'

import { findUserById } from '@/lib/prisma/utils/find-user-by-id'
import { MergedVisitCardLayout } from '@/components/visit-card/MergedVisitCardLayout'

interface UserPageProps {
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

export default function UserPage({ user }: UserPageProps) {
  return (
    <>
      <NextSeo
        title={`${user.fullname} | Visit Card Generator`}
        description={`Contact Page of ${user.fullname}`}
      />

      <MergedVisitCardLayout user={user} showQrCard={false} />
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
  const id = String(params?.id)

  const foundUser = await findUserById(id)

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
