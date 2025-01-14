import { PropsWithChildren } from 'react'
import Subtitle from '../typography/Subtitle'

type TableHeaderProps = {
  title?: string
  rightSide?: JSX.Element
  leftSide?: JSX.Element
}

const TableHeader = ({ title, children, rightSide, leftSide }: PropsWithChildren<TableHeaderProps>) => {
  return (
    <>
      <Subtitle styleClass={leftSide || rightSide ? 'flex justify-between items-end' : ''}>
        {leftSide && <div>{leftSide}</div>}
        {title && title}
        {rightSide && <div>{rightSide}</div>}
      </Subtitle>

      <div className="divider mt-2"></div>

      <div className="h-full w-full bg-base-100 pb-6">{children}</div>
    </>
  )
}

export default TableHeader
