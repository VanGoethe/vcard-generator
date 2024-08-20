import React from 'react'

import { MsalProvider } from '@azure/msal-react'

import { PublicClientApplication } from '@azure/msal-browser'
import MicrosoftLogin from './MicrosoftLogin'

const msalConfig = {
  auth: {
    clientId: '73c69515-fadf-479e-91fa-fdc2bcebfb9e',
    authority:
      'https://login.microsoftonline.com/f6f70f1b-2a2d-4f30-852a-64b8ce0c19d7',
    redirectUri: 'http://localhost:3001',
  },
}

const msalInstance = new PublicClientApplication(msalConfig)

type Props = {}

const Authentication = (props: Props) => {
  return (
    <MsalProvider instance={msalInstance}>
      <MicrosoftLogin />
    </MsalProvider>
  )
}

export default Authentication
