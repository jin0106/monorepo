import { ReactNode } from 'react'
import SideBarToggle from '@/components/layouts/SideBarToggle'

type HeaderProps = {
  title?: ReactNode
}
const Header = ({ title }: HeaderProps) => {
  return (
    <div className="navbar fixed top-0 z-10 flex h-[4rem] justify-between bg-base-100 shadow-md">
      <div className="px-[1rem]">
        <SideBarToggle />
        <h1 className="pl-[1rem] text-2xl font-semibold">{title}</h1>
      </div>
    </div>
  )
}

export default Header
