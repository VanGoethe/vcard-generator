import {
  ComponentPropsWithoutRef,
  forwardRef,
  ReactNode,
  // useEffect,
  // useState,
} from 'react'
import clsx from 'clsx'
// import { countries } from 'countries-list'

export interface TextInputPhoneNumberRootProps
  extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  className?: string
}

const TextInputPhoneNumberRoot = forwardRef<
  HTMLDivElement,
  TextInputPhoneNumberRootProps
>(({ children, className }: TextInputPhoneNumberRootProps, ref) => {
  return (
    <div ref={ref} className={`${className} w-full flex flex-col gap-1`}>
      {children}
    </div>
  )
})

TextInputPhoneNumberRoot.displayName = 'TextInputPhoneNumber.Root'

interface TextInputPhoneNumberProps extends ComponentPropsWithoutRef<'input'> {
  children?: ReactNode
  hasError?: boolean
  className?: string
  setCode?: any
}

const TextInputPhoneNumberInput = forwardRef<
  HTMLInputElement,
  TextInputPhoneNumberProps
>(
  (
    {
      children,
      hasError,
      className,
      setCode,
      ...props
    }: TextInputPhoneNumberProps,
    ref,
  ) => {
    // const [countryCode, setCountryCode] = useState('')
    // const countryCodes = Object.values(countries).map((country) => ({
    //   value: country.phone,
    //   label: `${country.name} (+${country.phone})`,
    // }))

    // useEffect(() => {
    //   fetch('https://ipapi.co/json/')
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setCountryCode(data.country_calling_code)
    //       setCode(data.country_calling_code)
    //     })
    // }, [])

    return (
      <div
        className={clsx(
          `focus-within:ring-1 ${className} flex items-baseline bg-zinc-900 h-12 rounded-md px-4 py-3 min-w-full`,
          {
            'focus-within:ring-red-500': hasError,
            'focus-within:ring-green-600': !hasError,
          },
        )}
      >
        {/* <select
          className="w-20 h-full bg-transparent focus:outline-none placeholder:text-gray-500"
          defaultValue={countryCode}
        >
          {countryCodes.map((code, index) => (
            <option key={index} value={code.value.join(',')}>
              {code.label}
            </option>
          ))}
        </select> */}
        {children}
        <input
          ref={ref}
          className="w-full h-full bg-transparent focus:outline-none placeholder:text-gray-500 "
          {...props}
          type="number"
        />
      </div>
    )
  },
)

TextInputPhoneNumberInput.displayName = 'TextInputPhoneNumber.Input'

interface TextInputPhoneNumberMessageErrorProps {
  message: string | undefined
}

function TextInputPhoneNumberMessageError({
  message,
}: TextInputPhoneNumberMessageErrorProps) {
  return <span className="text-red-500 text-xs">{message}</span>
}

TextInputPhoneNumberMessageError.displayName =
  'TextInputPhoneNumber.MessageError'

interface TextInputPhoneNumberIconProps {
  prefix: string
}

function TextInputPhoneNumberPrefix({ prefix }: TextInputPhoneNumberIconProps) {
  return (
    <span className="text-zinc-400 flex items-center justify-center">
      {prefix}
    </span>
  )
}

TextInputPhoneNumberPrefix.displayName = 'TextInputPhoneNumber.Prefix'

export const TextInputPhoneNumber = {
  Root: TextInputPhoneNumberRoot,
  Input: TextInputPhoneNumberInput,
  Prefix: TextInputPhoneNumberPrefix,
  MessageError: TextInputPhoneNumberMessageError,
}
