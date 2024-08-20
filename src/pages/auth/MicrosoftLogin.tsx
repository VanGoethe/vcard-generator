import { Button } from '@/components/Button'
import { NextSeo } from 'next-seo'
import React from 'react'

import { useMsal, useAccount, MsalProvider } from '@azure/msal-react'

import { PublicClientApplication } from '@azure/msal-browser'

const msalConfig = {
  auth: {
    clientId: '73c69515-fadf-479e-91fa-fdc2bcebfb9e',
    authority:
      'https://login.microsoftonline.com/f6f70f1b-2a2d-4f30-852a-64b8ce0c19d7',
    redirectUri: 'http://localhost:3000',
  },
}

const msalInstance = new PublicClientApplication(msalConfig)

type Props = {}

const MicrosoftLogin = (props: Props) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [messageError, setMessageError] = React.useState(null as string | null)

  //   const location = useSearchParams()

  const { instance, accounts } = useMsal()
  const account = useAccount(accounts[0] || {})
  console.log(account)

  const handleLogin = () => {
    setIsSubmitting(true)
    instance
      .loginRedirect({
        scopes: ['User.Read'],
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
    <MsalProvider instance={msalInstance}>
      <div className="bg-zinc-900 w-full h-screen flex justify-center items-center">
        <NextSeo
          title="Home | iMMAP Visit Card Generator"
          description="Welcome to iMMAP's Visit Card Generator!"
        />

        <form className="bg-zinc-800 max-w-[546px] w-full mx-auto p-9 rounded-md flex flex-col gap-6">
          {messageError && (
            <div className="bg-red-800 max-w-[546px] text-red w-full mx-auto px-2 py-1 flex flex-col gap-6">
              <p className="font-light text-sm">
                Your account is not registered, Please contact your
                administrator
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <strong className="font-bold text-2xl">
              <span>Welcome to iMMAP&apos;s Visit Card Generator!</span>
            </strong>
            <span className="text-gray-200">
              <span>We need some information to create your visit card.</span>
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
    </MsalProvider>
  )
}

export default MicrosoftLogin
