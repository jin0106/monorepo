import { QueryKey, UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import { customInstance, ErrorType } from '@/api/mutator/custom-instance'

export type PaginatedGenericResList<TResponse> = {
  count?: number
  next?: string | null
  previous?: string | null
  results?: TResponse[]
}
const getOffsetFromURL = (url: string) => {
  const urlObj = new URL(url)
  const params = new URLSearchParams(urlObj.search)

  const offset = params.get('offset')

  // offset이 없거나 숫자가 아닌 경우 null을 반환합니다.
  if (!offset || isNaN(+offset)) {
    return null
  }

  return +offset // +를 사용하여 문자열을 숫자로 변환합니다.
}

type SecondParameter<TResponse extends (...args: any) => any> = TResponse extends (config: any, args: infer P) => any
  ? P
  : never

type UseInfinityScrollProps<TResponse, TParams> = {
  queryKey: QueryKey
  queryFn(
    params?: TParams,
    options?: SecondParameter<typeof customInstance>,
    signal?: AbortSignal
  ): Promise<PaginatedGenericResList<TResponse>>
  itemPerPage: number
  params?: TParams
}

/**
 * 추후 백엔드에서 next, previous 를 page 로 변경하면 orval 제너레이트 된 useInfinityScroll로 대체합니다.
 *
 */
const useInfinityScroll = <TResponse, TParams>(
  { queryKey, queryFn, itemPerPage, params }: UseInfinityScrollProps<TResponse, TParams>,
  options?: {
    query?: UseInfiniteQueryOptions<TResponse, ErrorType<unknown>, TResponse>
  }
) => {
  const result = useInfiniteQuery(
    queryKey,
    ({ pageParam = 0 }) => queryFn({ limit: itemPerPage, offset: pageParam * itemPerPage, ...params } as TParams),
    {
      ...(options?.query as any),
      getNextPageParam: (lastPage) => {
        if (!lastPage.next) {
          return
        }
        const nextOffset = getOffsetFromURL(lastPage.next)
        if (!nextOffset) {
          return
        }
        return nextOffset / itemPerPage
      }
    }
  )

  return result
}

export default useInfinityScroll
