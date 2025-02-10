import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { QueryCache, QueryClient } from '@tanstack/query-core'
import { Hydrate, QueryClientProvider } from '@tanstack/react-query'
import { NextPage } from 'next'
import { appWithTranslation } from 'next-i18next'
import { isAndroid, isIOS } from 'react-device-detect'
import Layout from '@/components/layouts/Layout'
import { DeployEnvironmentEnum } from '@/constants/deployEnvironment.enum'
import AuthContainer from '@/containers/common/AuthContainer'
import NativeBridgeContainer, { nativeBridgeSetup } from '@/containers/common/NativeBridgeContainer'
import type { AppProps } from 'next/app'
import 'react-tooltip/dist/react-tooltip.css'
import '../styles/globals.css'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export const isServer = typeof window === 'undefined'
export const isInApp = () => !isServer && navigator?.userAgent?.indexOf('neubility-app') !== -1

const ReactQueryDevtoolsProduction = React.lazy(() =>
  // eslint-disable-next-line import/extensions
  import('@tanstack/react-query-devtools/build/lib/index.prod.js').then((d) => ({
    default: d.ReactQueryDevtools
  }))
)

// native bridge 설정
if (isIOS || isAndroid) {
  nativeBridgeSetup()
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const queryCache = new QueryCache()
  const [showDevtools, setShowDevtools] = useState(false)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache,
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 0,
            retryDelay: 300
          }
        }
      })
  )

  useEffect(() => {
    if (process.env.PLATFORM_ENV !== DeployEnvironmentEnum.Production) {
      setShowDevtools(true)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContainer.Provider>
        <NativeBridgeContainer.Provider>
          <Hydrate state={pageProps && pageProps.dehydratedState}>
            {showDevtools && (
              <React.Suspense fallback={null}>
                <ReactQueryDevtoolsProduction position="bottom-right" />
              </React.Suspense>
            )}
            <div>1tes1t</div>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
        </NativeBridgeContainer.Provider>
      </AuthContainer.Provider>
    </QueryClientProvider>
  )
}

export default appWithTranslation(App)
