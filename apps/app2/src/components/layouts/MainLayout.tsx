import React, { FC, ReactNode } from 'react'
import AndroidPullToRefreshSpinner from '@/components/layouts/AndroidPullToRefreshSpinner'
import Header from '@/components/layouts/Header'
import LeftSideBar from '@/components/layouts/LeftSideBar'
import { PullToRefreshStatusEnum } from '@/hooks/common/usePullToRefresh'

type MainLayoutProps = {
  children?: ReactNode
  title?: ReactNode
  pullToRefreshStatus?: PullToRefreshStatusEnum
}
const MainLayout: FC<MainLayoutProps> = ({ title, children, pullToRefreshStatus }) => {
  return (
    <>
      <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-200">
        <Header title={title} />
        <div className="flex min-h-[4rem] w-full items-center justify-center" />
        <AndroidPullToRefreshSpinner pullToRefreshStatus={pullToRefreshStatus} />
        <main className="h-[calc(100%_-_6rem)] overflow-auto bg-base-200 px-6 pt-6">{children}</main>
      </div>
      <LeftSideBar />
    </>
  )
}

export default MainLayout
