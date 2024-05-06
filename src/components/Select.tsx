import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react'
import clsx from 'clsx'
import moment from 'moment-timezone'

export interface SelectRootProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode
  className?: string
}

const SelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  ({ children, className }: SelectRootProps, ref) => {
    return (
      <div ref={ref} className={`${className} w-full flex flex-col gap-1`}>
        {children}
      </div>
    )
  },
)

SelectRoot.displayName = 'Select.Root'

interface SelectProps extends ComponentPropsWithoutRef<'select'> {
  children?: ReactNode
  hasError?: boolean
  className?: string
}

const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, hasError, className, ...props }: SelectProps, ref) => {
    // const timezones = moment.tz.names().map((zone) => {
    //   const offset = moment.tz(zone).utcOffset()
    //   return {
    //     value: zone,
    //     label: `${zone} (GMT${offset >= 0 ? '+' : ''}${offset})`,
    //   }
    // })
    const timez = moment.tz.names()
    const grouped = {} as any
    console.log(moment.tz, 'timzone')

    timez.forEach((tz) => {
      const offsetInMinutes = moment.tz(tz).utcOffset()
      const offsetInHours = offsetInMinutes / 60
      if (!grouped[offsetInHours]) {
        grouped[offsetInHours] = {
          value: `${tz} (GMT${offsetInHours >= 0 ? '+' : ''}${offsetInHours})`,
          label: `${tz} (GMT${offsetInHours >= 0 ? '+' : ''}${offsetInHours})`,
        }
      }
    })

    const primaryTimezones = Object.values(grouped)
    // console.log(primaryTimezones, timezones)

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
        {children}
        <select
          ref={ref}
          className="w-full h-full bg-transparent focus:outline-none placeholder:text-gray-500 "
          {...props}
        >
          {primaryTimezones.map((timezone: any, index) => (
            <option key={index} value={timezone.value}>
              {timezone.label}
            </option>
          ))}
        </select>
      </div>
    )
  },
)

SelectInput.displayName = 'Select.Input'

interface SelectMessageErrorProps {
  message: string | undefined
}

function SelectMessageError({ message }: SelectMessageErrorProps) {
  return <span className="text-red-500 text-xs">{message}</span>
}

SelectMessageError.displayName = 'Select.MessageError'

interface SelectIconProps {
  prefix: string
}

function SelectPrefix({ prefix }: SelectIconProps) {
  return (
    <span className="text-zinc-400 flex items-center justify-center">
      {prefix}
    </span>
  )
}

SelectPrefix.displayName = 'Select.Prefix'

export const Select = {
  Root: SelectRoot,
  Input: SelectInput,
  Prefix: SelectPrefix,
  MessageError: SelectMessageError,
}
