import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { TextInput } from '../TextInput'
import { MultiStep } from '../MultiStep'
import { Button } from '../Button'

import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'

interface DescribeStepProps {
  navigateTo: (step: 'describeStep' | 'socialStep' | 'customStep') => void
}

const describeStepSchema = z.object({
  username: z
    .string()
    .regex(/^([a-z\d\-]+)$/i, {
      message: "O username deve conter letras e numeros e separação por '-'.",
    })
    .refine((username) => username.trim().length > 0, {
      message: 'Você deve informar o username.',
    }),
  name: z.string().refine((fullName) => fullName.trim().length > 0, {
    message: 'Você deve informar o nome completo.',
  }),
  description: z
    .string()
    .refine((description) => description.trim().length > 0, {
      message: 'Você deve informar a descrição.',
    }),
})

type DescribeStepInput = z.infer<typeof describeStepSchema>

export function DescribeStep({ navigateTo }: DescribeStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<DescribeStepInput>({
    resolver: zodResolver(describeStepSchema),
  })

  async function handleSubmitDescribe(data: DescribeStepInput) {
    try {
      await api.get(`/users/${data.username}`)

      const describeInfo = JSON.stringify(data)
      sessionStorage.setItem('@generateCard:register', describeInfo)

      navigateTo('socialStep')
    } catch (error) {
      toast('Username already registered', {
        type: 'error',
      })
      setFocus('username')
    }
  }

  useEffect(() => {
    const hasDescribeInfo = sessionStorage.getItem('@generateCard:register')

    if (hasDescribeInfo) {
      const DescribeInfoParsed = JSON.parse(hasDescribeInfo)

      setValue('username', DescribeInfoParsed.username)
      setValue('name', DescribeInfoParsed.name)
      setValue('description', DescribeInfoParsed.description)
    }
  }, [setValue])

  return (
    <form
      onSubmit={handleSubmit(handleSubmitDescribe)}
      className="bg-zinc-800 max-w-[546px] w-full mx-auto p-9 rounded-md flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <strong className="font-bold text-2xl">
          Welcome to Generate Card!
        </strong>
        <span className="text-gray-200">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. In unde quae
          nisi tempore labore earum.
        </span>
      </div>

      <MultiStep currentStep={1} size={3} />
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          Username
          <TextInput.Root>
            <TextInput.Input
              placeholder="john-doe"
              hasError={!!errors.username}
              {...register('username')}
            />
            <TextInput.MessageError message={errors.username?.message} />
          </TextInput.Root>
        </label>

        <label className="flex flex-col gap-2">
          Full name
          <TextInput.Root>
            <TextInput.Input
              placeholder="John Doe"
              hasError={!!errors.name}
              {...register('name')}
            />
            <TextInput.MessageError message={errors.name?.message} />
          </TextInput.Root>
        </label>

        <label className="flex flex-col gap-2">
          Description
          <textarea
            placeholder="Description example"
            className="bg-zinc-900 w-full min-h-[108px] max-h-[200px] px-4 py-3 outline-none resize-y rounded-md placeholder:text-zinc-500"
            {...register('description')}
          />
        </label>

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
  )
}
