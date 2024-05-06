import { useRef } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import html2canvas from 'html2canvas'
import { useRouter } from 'next/router'
import { replaceSpaceToDash } from '@/utils/replace-space-to-dash'
import { findUserByFullname } from '@/lib/prisma/utils/find-user-by-username'
import { env } from '@/env'

import { NextSeo } from 'next-seo'
import { Button } from '@/components/Button'
import QRCode from 'react-qr-code'
// import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'

import { ArrowRight, Download, PencilCircle } from 'phosphor-react'

interface CardProps {
  user: {
    id: string
    fullname: string
    email: string
    jobtitle: string
    linkedin: string
    skype: string
    timezone: string
    phoneNumber: string
    image_url: string | null
    card_background_color: string
    card_text_color: string
  }
}

export default function Card({ user }: CardProps) {
  // const TEXT_COLOR = user.card_text_color
  const router = useRouter()

  const cardRef = useRef<HTMLDivElement | null>(null)

  async function handleNavigateToUserPage() {
    await router.push(
      `${
        env.NODE_ENV === 'development'
          ? env.NEXT_PUBLIC_DEVELOPMENT_URL
          : env.NEXT_PUBLIC_PRODUCTION_URL
      }/${user.id}/${replaceSpaceToDash(user.fullname)}`,
    )
  }

  function handleDownloadCard() {
    if (!cardRef.current) {
      return
    }
    try {
      html2canvas(cardRef.current, {
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        // color: '#414141',
        removeContainer: true,
      }).then((canvas) => {
        canvas.style.display = 'none'
        const image = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.setAttribute('download', `${user.fullname}-card.png`)
        a.setAttribute('href', image)
        a.click()
      })
    } catch (_) {
      toast(
        'Ocorreu um problema ao fazer o download do cartão, tente novamente mais tarde!',
      )
    }
  }

  async function handleEditInfos() {
    const describeInfo = JSON.stringify({
      fullname: user.fullname,
      jobtitle: user.jobtitle,
    })
    const contactsInfo = JSON.stringify({
      skype: user.skype,
      phoneNumber: user.phoneNumber,
      timezone: user.timezone,
      linkedin: user.linkedin,
      email: user.email,
    })

    sessionStorage.setItem('@generateCard:describe', describeInfo)
    sessionStorage.setItem('@generateCard:contacts', contactsInfo)

    await router.push(`/?id=${user.id}`)
  }

  return (
    <>
      <NextSeo
        title={`${user.fullname} visit card | Visit Card Generator`}
        description={`Visit card of ${user.fullname}`}
      />

      <div className="bg-gradient-radial from-zinc-900/95 to-zinc-900 w-full h-screen flex flex-col gap-4 justify-center items-center">
        <div className="flex gap-2 w-[400px]">
          <Button
            title="Edit information"
            size="sm"
            onClick={handleEditInfos}
            className="max-w-[200px]"
            variant="secondary"
          >
            <PencilCircle weight="regular" size={18} />
          </Button>
          <Button
            title="Navigate to page"
            size="sm"
            variant="secondary"
            onClick={handleNavigateToUserPage}
            className="max-w-[200px]"
          >
            <ArrowRight weight="bold" size={18} />
          </Button>
        </div>

        <div
          ref={cardRef}
          className={`w-[400px] h-auto rounded-sm overflow-hidden shadow-sm shadow-black/10 mx-auto flex flex-col`}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="h-full gap-2 ">
            <div className="px-10 py-5">
              <div className="flex flex-col w-full h-full justify-center items-center ">
                <div className="flex flex-col w-full h-full gap-2 justify-center items-center">
                  <div className="w-[120px] h-auto">
                    {/* <Image
                      src={'/immap-logo.png'}
                      alt={user.fullname}
                      width={120}
                      height={60}
                    /> */}
                    <img src="/immap-logo-small.png" alt={user.fullname} />
                  </div>

                  <span
                    className="text-2xl capitalize font-bold mt-4"
                    style={{ color: '#193661' }}
                  >
                    {user.fullname}
                  </span>

                  <span
                    className="text-lg capitalize font-bold mb-8"
                    style={{
                      // color: '#193661',
                      color: 'rgb(109 110 113)',
                    }}
                  >
                    {user.jobtitle}
                  </span>

                  <Link
                    target="_blank"
                    href={`${
                      env.NODE_ENV === 'development'
                        ? env.NEXT_PUBLIC_DEVELOPMENT_URL
                        : env.NEXT_PUBLIC_PRODUCTION_URL
                    }/${user.id}/${replaceSpaceToDash(user.fullname)}`}
                    className="w-[200px] h-[200px] bg-white p-2 rounded-sm border-[#bf1f26] border-1"
                  >
                    <QRCode
                      value={`${
                        env.NODE_ENV === 'development'
                          ? env.NEXT_PUBLIC_DEVELOPMENT_URL
                          : env.NEXT_PUBLIC_PRODUCTION_URL
                      }/${user.id}/${replaceSpaceToDash(user.fullname)}`}
                      className="w-full h-full"
                    />
                  </Link>

                  <span
                    className="text-2xl text-center font-semibold mt-8"
                    style={{ color: '#be2126', fontSize: '16px' }}
                  >
                    Scan to download the details
                  </span>
                  <div className="w-[300px] h-auto mt-4">
                    {/* <Image
                      src={'/immap-logo.png'}
                      alt={user.fullname}
                      width={120}
                      height={60}
                    /> */}
                    <img src="/slogan.png" alt={user.fullname} />
                  </div>
                </div>
              </div>
              {/* <div className="text-right text-black">
                <div
                  className="text-2xl capitalize font-bold"
                  style={{ color: '#232325' }}
                >
                  {user.fullname}
                </div>
                <div
                  className="text-md font-normal"
                  style={{ color: '#696969' }}
                >
                  {user.jobtitle}
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <Button
          title="Download card"
          size="sm"
          onClick={handleDownloadCard}
          className="max-w-[400px]"
        >
          <Download weight="bold" size={18} />
        </Button>
      </div>
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
  const fullname = String(params?.fullname)

  const foundUser = await findUserByFullname(fullname)

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
