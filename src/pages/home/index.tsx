import { useEffect, useState } from 'react'
import { GenerateCardForm } from './components/GenerateCardFom/'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'

export default function Home() {
  const route = useRouter()
  const [haveAccessToken, setHaveAccessToken] = useState(false)
  let count = 1
  useEffect(() => {
    const url = window.location.href // Get the current URL
    const urlParams = new URLSearchParams(url.split('#')[1]) // Split by "#" and get the part after it

    // Get the value of the "client_info" parameter
    const clientInfo = urlParams.get('client_info')

    // Parse the client_info value
    if (clientInfo) {
      const clientInfoParsed = JSON.parse(atob(clientInfo))
      console.log(clientInfoParsed)
      // Save the client_info to the local storage
      // localStorage.setItem('client_info', JSON.stringify(clientInfoParsed))
    } else {
      console.log('No client_info found')
      route.push('/auth')
      if (count === 1) {
        toast('Account not verified! Please verify your account first.', {
          type: 'error',
        })
        count++
      }
      // redirect to the login page ('/auth/microsoft')
      // window.location.href = '/auth'
    }
    setHaveAccessToken(true)
  }, [])

  return (
    <div className="bg-zinc-900 w-full h-screen flex justify-center items-center">
      {haveAccessToken ? ( // If the access token is available show the GenerateCardForm component else show loading...
        <GenerateCardForm />
      ) : (
        'Loading...'
      )}
    </div>
  )
}
