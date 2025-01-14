import { FC, ReactNode } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type SideSingleMenuProps = {
  icon: ReactNode
  title: string
  link: string
}

const SideSingleMenu: FC<SideSingleMenuProps> = ({ icon, title, link }) => {
  const pathname = usePathname()
  return (
    <Link key={link} href={link}>
      <li>
        <span
          className={classNames(
            { 'bg-base-200 font-semibold': pathname === link },
            {
              'font-normal': pathname !== link
            }
          )}>
          {icon}
          {title}
          {pathname === link && (
            <span className="absolute inset-y-0 left-0 w-1 rounded-br-md rounded-tr-md bg-info " aria-hidden="true" />
          )}
        </span>
      </li>
    </Link>
  )
}

export default SideSingleMenu
