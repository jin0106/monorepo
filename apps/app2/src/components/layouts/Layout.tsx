import React, { PropsWithChildren } from 'react'
import Head from 'next/head'
import { MODAL_PORTAL_ID } from '@/components/common/modal'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="drawer bg-base-200">
      <Head>
        <link rel="icon" href="/newbigo-favicon-72x72.png" type="image/x-icon" />
        <title>Neubie-order Admin</title>
      </Head>
      {children}
      <div id={MODAL_PORTAL_ID} />
      <div id="pullToRefresh" className="fixed bottom-0 z-[110]" />
    </div>
  )
}

export default Layout
