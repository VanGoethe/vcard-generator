import { Button } from '@/components/Button'
import { NextSeo } from 'next-seo'
import React from 'react'
import { useRouter } from 'next/router'

import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'

const MicrosoftLogin = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [messageError, setMessageError] = React.useState(null as string | null)
  const router = useRouter()

  const { instance, accounts, inProgress } = useMsal()

  React.useEffect(() => {
    if (inProgress === InteractionStatus.None && accounts.length > 0) {
      router.push('/').catch(() => {})
    }
  }, [inProgress, accounts, router])

  const handleLogin = () => {
    setIsSubmitting(true)
    instance
      .loginRedirect({
        scopes: ['User.Read'],
      })
      .then((response: any) => {
        console.log(response, 'response')
        // save resopnse to local storage
        localStorage.setItem('user', JSON.stringify(response))
        setIsSubmitting(false)
      })
      .catch((e: any) => {
        console.error(e, 'eeeeeeee')
        // if (location.get('error') === 'account_not_found') {
        setMessageError(
          'Your account is not registered, Please contact your administrator',
        )
        setIsSubmitting(false)
      })
  }

  return (
    <div className="bg-zinc-900 w-full h-screen flex justify-center items-center">
      <NextSeo
        title="Login | iMMAP Visit Card Generator"
        description="Hello, iMMAP Team! Let’s Verify Your Account!"
      />

      <form className="bg-zinc-800 max-w-[546px] w-full mx-auto p-9 rounded-md flex flex-col gap-6">
        {messageError && (
          <div className="bg-red-800 max-w-[546px] text-red w-full mx-auto px-2 py-1 flex flex-col gap-6">
            <p className="font-light text-sm">
              Your account is not registered, Please contact your administrator
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 text-center">
          <strong className="font-bold text-2xl">
            <span>🔒 Account Verification Required!</span>
          </strong>
          <br />
          <span className="text-gray-200">
            <span>Hello, team! Let’s Verify Your Account! </span>
          </span>
        </div>

        <div>
          <Button
            title="Login with Immap account"
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleLogin}
          />
        </div>
      </form>
    </div>
  )
}

export default MicrosoftLogin
