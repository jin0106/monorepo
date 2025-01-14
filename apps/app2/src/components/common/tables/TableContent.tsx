import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

export type TableColumnType = {
  title: ReactNode
  key: string
  contentClassName?: string
}

export type TableContentsType = {
  row: {
    content: ReactNode
    key: string
  }[]
}

type TableContentProps = {
  columns: TableColumnType[]
  contents?: TableContentsType[]
  emptyElement?: ReactNode
  emptyWrapperClassName?: string
}

const TableContent = ({ columns, contents, emptyElement, emptyWrapperClassName }: TableContentProps): JSX.Element => {
  return (
    <>
      <table className="table w-full">
        <thead>
          <tr>
            {columns.map((column) => {
              return (
                <th className="max-w-[100px]" key={column.key}>
                  <div className="flex flex-col items-center normal-case">{column.title}</div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {contents &&
            contents.length > 0 &&
            contents.map((content, index) => {
              return (
                <tr key={index} className="active">
                  {columns.map((column, index) => {
                    const rowColumnMatchItem = content.row.find((item) => item.key === column.key)
                    return (
                      <td key={index}>
                        <div className={twMerge(columns[index]?.contentClassName, 'flex flex-col items-center')}>
                          {rowColumnMatchItem ? rowColumnMatchItem.content : ''}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
      {contents?.length === 0 && emptyElement && (
        <div
          className={ComponentUtils.cn(
            'rounded-b-box flex h-[520px] w-full items-center justify-center bg-base-300',
            emptyWrapperClassName
          )}>
          {emptyElement}
        </div>
      )}
    </>
  )
}

export default TableContent
