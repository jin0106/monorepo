import { FC, ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useSideBar from '@/hooks/layouts/useSideBar'

type SideMultiMenuProps = {
  icon: ReactNode
  title: string

  subMenu: { icon?: ReactNode; title: string; link: string }[]
}

const SideMultiMenu: FC<SideMultiMenuProps> = ({ icon, title, subMenu }) => {
  const { isExpanded, toggleExpanded } = useSideBar()
  const pathname = usePathname()
  return (
    <li className="text-base-content">
      <div className="flex-col">
        <div className="flex w-full justify-between" onClick={toggleExpanded}>
          <div className="flex">
            {icon}
            <span className="ml-2">{title}</span>
          </div>
          <ChevronDownIcon
            className={`delay-400 float-right mt-1 h-5 w-5 transition-all duration-500 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
        <div className={`w-full ${isExpanded ? '' : 'hidden'}`}>
          <ul className="menu menu-compact pl-3">
            {subMenu.map((menu, idx) => {
              return (
                <li key={idx}>
                  <Link href={menu?.link}>
                    {menu?.icon && menu.icon}
                    {menu?.title}
                    {pathname === menu?.link && (
                      <span
                        className="absolute inset-y-0 left-0 w-1 rounded-br-md rounded-tr-md bg-info "
                        aria-hidden="true"></span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </li>
  )
}

export default SideMultiMenu
