import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { ToastContainer } from 'react-toastify'
import { DefaultSeo } from 'next-seo'

import { publicAppUrl } from '@/env'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

const openGraphSiteUrl = `${publicAppUrl.replace(/\/$/, '')}/`

const MsalProviderWrapper = dynamic(
  () =>
    import('@/components/MsalProviderWrapper').then(
      (m) => m.MsalProviderWrapper,
    ),
  { ssr: false },
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MsalProviderWrapper>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'pt_BR',
          url: openGraphSiteUrl,
          title: 'Generate your iMMAP visit card fast and easy',
          siteName: 'iMMAP Visit Card Generator',
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
    </MsalProviderWrapper>
  )
}
