import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import vCard from 'vcf'
import clsx from 'clsx'
import { toast } from 'react-toastify'
import {
  Download,
  Envelope,
  IdentificationCard,
  LinkedinLogo,
  PencilCircle,
  Phone,
} from 'phosphor-react'

import { Button } from '@/components/Button'
import { env } from '@/env'
import { replaceSpaceToDash } from '@/utils/replace-space-to-dash'

import immap from '../../../public/immap-logo.png'

/** Desktop min height: enough presence without the old 780px “huge” cards. */
const CARD_MIN_H_MD = 'md:min-h-[600px]'

export interface MergedVisitCardUser {
  id: string
  fullname: string
  email: string
  jobtitle: string
  linkedin: string
  phoneNumber: string
  image_url: string | null
  card_background_color?: string
  card_text_color?: string
}

interface MergedVisitCardLayoutProps {
  user: MergedVisitCardUser
  showOwnerActions?: boolean
  /** When false, only the contact-information card is shown (no QR side panel). */
  showQrCard?: boolean
}

function QrCardPanel({
  user,
  className,
}: {
  user: MergedVisitCardUser
  className?: string
}) {
  return (
    <div
      className={clsx(
        'w-[420px] max-w-[98%] flex flex-col h-full rounded-sm overflow-hidden shadow-sm shadow-black/10 py-8 md:py-10',
        CARD_MIN_H_MD,
        className,
      )}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="flex flex-col flex-1 min-h-0 px-10 gap-4">
        <div className="flex flex-col flex-1 min-h-0 items-center w-full">
          <div className="relative w-[250px] h-[100px] shrink-0">
            <Image
              src="/immap-logo.png"
              alt={`${user.fullname} — iMMAP logo`}
              width={300}
              height={300}
              className="object-contain mt-6"
              priority
            />
          </div>

          <div className="flex flex-1 min-h-0 w-full flex-col items-center justify-center mt-12">
            <Link
              target="_blank"
              href={`${
                env.NODE_ENV === 'development'
                  ? env.NEXT_PUBLIC_DEVELOPMENT_URL
                  : env.NEXT_PUBLIC_PRODUCTION_URL
              }/${user.id}/${replaceSpaceToDash(user.fullname)}`}
              className="w-[200px] h-[200px] bg-white p-2 rounded-sm border-[#bf1f26] border-1 shrink-0"
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
              className="text-2xl text-center font-semibold mt-3"
              style={{ color: '#be2126', fontSize: '16px' }}
            >
              Scan to download the details
            </span>
          </div>
        </div>

        <div className="shrink-0 w-full">
          <hr className="my-4 border-gray-300" />
          <div className="text-center">
            <Link
              href="https://www.immap.org"
              target="_blank"
              className="text-[#be2126] hover:text-[#bf1f26]"
            >
              www.immap.org
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactCardPanel({
  user,
  className,
}: {
  user: MergedVisitCardUser
  className?: string
}) {
  return (
    <div
      className={clsx(
        'user-card w-[420px] max-w-[98%] flex flex-col h-full px-2 md:px-8 py-8 md:py-10 rounded-sm',
        CARD_MIN_H_MD,
        className,
      )}
      style={{ backgroundColor: '#FFFFFF', color: '#000' }}
    >
      <div className="shrink-0 px-4">
        <div className="flex flex-col w-full gap-4 justify-center items-center mt-2">
          {user.image_url && (
            <Image
              className="rounded-md w-[80px] md:w-[100px]"
              src={'/immap-logo-small.png'}
              alt={user.fullname}
              width={150}
              height={100}
              quality={100}
              placeholder="blur"
              blurDataURL="https://res.cloudinary.com/dhexs29hy/image/upload/v1678970237/image_4_rv8dpo.png"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-h-0 px-4 pt-12">
        <div className="flex flex-col items-center shrink-0 text-center text-[#414141]">
          <h3 className="cq-title capitalize font-bold text-[#be2126] mb-3">
            {user.fullname}
          </h3>
          <div className="flex flex-col items-baseline mt-2">
            <h4
              className="cq-subtitle flex flex-col font-medium max-w-[300px] mb-3"
              style={{ color: '#414141' }}
            >
              {user.jobtitle}
            </h4>
            <span className="flex flex-col items-center underline-gray">
              <span className={'underline-red'}></span>
            </span>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 flex-col justify-center py-6">
          <div className="flex flex-col gap-3 w-[90%] mx-auto text-left text-[#414141]">
            <div className="cq-contact-row flex items-start gap-3 pt-8">
              <span
                className="mt-0.5 shrink-0 text-[#6d6e71]"
                title="Phone number"
              >
                <Phone size={18} weight="fill" aria-hidden />
              </span>
              <a
                href={`tel:${user.phoneNumber}`}
                target="_blank"
                title={user.phoneNumber}
                className="min-w-0 flex-1 truncate hover:underline text-[#bf1f26] [font-size:inherit]"
                rel="noreferrer"
              >
                {user.phoneNumber}
              </a>
            </div>
            <div className="cq-contact-row flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[#6d6e71]" title="Email">
                <Envelope size={18} weight="fill" aria-hidden />
              </span>
              <a
                href={`mailto:${user.email}@immap.org`}
                target="_blank"
                title={`${user.email}@immap.org`}
                className="min-w-0 flex-1 truncate hover:underline text-[#bf1f26] [font-size:inherit]"
                rel="noreferrer"
              >
                {`${user.email}@immap.org`}
              </a>
            </div>
            <div className="cq-contact-row flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[#6d6e71]" title="LinkedIn">
                <LinkedinLogo size={18} weight="fill" aria-hidden />
              </span>
              <a
                href={`https://linkedin.com/in/${user.linkedin}`}
                target="_blank"
                title={`https://linkedin.com/in/${user.linkedin}`}
                className="min-w-0 flex-1 hover:underline text-[#bf1f26] [font-size:inherit]"
                rel="noreferrer"
              >
                https://linkedin.com/in/{user.linkedin}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <div className="relative flex items-end h-[15px] mt-8">
          <div className="bg-left-black"></div>
          <div className="bg-right-red"></div>
        </div>
        <div className="flex items-center justify-center mt-6">
          <Image
            src="/slogan.png"
            alt="slogan"
            width={290}
            height={290}
            className="object-contain w-[250px] md:w-[290px]"
          />
        </div>
      </div>
    </div>
  )
}

export function MergedVisitCardLayout({
  user,
  showOwnerActions = false,
  showQrCard = true,
}: MergedVisitCardLayoutProps) {
  const router = useRouter()
  const downloadStackRef = useRef<HTMLDivElement | null>(null)

  // async function handleNavigateToUserPage() {
  //   await router.push(`/${user.id}/${replaceSpaceToDash(user.fullname)}`)
  // }

  function handleDownloadCard() {
    if (!downloadStackRef.current) {
      return
    }
    html2canvas(downloadStackRef.current, {
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      removeContainer: true,
    })
      .then((canvas) => {
        try {
          canvas.style.display = 'none'
          const imgData = canvas.toDataURL('image/png')
          const w = canvas.width
          const h = canvas.height
          // eslint-disable-next-line new-cap -- jsPDF ships with this constructor name
          const pdf = new jsPDF({
            unit: 'px',
            format: [w, h],
            orientation: w > h ? 'landscape' : 'portrait',
          })
          pdf.addImage(imgData, 'PNG', 0, 0, w, h)
          pdf.save(`${user.fullname}-card.pdf`)
        } catch {
          toast(
            'Ocorreu um problema ao fazer o download do cartão, tente novamente mais tarde!',
          )
        }
      })
      .catch(() => {
        toast(
          'Ocorreu um problema ao fazer o download do cartão, tente novamente mais tarde!',
        )
      })
  }

  const handleDownloadVCard = () => {
    try {
      // eslint-disable-next-line new-cap
      const card = new vCard()
      card.set(
        'fn',
        user.fullname
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      )
      card.set(
        'n',
        user.fullname
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
      )
      card.set('email', `${user.email}@immap.org`)
      card.set('title', user.jobtitle)
      card.set('tel', user.phoneNumber)
      card.set('mobile', user.phoneNumber)
      card.set('linkedin', `https://linkedin.com/in/${user.linkedin}`)
      card.set('photo', `${immap}`)
      const note = `LinkedIn: https://linkedin.com/in/${user.linkedin}\n`
      card.set('note', note)
      card.set('X-LINKEDIN', `https://linkedin.com/in/${user.linkedin}`)

      const vcfString = card.toString()

      const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8;' })

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${user.fullname}-contact.vcf`

      link.click()
    } catch (_) {
      toast(
        "Sorry, we're not able to export the vcf file for now, try to save manualy the contact or contact the immap at contact@immap.org for assistance",
      )
    }
  }

  async function handleEditInfos() {
    const describeInfo = JSON.stringify({
      fullname: user.fullname,
      jobtitle: user.jobtitle,
    })
    const contactsInfo = JSON.stringify({
      phoneNumber: user.phoneNumber,
      linkedin: user.linkedin ?? '',
      email: user.email,
    })

    sessionStorage.setItem('@generateCard:describe', describeInfo)
    sessionStorage.setItem('@generateCard:contacts', contactsInfo)

    const clientInfo = localStorage.getItem('client_info')

    await router.push(`/?id=${user.id}&client_info=${clientInfo}`)
  }

  return (
    <div className="bg-gradient-radial from-zinc-900/95 to-zinc-900 w-full min-h-screen flex flex-col gap-4 justify-center items-center py-8 ">
      {showOwnerActions ? (
        <div className="flex gap-2 w-full max-w-[min(900px,98%)]">
          <Button
            title="Edit information"
            size="sm"
            onClick={handleEditInfos}
            className="max-w-[200px]"
            variant="secondary"
          >
            <PencilCircle weight="regular" size={18} />
          </Button>
          {/* <Button
            title="Navigate to page"
            size="sm"
            variant="secondary"
            onClick={handleNavigateToUserPage}
            className="max-w-[200px]"
          >
            <ArrowRight weight="bold" size={18} />
          </Button> */}
        </div>
      ) : null}

      <div
        data-testid="visit-card-visible"
        className={clsx(
          'w-full max-w-[min(900px,98%)] px-2 mx-auto pt-16 pb-6 gap-4',
          showQrCard
            ? 'grid grid-cols-1 justify-items-center md:grid-cols-[420px_420px] md:justify-center md:justify-items-stretch'
            : 'flex flex-col items-center',
        )}
      >
        {showQrCard ? (
          <QrCardPanel
            user={user}
            className="h-full w-full max-w-[98%] md:max-w-none"
          />
        ) : null}
        <ContactCardPanel
          user={user}
          className="h-full w-full max-w-[98%] md:max-w-none"
        />
      </div>

      <div
        ref={downloadStackRef}
        className="fixed left-[-10000px] top-0 z-[-1] flex flex-col items-start gap-0 pointer-events-none"
        aria-hidden
      >
        {showQrCard ? <QrCardPanel user={user} /> : null}
        <ContactCardPanel user={user} />
      </div>

      <div
        className={clsx(
          'w-full',
          showQrCard ? 'max-w-[min(900px,98%)]' : 'max-w-[min(400px,98%)]',
        )}
      >
        <div className="flex justify-center gap-2">
          {showOwnerActions && (
            <Button
              title="Download card"
              variant="tertiary"
              onClick={handleDownloadCard}
              className=" flex-1 min-w-[120px]"
            >
              <Download weight="bold" size={18} />
            </Button>
          )}
          {!showOwnerActions && (
            <Button
              title="Save contact"
              onClick={handleDownloadVCard}
              className=" flex-1 min-w-[120px]"
            >
              <IdentificationCard weight="bold" size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
