import { PropsWithChildren } from 'react'
import Column from '@/components/common/tables/Column'
import TableContent from '@/components/common/tables/TableContent'
import TableHeader from '@/components/common/tables/TableHeader'
import TablePagenation from '@/components/common/tables/TablePagenation'

const Table = ({ children }: PropsWithChildren) => {
  return <section className="card mt-6 w-full overflow-x-auto bg-base-100 p-6 shadow-xl">{children}</section>
}

export default Table

Table.Header = TableHeader
Table.Content = TableContent
Table.Pagenation = TablePagenation
Table.Column = Column
