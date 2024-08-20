import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { DefaultSeo } from 'next-seo'

import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'pt_BR',
          url: 'https://ecard.immap.org/',
          title: 'Generate your iMMAP visit card fast and easy',
          siteName: 'iMMAP&apos;s Visit Card Generator',
          images: [
            {
              url: 'https://res.cloudinary.com/dhexs29hy/image/upload/v1679169163/open-graph_rlqt5j.png',
              alt: 'Initial page of iMMAP Visit Card Generator',
              width: 654,
              height: 761,
            },
          ],
        }}
      />
      <Component {...pageProps} />
      <ToastContainer theme="dark" />
    </>
  )
}
