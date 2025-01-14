import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { TableContentsType } from '@/components/common/tables/TableContent'

export type ColumnContentsType = TableContentsType[]

type ColumnProps = {
  summary: ReactNode
}

const Column = ({ summary, children }: PropsWithChildren<ColumnProps>) => {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (!(detailsRef.current && detailsRef)) {
      return
    }
    detailsRef.current.addEventListener('toggle', handleToggle)
    return () => {
      if (!(detailsRef.current && detailsRef)) {
        return
      }
      detailsRef.current.removeEventListener('toggle', handleToggle)
    }
  }, [])

  return (
    <details className="w-full" ref={detailsRef}>
      <summary className="mb-[10px] flex w-full cursor-pointer justify-between p-[16px]">
        {summary}
        {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </summary>
      {children}
    </details>
  )
}

export default Column
