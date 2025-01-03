import Pagination from 'react-js-pagination'

type TablePagenationProps = {
  onPageChange(pageNumber: number): void
  // onPrevClick(): void
  // onNextClick(): void
  totalCount: number
  pagePerCount: number
  currentPage: number
  // hasNext: boolean
}

const TablePagenation = ({ totalCount, onPageChange, pagePerCount, currentPage }: TablePagenationProps) => {
  return (
    <div className="flex w-full justify-center py-[20px]">
      <Pagination
        innerClass="btn-group"
        itemClass="btn btn-sm"
        activeClass="btn btn-sm btn-active"
        disabledClass="btn btn-sm btn-disabled"
        itemsCountPerPage={pagePerCount}
        pageRangeDisplayed={5}
        totalItemsCount={totalCount}
        onChange={onPageChange}
        activePage={currentPage}
      />
    </div>
  )
}

export default TablePagenation
