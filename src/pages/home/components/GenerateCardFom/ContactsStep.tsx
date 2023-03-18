import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/Button'
import { MultiStep } from '@/components/MultiStep'
import { TextInput } from '@/components/TextInput'

import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { useEffect } from 'react'
import { NextSeo } from 'next-seo'

const contactsStepSchema = z.object({
  email: z
    .string({ required_error: 'You need to provide a email.' })
    .email({ message: 'You need to provide a valid email.' })
    .max(191, { message: 'you have reached the maximum character size' })
    .refine((email) => email.trim().length > 0, {
      message: 'You need to provide a email.',
    }),
  github: z
    .string({ required_error: 'You need to provide your Github username.' })
    .regex(/^([a-z\d\-]+)$/i, {
      message:
        "The username must contain only letters and numbers and separated by '-'.",
    })
    .max(191, { message: 'you have reached the maximum character size' })
    .refine((github) => github.trim().length > 0, {
      message: 'You need to provide your Github username.',
    })
    .transform((github) => github.toLowerCase().replace(/\//g, '')),
  linkedin: z
    .string({ required_error: 'You need to provide your Linkedin username.' })
    .regex(/^([a-z\d\-]+)$/i, {
      message:
        "The username must contain only letters and numbers and separated by '-'.",
    })
    .max(191, { message: 'you have reached the maximum character size' })
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
    formState: { errors },
  } = useForm<ContactsStepInput>({
    resolver: zodResolver(contactsStepSchema),
  })

  function handleSubmitContacts(data: ContactsStepInput) {
    const describeInfo = sessionStorage.getItem('@generateCard:register')

    const { email, github, linkedin } = data

    if (describeInfo) {
      const describeInfoParse: {
        username: string
        name: string
        description: string
      } = JSON.parse(describeInfo)

      const card = {
        email,
        github,
        linkedin,
        ...describeInfoParse,
      }

      sessionStorage.setItem('@generateCard:register', JSON.stringify(card))

      navigateTo('customStep')
    }
  }

  function handleGoBack() {
    navigateTo('describeStep')
  }

  useEffect(() => {
    const hasRegisterInfo = sessionStorage.getItem('@generateCard:register')

    if (hasRegisterInfo) {
      const registerInfo = JSON.parse(hasRegisterInfo)

      setValue('email', registerInfo.email)
      setValue('github', registerInfo.github)
      setValue('linkedin', registerInfo.linkedin)
    }
  }, [setValue])

  return (
    <>
      <NextSeo
        title="Contacts | Visit Card Generator"
        description="Define your networks so you can be found."
      />

      <form
        onSubmit={handleSubmit(handleSubmitContacts)}
        className="bg-zinc-800 max-w-[546px] w-full mx-auto p-9 rounded-md flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <strong className="font-bold text-2xl">Define your contacts</strong>
          <span className="text-gray-200">
            Define your networks so you can be found.
          </span>
        </div>

        <MultiStep currentStep={2} size={3} />
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            Email
            <TextInput.Root>
              <TextInput.Input
                hasError={!!errors.email}
                placeholder="johndoe@email.com"
                {...register('email')}
              />
              <TextInput.MessageError message={errors.email?.message} />
            </TextInput.Root>
          </label>

          <label className="flex flex-col gap-2">
            Github
            <TextInput.Root>
              <TextInput.Input
                placeholder="your-user"
                hasError={!!errors.github}
                {...register('github')}
              >
                <TextInput.Prefix prefix="https://github.com/" />
              </TextInput.Input>
              <TextInput.MessageError message={errors.github?.message} />
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
            />

            <Button title="Next" type="submit">
              <ArrowRight weight="bold" />
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
