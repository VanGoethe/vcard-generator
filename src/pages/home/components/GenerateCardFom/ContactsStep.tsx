import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { NextSeo } from 'next-seo'
import { z } from 'zod'

import { Button } from '@/components/Button'
import { MultiStep } from '@/components/MultiStep'
import { TextInput } from '@/components/TextInput'

import { ArrowRight } from 'phosphor-react'
import { TextInputPhoneNumber } from '@/components/TextInputNumber'
import { Select } from '@/components/Select'
import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
// import { CustomStepInput } from './CustomStep'

const contactsStepSchema = z.object({
  email: z
    .string({ required_error: 'You need to provide a email.' })
    // .email({ message: 'You need to provide a valid email.' })
    .max(191, { message: 'You have reached the maximum character size.' })
    .refine((email) => email.trim().length > 0, {
      message: 'You need to provide a email.',
    }),
  // countryCode: z
  //   .string({ required_error: 'You need to provide a country code.' })
  //   .max(191, { message: 'You have reached the maximum character size.' }),
  phoneNumber: z
    .string({ required_error: 'You need to provide a phone number.' })
    .max(191, { message: 'You have reached the maximum character size.' }),
  timezone: z
    .string({
      required_error: 'You need to provide your timezone.',
    })
    .refine((timezone) => timezone.trim().length > 0, {
      message: 'You need to provide your timezone.',
    }),
  skype: z
    .string({ required_error: 'You need to provide your skype username.' })
    .regex(/^([a-z\d\-]+)$/i, {
      message:
        "The username must contain only letters and numbers and separated by '-'.",
    })
    .max(191, { message: 'You have reached the maximum character size.' })
    .refine((skype) => skype.trim().length > 0, {
      message: 'You need to provide your skype username.',
    })
    .transform((skype) => skype.toLowerCase().replace(/\//g, '')),
  linkedin: z
    .string({ required_error: 'You need to provide your Linkedin username.' })
    .regex(/^([a-z\d\-]+)$/i, {
      message:
        "The username must contain only letters and numbers and separated by '-'.",
    })
    .max(191, { message: 'You have reached the maximum character size.' })
    .refine((linkedin) => linkedin.trim().length > 0, {
      message: 'You need to provide your Linkedin username.',
    })
    .transform((linkedin) => linkedin.toLowerCase().replace(/\//g, '')),
})

type ContactsStepInput = z.infer<typeof contactsStepSchema>

interface ContactsStepProps {
  navigateTo: (step: 'describeStep' | 'contactsStep' | 'customStep') => void
}

export function ContactsStep({ navigateTo }: ContactsStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactsStepInput>({
    resolver: zodResolver(contactsStepSchema),
  })

  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const { id } = router.query

  async function handleSubmitContactsWithSocials(data: ContactsStepInput) {
    const {
      email,
      // countryCode,
      phoneNumber,
      timezone,
      skype,
      linkedin,
    } = data

    const contactsInfo = {
      email,
      // phoneNumber: `(${countryCode})${phoneNumber}`,
      phoneNumber,
      timezone,
      skype,
      linkedin,
    }
    console.log(contactsInfo)

    sessionStorage.setItem(
      '@generateCard:contacts',
      JSON.stringify(contactsInfo),
    )

    // navigateTo('customStep')
    try {
      const describeInfo = sessionStorage.getItem('@generateCard:describe')
      const contactsInfo = sessionStorage.getItem('@generateCard:contacts')

      if (!describeInfo || !contactsInfo) {
        return
      }

      // const hasImageFile = logoImage.length > 0
      const describeInfoParsed: {
        fullname: string
        jobtitle: string
      } = JSON.parse(describeInfo)
      const contactsInfoParsed: {
        skype: string
        phoneNumber: string
        timezone: string
        linkedin: string
        email: string
      } = JSON.parse(contactsInfo)

      if (isEdit) {
        await api.put('/users/update', {
          id,
          ...describeInfoParsed,
          ...contactsInfoParsed,
          imageUrl: 'logo',
          cardBackgroundColor: '#232325',
          cardTextColor: '#ffffff',
        })
      } else {
        await api.post('/users/register', {
          ...describeInfoParsed,
          ...contactsInfoParsed,
          imageUrl: 'logo',
          cardBackgroundColor: '#232325',
          cardTextColor: '#ffffff',
        })
      }

      sessionStorage.removeItem('@generateCard:describe')
      sessionStorage.removeItem('@generateCard:contacts')
      await router.push(`/cards/${describeInfoParsed.fullname}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          return toast('We had a problem proceeding, try again later!', {
            type: 'error',
          })
        }

        if (error.response?.status === 409) {
          toast('full name already registered.', {
            type: 'error',
          })
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
      // setValue('countryCode', ContactsInfo.countryCode)
      setValue('phoneNumber', ContactsInfo.phoneNumber)
      setValue('timezone', ContactsInfo.timezone)
      setValue('skype', ContactsInfo.skype)
      setValue('linkedin', ContactsInfo.linkedin)
    }
  }, [id, setValue])

  return (
    <>
      <NextSeo
        title="Contacts | Visit Card Generator"
        description="Define your networks so you can be found."
      />

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
              >
                <TextInput.Suffix suffix="@immap.org" />
              </TextInput.Input>
              <TextInput.MessageError message={errors.email?.message} />
            </TextInput.Root>
          </label>

          <label className="flex flex-col gap-2">
            Phone number
            <TextInput.Root>
              <TextInputPhoneNumber.Input
                hasError={!!errors.phoneNumber}
                placeholder="+25712345678"
                {...register('phoneNumber')}
                // setCode={(val: any) => register('countryCode', val)}
              />
              <TextInput.MessageError message={errors.phoneNumber?.message} />
            </TextInput.Root>
          </label>

          <label className="flex flex-col gap-2">
            Timezone
            <Select.Root>
              <Select.Input
                placeholder="your-user"
                hasError={!!errors.timezone}
                {...register('timezone')}
              />
              <Select.MessageError message={errors.timezone?.message} />
            </Select.Root>
          </label>

          <label className="flex flex-col gap-2">
            Skype
            <TextInput.Root>
              <TextInput.Input
                placeholder="your-user"
                hasError={!!errors.skype}
                {...register('skype')}
              >
                <TextInput.Prefix prefix="https://skype.com/" />
              </TextInput.Input>
              <TextInput.MessageError message={errors.skype?.message} />
            </TextInput.Root>
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
    </>
  )
}
