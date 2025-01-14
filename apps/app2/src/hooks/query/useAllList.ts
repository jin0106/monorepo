import { QueryKey, UseQueryResult } from '@tanstack/react-query'
import { FieldValues } from 'react-hook-form'

export interface PaginatedResDataType<TDataSourceElement> {
  count?: number
  next?: string | null
  previous?: string | null
  results?: TDataSourceElement[]
}

export interface QueryPageParams extends FieldValues {
  limit?: number
  offset?: number
}

export interface UseAllListProps<
  TResElement extends FieldValues,
  TQueryParams extends QueryPageParams = QueryPageParams
> {
  queryFn: (
    queryParams: TQueryParams,
    options?: { query: { enabled?: boolean } } | undefined
  ) => UseQueryResult<PaginatedResDataType<TResElement> | undefined, unknown> & { queryKey: QueryKey }
  queryParams?: TQueryParams
  enabled?: boolean
}

const useAllList = <TResElement extends FieldValues, TQueryParams extends QueryPageParams = QueryPageParams>({
  queryFn,
  queryParams,
  enabled
}: UseAllListProps<TResElement, TQueryParams>) => {
  const { data, ...response } = queryFn({ offset: 0, limit: 99999, ...(queryParams ?? {}) } as TQueryParams, {
    query: { enabled }
  })

  return {
    list: data?.results || [],
    count: data?.count || 0,
    ...response
  }
}

export default useAllList
