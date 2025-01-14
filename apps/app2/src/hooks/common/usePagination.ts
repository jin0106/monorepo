import { useState } from 'react'
import { flushSync } from 'react-dom'
import { QueryKey, UseQueryResult } from '@tanstack/react-query'

const usePagination = <TResponseType>(
  callBackHook: (params: {
    limit: number
    offset: number
  }) => UseQueryResult<TResponseType | undefined, unknown> & { queryKey: QueryKey },
  params: Record<string, any> | undefined,
  itemCountPerPage: number,
  initCurrentPage: number
) => {
  const [currentPage, setCurrentPage] = useState(initCurrentPage)
  const hookResult = callBackHook({
    ...params,
    limit: itemCountPerPage,
    offset: (currentPage - 1) * itemCountPerPage
  })

  const handlePageChange = (pageNumber: number) => {
    flushSync(() => {
      setCurrentPage(pageNumber)
    })
    hookResult.refetch()
  }

  return {
    ...hookResult,
    handlePageChange,
    itemCountPerPage,
    currentPage
  }
}

export default usePagination
