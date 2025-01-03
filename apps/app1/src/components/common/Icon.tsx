import { Suspense, lazy, useMemo } from 'react'
import classNames from 'classnames'
import { IconMap } from '@/constants/iconMap'
import { IconNamesEnum } from '@/constants/iconNames.enum'

type IconProps = {
  name: IconNamesEnum
  className?: string
  onClick?(): void
}

const Icon = ({ name, className, onClick }: IconProps) => {
  const IconComponent = useMemo(() => lazy(IconMap[name]), [name])
  return (
    <Suspense fallback={<div className={className ? classNames(className) : 'h-[24px] w-[24px]'} />}>
      <IconComponent className={className ? classNames(className) : 'h-[24px] w-[24px]'} onClick={() => onClick?.()} />
    </Suspense>
  )
}

export default Icon
