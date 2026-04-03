import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { NextSeo } from 'next-seo'
import { z } from 'zod'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'libphonenumber-js'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { MultiStep } from '@/components/MultiStep'
import { TextInput } from '@/components/TextInput'

import { ArrowRight } from '@phosphor-icons/react'
import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { firstZodErrorMessage } from '@/lib/zod-error-message'

import type { MicrosoftGraphProfile } from '@/hooks/useMicrosoftProfile'
import {
  graphEmailToLocalPart,
  graphPhoneForForm,
} from '@/hooks/useMicrosoftProfile'
import { guessDefaultCountry } from '@/utils/default-phone-country'
import { normalizePhoneToE164 } from '@/utils/phone-e164'

const contactsStepSchema = z.object({
  email: z
    .string({ required_error: 'You need to provide a email.' })
    // .email({ message: 'You need to provide a valid email.' })
    .max(191, { message: 'You have reached the maximum character size.' })
    .refine((email) => email.trim().length > 0, {
      message: 'You need to provide a email.',
    })
    .refine((email) => !/@/.test(email), {
      message: 'You do not need to add "@immap.org" of your email',
    }),
  phoneNumber: z
    .string({ required_error: 'You need to provide a phone number.' })
    .max(191, { message: 'You have reached the maximum character size.' })
    .refine((v) => v.trim().length > 0, {
      message: 'You need to provide your phone number.',
    })
    .refine((v) => isValidPhoneNumber(v), {
      message: 'You need to provide a valid phone number.',
    }),
  linkedin: z.preprocess(
    (val) => (val === null || val === undefined ? '' : val),
    z
      .string()
      .max(191, { message: 'You have reached the maximum character size.' })
      .refine((linkedin) => (linkedin ? linkedin.trim().length > 0 : true), {
        message: 'You need to provide your Linkedin username.',
      }),
  ),
})

type ContactsStepInput = z.infer<typeof contactsStepSchema>

interface ContactsStepProps {
  navigateTo: (step: 'describeStep' | 'contactsStep' | 'customStep') => void
  microsoftProfile?: MicrosoftGraphProfile | null
}

export function ContactsStep({
  navigateTo,
  microsoftProfile = null,
}: ContactsStepProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactsStepInput>({
    resolver: zodResolver(contactsStepSchema),
    defaultValues: {
      phoneNumber: '',
    },
  })

  const defaultCountry = useMemo(() => guessDefaultCountry(), [])

  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const { id } = router.query
  const userId = Array.isArray(id) ? id[0] : id

  const [profile, setProfile] = useState(null as unknown as string)

  async function handleSubmitContactsWithSocials(data: ContactsStepInput) {
    const { email, phoneNumber, linkedin } = data

    const contactsPayload = {
      email,
      phoneNumber: phoneNumber.trim(),
      linkedin: linkedin ?? '',
    }

    sessionStorage.setItem(
      '@generateCard:contacts',
      JSON.stringify(contactsPayload),
    )

    try {
      const describeInfo = sessionStorage.getItem('@generateCard:describe')
      const contactsFromStorage = sessionStorage.getItem(
        '@generateCard:contacts',
      )

      if (!describeInfo || !contactsFromStorage) {
        toast(
          'Your session expired or data is missing. Open Edit from your card page again.',
          { type: 'error' },
        )
        return
      }

      const describeInfoParsed: {
        fullname: string
        jobtitle: string
      } = JSON.parse(describeInfo)
      const contactsInfoParsed: {
        phoneNumber: string
        linkedin: string
        email: string
      } = JSON.parse(contactsFromStorage)

      if (isEdit) {
        if (!userId) {
          toast('Missing user id. Open Edit from your card page again.', {
            type: 'error',
          })
          return
        }
        await api.put('/users/update', {
          id: userId,
          ...describeInfoParsed,
          ...contactsInfoParsed,
          linkedin: contactsInfoParsed.linkedin ?? '',
          imageUrl: 'logo',
          cardBackgroundColor: '#232325',
          cardTextColor: '#ffffff',
        })
        setProfile(null as unknown as string)
      } else {
        await api.post('/users/register', {
          ...describeInfoParsed,
          ...contactsInfoParsed,
          linkedin: contactsInfoParsed.linkedin ?? '',
          imageUrl: 'logo',
          cardBackgroundColor: '#232325',
          cardTextColor: '#ffffff',
        })
        setProfile(null as unknown as string)
      }

      sessionStorage.removeItem('@generateCard:describe')
      sessionStorage.removeItem('@generateCard:contacts')
      await router.push(`/cards/${contactsInfoParsed.email}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status
        const resData = error.response?.data

        if (status === 500) {
          return toast('We had a problem proceeding, try again later!', {
            type: 'error',
          })
        }

        if (status === 400) {
          const msg =
            firstZodErrorMessage(resData) ??
            'Please check your input and try again.'
          return toast(msg, { type: 'error' })
        }

        if (status === 404 && isEdit) {
          return toast('User not found.', { type: 'error' })
        }

        if (status === 409) {
          toast('email already registered.', {
            type: 'error',
          })
          setProfile(contactsPayload.email)
          return
        }
      }
      toast('We have a problem, check your internet connection.', {
        type: 'error',
      })
    }
  }

  function handleGoBack() {
    navigateTo('describeStep')
  }

  useEffect(() => {
    const hasContactsInfo = sessionStorage.getItem('@generateCard:contacts')

    if (id) {
      setIsEdit(true)
    }

    if (hasContactsInfo) {
      const ContactsInfo = JSON.parse(hasContactsInfo)

      setValue('email', ContactsInfo.email)
      setValue('phoneNumber', ContactsInfo.phoneNumber)
      setValue('linkedin', ContactsInfo.linkedin ?? '')
      return
    }

    const emailLocal = graphEmailToLocalPart(microsoftProfile ?? {})
    if (emailLocal) {
      setValue('email', emailLocal)
    }
    const phone = graphPhoneForForm(microsoftProfile ?? {})
    if (phone) {
      const e164 = normalizePhoneToE164(phone, defaultCountry)
      setValue('phoneNumber', e164 ?? phone)
    }
  }, [id, setValue, microsoftProfile, defaultCountry])

  return (
    <div className=" flex flex-col gap-6">
      <NextSeo
        title="Contacts | Visit Card Generator"
        description="Define your networks so you can be found."
      />

      {profile && (
        <div className="bg-zinc-800 max-w-[546px] w-full mx-auto p-5">
          {' '}
          An ecard with this email already exists:{' '}
          <Link className="text-[#cf4343] underline" href={`/cards/${profile}`}>
            visit profile
          </Link>
        </div>
      )}

      <form
        onSubmit={handleSubmit(handleSubmitContactsWithSocials)}
        className="bg-zinc-800 max-w-[546px] w-full mx-auto p-9 rounded-md flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <strong className="font-bold text-2xl">Define your contacts</strong>
          <span className="text-gray-200">
            Define your networks so you can be found.
          </span>
        </div>

        <MultiStep currentStep={2} size={2} />
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            Email
            <TextInput.Root>
              <TextInput.Input
                hasError={!!errors.email}
                placeholder="johndoe"
                {...register('email')}
                hasSuffix={true}
                disabled={!!isEdit}
              >
                <TextInput.Suffix suffix="@immap.org" />
              </TextInput.Input>
              <TextInput.MessageError message={errors.email?.message} />
            </TextInput.Root>
          </label>

          <label className="flex flex-col gap-2">
            Phone number
            <div
              className={clsx(
                'contacts-phone-field',
                errors.phoneNumber && 'PhoneInput--error',
              )}
            >
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    international
                    defaultCountry={defaultCountry}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? '')}
                    disabled={isSubmitting}
                    limitMaxLength
                  />
                )}
              />
            </div>
            <TextInput.MessageError message={errors.phoneNumber?.message} />
          </label>

          <label className="flex flex-col gap-2">
            Linkedin
            <TextInput.Root>
              <TextInput.Input
                placeholder="your-user"
                hasError={!!errors.linkedin}
                {...register('linkedin')}
              >
                <TextInput.Prefix prefix="https://www.linkedin.com/in/" />
              </TextInput.Input>
              <TextInput.MessageError message={errors.linkedin?.message} />
            </TextInput.Root>
          </label>

          <div className="flex gap-2">
            <Button
              title="Back"
              type="button"
              variant="secondary"
              onClick={handleGoBack}
              disabled={isSubmitting}
            />

            <Button
              title="Validate"
              type="submit"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <ArrowRight weight="bold" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
