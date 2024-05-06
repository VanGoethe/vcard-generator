import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { findUserById } from '@/lib/prisma/utils/find-user-by-id'

import Image from 'next/image'
// import Link from 'next/link'

import {
  // Clock,
  Download,
  // Envelope, LinkedinLogo, Phone
} from 'phosphor-react'
// import { env } from '@/env'
// import { replaceSpaceToDash } from '@/utils/replace-space-to-dash'
// import QRCode from 'react-qr-code'
import vCard from 'vcf'
import { toast } from 'react-toastify'
import { Button } from '@/components/Button'

import immap from '../../../../public/immap-logo.png'

interface UserPageProps {
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
  }
}

export default function UserPage({ user }: UserPageProps) {
  const handleDownloadVCard = () => {
    try {
      // eslint-disable-next-line new-cap
      const card = new vCard()
      // add properties to vCard
      card.set('fn', user.fullname)
      card.set('n', user.fullname)
      card.set('email', user.email)
      card.set('title', user.jobtitle)
      card.set('tel', user.phoneNumber)
      card.set('mobile', user.phoneNumber)
      card.set('linkedin', `https://linkedin.com/in/${user.linkedin}`)
      card.set('skype', `https://skype.com/${user.skype}`)
      card.set('photo', `${immap}`) // this should be a URL or base64 encoded string
      const note = `LinkedIn: https://linkedin.com/in/${user.linkedin}\n Skype: https://skype.com/${user.skype}\n Timezone: Africa/Blantyre`
      card.set('note', note)
      card.set('tz', user.timezone)
      card.set('X-LINKEDIN', `https://linkedin.com/in/${user.linkedin}`)
      card.set('X-SKYPE', `https://skype.com/${user.skype}`)

      // convert vCard object to string
      const vcfString = card.toString()

      const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8;' })

      // Create a link element
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${user.fullname}-contact.vcf` // provide the name for the downloaded file

      // Automatically download the file
      link.click()
    } catch (error) {
      toast(
        "Sorry, we're not able to export the vcf file for now, try to save manualy the contact or contact the immap at contact@immap.org for assistance",
      )
    }
  }

  return (
    <>
      <NextSeo
        title={`${user.fullname} | Visit Card Generator`}
        description={`Contact Page of ${user.fullname}`}
      />

      <div className="bg-gradient-radial from-zinc-900/95 to-zinc-900 w-full h-screen flex flex-col justify-center items-center">
        <div
          className="max-w-[400px] h-auto w-full px-4 py-4 rounded-sm"
          style={{ backgroundColor: '#FFFFFF', color: '#000' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-4 px-6 mt-2">
            <div>
              <div className="flex flex-col w-full h-full gap-4 justify-center items-center">
                {user.image_url && (
                  <Image
                    className="rounded-md"
                    src={'/immap-logo-small.png'}
                    alt={user.fullname}
                    width={120}
                    height={120}
                    quality={100}
                    placeholder="blur"
                    blurDataURL="https://res.cloudinary.com/dhexs29hy/image/upload/v1678970237/image_4_rv8dpo.png"
                  />
                )}

                {/* <Link
                  target="_blank"
                  href={`${
                    env.NODE_ENV === 'development'
                      ? env.NEXT_PUBLIC_DEVELOPMENT_URL
                      : env.NEXT_PUBLIC_PRODUCTION_URL
                  }/${user.id}/${replaceSpaceToDash(user.fullname)}`}
                  className="w-[100px] h-[100px] bg-white p-2 rounded-sm border-[#bf1f26] border-2"
                >
                  <QRCode
                    value={`${
                      env.NODE_ENV === 'development'
                        ? env.NEXT_PUBLIC_DEVELOPMENT_URL
                        : env.NEXT_PUBLIC_PRODUCTION_URL
                    }/${user.id}/${replaceSpaceToDash(user.fullname)}`}
                    className="w-full h-full"
                  />
                </Link> */}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-1 w-full items-center text-center text-[#414141] mt-4">
                <strong className="text-2xl capitalize font-bold text-[#193661]">
                  {user.fullname}
                </strong>
                <div className="flex flex-col items-center mt-2 mb-8">
                  <span
                    className="flex flex-col break-all font-light"
                    style={{ color: '#414141' }}
                  >
                    {user.jobtitle}
                  </span>
                  <span className="flex flex-col items-center underline-gray mt-1">
                    <span className={'underline-red'}></span>
                  </span>
                </div>
                <div className="flex items-center gap-2 my-[2px] text-[14px]">
                  <span className="text-[#6d6e71] text-[12px]">Timezone: </span>
                  <span className="flex flex-col break-all">
                    {user.timezone}
                  </span>
                  {/* <span className="flex justify-center items-center bg-[#193661] p-[4px] h-[20px] rounded-sm">
                    <Clock color="#ffffff" size={12} />
                  </span> */}
                </div>
                <div className="flex items-center gap-2 my-[2px] text-[14px]">
                  <span className="text-[#6d6e71] text-[12px]">
                    Phone number:{' '}
                  </span>
                  <span className="flex flex-col break-all">
                    {user.phoneNumber}
                  </span>
                  {/* <span className="flex justify-center items-center bg-[#193661] p-[4px] h-[20px] rounded-sm">
                    <Phone color="#ffffff" size={12} />
                  </span> */}
                </div>
                <div className="flex items-center gap-2 my-[2px] text-[14px]">
                  <span className="text-[#6d6e71] text-[12px]">Email: </span>
                  <a
                    href={`mailto:${user.email}`}
                    target="_blank"
                    className="flex flex-col break-all underline text-[#bf1f26]"
                    rel="noreferrer"
                  >
                    {user.email}
                  </a>
                  {/* <span className="flex justify-center items-center bg-[#193661] p-[4px] h-[20px] rounded-sm">
                    <Envelope color="#ffffff" size={12} />
                  </span> */}
                </div>
                <div className="flex items-center gap-2 my-[2px] text-[14px]">
                  <span className="text-[#6d6e71] text-[12px]">LinkedIn: </span>
                  <a
                    href={`https://linkedin.com/in/${user.linkedin}`}
                    target="_blank"
                    className="flex flex-col break-all  underline text-[#bf1f26]"
                    rel="noreferrer"
                  >
                    https://linkedin.com/in/{user.linkedin}
                  </a>
                  {/* <span className="flex justify-center items-center bg-[#193661] p-[4px] h-[20px] rounded-sm">
                    <LinkedinLogo color="#ffffff" size={12} />
                  </span> */}
                </div>
                <div className="flex items-center gap-2 my-[2px] text-[14px]">
                  <span className="text-[#6d6e71] text-[12px]">Skype: </span>
                  <a
                    href={`https://skype.com/${user.skype}`}
                    target="_blank"
                    className="flex flex-col break-all underline text-[#bf1f26]"
                    rel="noreferrer"
                  >
                    https://skype.com/{user.skype}
                  </a>
                  {/* <span className="flex justify-center items-center bg-[#193661] p-[4px] h-[20px] rounded-sm">
                    <Image
                      className="rounded-md invert"
                      src={'/skype-logo.svg'}
                      alt={'skype'}
                      width={12}
                      height={12}
                    />
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-end h-[20px] mt-8">
            <div className="bg-left-black"></div>
            <div className="bg-right-red"></div>
          </div>
        </div>
        <Button
          title="Save contact"
          size="sm"
          onClick={handleDownloadVCard}
          className="max-w-[400px] mt-4"
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
