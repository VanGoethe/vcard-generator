import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AxiosError } from 'axios'
import { api } from '@/lib/axios'
import { NextSeo } from 'next-seo'

import { TextInput } from '@/components/TextInput'
import { MultiStep } from '@/components/MultiStep'
import { Button } from '@/components/Button'
import { toast } from 'react-toastify'

import { ArrowRight } from 'phosphor-react'
import { useRouter } from 'next/router'

interface DescribeStepProps {
  navigateTo: (step: 'describeStep' | 'contactsStep' | 'customStep') => void
}

const describeStepSchema = z.object({
  fullname: z
    .string({
      required_error: 'You need to provide your full name.',
    })
    .max(191, { message: 'You have reached the maximum character size.' })
    .refine((fullname) => fullname.trim().length > 0, {
      message: 'You need to provide your full name.',
    })
    .transform((fullname) => fullname.toLowerCase().replace(/\//g, '')),
  // middlename: z
  //   .string({
  //     required_error: 'You need to provide your middle name.',
  //   })
  //   .max(191, { message: 'You have reached the maximum character size.' })
  //   .refine((middlename) => middlename.trim().length > 0, {
  //     message: 'You need to provide your middle name.',
  //   })
  //   .transform((middlename) => middlename.toLowerCase().replace(/\//g, '')),
  // lastname: z
  //   .string({
  //     required_error: 'You need to provide your last name.',
  //   })
  //   .max(191, { message: 'You have reached the maximum character size.' })
  //   .refine((lastname) => lastname.trim().length > 0, {
  //     message: 'You need to provide your last name.',
  //   })
  //   .transform((lastname) => lastname.toLowerCase().replace(/\//g, '')),
  jobtitle: z
    .string({
      required_error: 'You need to provide the job title.',
    })
    .max(277, { message: 'You have reached the maximum character size.' })
    .refine((jobtitle) => jobtitle.trim().length > 0, {
      message: 'You need to provide the job title.',
    }),
})

type DescribeStepInput = z.infer<typeof describeStepSchema>

export function DescribeStep({ navigateTo }: DescribeStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    // control,
    formState: { errors, isSubmitting },
  } = useForm<DescribeStepInput>({
    resolver: zodResolver(describeStepSchema),
  })

  const [isEdit, setIsEdit] = useState(false)
  const router = useRouter()
  const { id } = router.query

  async function handleSubmitDescribe(data: DescribeStepInput) {
    try {
      await api.get(`/users/${data.fullname}`)

      const describeInfo = JSON.stringify(data)
      sessionStorage.setItem('@generateCard:describe', describeInfo)

      navigateTo('contactsStep')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          return toast('We had a problem proceeding, try again later!', {
            type: 'error',
          })
        }

        toast('fullname already registered.', {
          type: 'error',
        })
        setFocus('fullname')
      }
    }
  }

  async function handleEditDescribe(data: DescribeStepInput) {
    const describeInfo = JSON.stringify(data)
    sessionStorage.setItem('@generateCard:describe', describeInfo)

    navigateTo('contactsStep')
  }

  useEffect(() => {
    const hasDescribeInfo = sessionStorage.getItem('@generateCard:describe')

    if (id) {
      setIsEdit(true)
    }

    if (hasDescribeInfo) {
      const DescribeInfoParsed = JSON.parse(hasDescribeInfo)

      setValue('fullname', DescribeInfoParsed.fullname)
      // setValue('middlename', DescribeInfoParsed.middlename)
      // setValue('lastname', DescribeInfoParsed.lastname)
      setValue('jobtitle', DescribeInfoParsed.jobtitle)
    }
  }, [setValue, id])

  return (
    <>
      <NextSeo
        title="Home | iMMAP Visit Card Generator"
        description="Welcome to iMMAP's Visit Card Generator!"
      />

      <form
        onSubmit={
          isEdit
            ? handleSubmit(handleEditDescribe)
            : handleSubmit(handleSubmitDescribe)
        }
        className="bg-zinc-800 max-w-[546px] w-full mx-auto p-9 rounded-md flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2">
          <strong className="font-bold text-2xl">
            {isEdit ? (
              <span>iMMAP&apos;s Visit Card Generator</span>
            ) : (
              <span>Welcome to iMMAP&apos;s Visit Card Generator!</span>
            )}
          </strong>
          <span className="text-gray-200">
            {isEdit ? (
              <span>Update informations on your visit card.</span>
            ) : (
              <span>We need some information to create your visit card.</span>
            )}
          </span>
        </div>

        <MultiStep currentStep={1} size={2} />
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            Full name
            {/* {isEdit
              ? 'Field not editable'
              : 'Make sure you entered the correct full name'}
            ) */}
            <TextInput.Root>
              <TextInput.Input
                placeholder="John Doe"
                hasError={!!errors.fullname}
                {...register('fullname')}
                disabled={!!isEdit}
              />
              <TextInput.MessageError message={errors.fullname?.message} />
            </TextInput.Root>
          </label>

          {/* <label className="flex flex-col gap-2">
            Middle name
            <TextInput.Root>
              <TextInput.Input
                placeholder="alan"
                hasError={!!errors.middlename}
                {...register('middlename')}
              />
              <TextInput.MessageError message={errors.middlename?.message} />
            </TextInput.Root>
          </label>

          <label className="flex flex-col gap-2">
            Last name
            <TextInput.Root>
              <TextInput.Input
                placeholder="Doe"
                hasError={!!errors.lastname}
                {...register('lastname')}
              />
              <TextInput.MessageError message={errors.lastname?.message} />
            </TextInput.Root>
          </label> */}

          <label className="flex flex-col gap-2">
            Job title
            <TextInput.Root>
              <TextInput.Input
                placeholder="Frontend UI/UX developer at iMMAP inc."
                hasError={!!errors.jobtitle}
                {...register('jobtitle')}
              />
              <TextInput.MessageError message={errors.jobtitle?.message} />
            </TextInput.Root>
          </label>

          {/* <TextareaControl
            control={control as any}
            {...register('description')}
          /> */}

          <Button
            title="Next"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <ArrowRight weight="bold" />
          </Button>
        </div>
      </form>
    </>
  )
}
