/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { customInstance } from '../mutator/custom-instance'
import type { NodeRes, PaginatedSiteResList, SitesListParams } from './types'
import type { ErrorType } from '../mutator/custom-instance'
import type {
  UseQueryOptions,
  UseInfiniteQueryOptions,
  QueryFunction,
  UseQueryResult,
  UseInfiniteQueryResult,
  QueryKey
} from '@tanstack/react-query'

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (config: any, args: infer P) => any ? P : never

export const nodesList = (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => {
  return customInstance<NodeRes[]>({ url: `/nodes/`, method: 'get', signal }, options)
}

export const getNodesListQueryKey = () => [`/nodes/`] as const

export const getNodesListInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof nodesList>>,
  TError = ErrorType<unknown>
>(options?: {
  query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof nodesList>>, TError, TData>
  request?: SecondParameter<typeof customInstance>
}): UseInfiniteQueryOptions<Awaited<ReturnType<typeof nodesList>>, TError, TData> & { queryKey: QueryKey } => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getNodesListQueryKey()

  const queryFn: QueryFunction<Awaited<ReturnType<typeof nodesList>>> = ({ signal }) =>
    nodesList(requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions }
}

export type NodesListInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof nodesList>>>
export type NodesListInfiniteQueryError = ErrorType<unknown>

export const useNodesListInfinite = <
  TData = Awaited<ReturnType<typeof nodesList>>,
  TError = ErrorType<unknown>
>(options?: {
  query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof nodesList>>, TError, TData>
  request?: SecondParameter<typeof customInstance>
}): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getNodesListInfiniteQueryOptions(options)

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey }

  query.queryKey = queryOptions.queryKey

  return query
}

export const getNodesListQueryOptions = <
  TData = Awaited<ReturnType<typeof nodesList>>,
  TError = ErrorType<unknown>
>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof nodesList>>, TError, TData>
  request?: SecondParameter<typeof customInstance>
}): UseQueryOptions<Awaited<ReturnType<typeof nodesList>>, TError, TData> & { queryKey: QueryKey } => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getNodesListQueryKey()

  const queryFn: QueryFunction<Awaited<ReturnType<typeof nodesList>>> = ({ signal }) =>
    nodesList(requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions }
}

export type NodesListQueryResult = NonNullable<Awaited<ReturnType<typeof nodesList>>>
export type NodesListQueryError = ErrorType<unknown>

export const useNodesList = <TData = Awaited<ReturnType<typeof nodesList>>, TError = ErrorType<unknown>>(options?: {
  query?: UseQueryOptions<Awaited<ReturnType<typeof nodesList>>, TError, TData>
  request?: SecondParameter<typeof customInstance>
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getNodesListQueryOptions(options)

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey }

  query.queryKey = queryOptions.queryKey

  return query
}

export const sitesList = (
  params?: SitesListParams,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<PaginatedSiteResList>({ url: `/sites/`, method: 'get', params, signal }, options)
}

export const getSitesListQueryKey = (params?: SitesListParams) => [`/sites/`, ...(params ? [params] : [])] as const

export const getSitesListInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof sitesList>>,
  TError = ErrorType<unknown>
>(
  params?: SitesListParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof sitesList>>, TError, TData>
    request?: SecondParameter<typeof customInstance>
  }
): UseInfiniteQueryOptions<Awaited<ReturnType<typeof sitesList>>, TError, TData> & { queryKey: QueryKey } => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getSitesListQueryKey(params)

  const queryFn: QueryFunction<Awaited<ReturnType<typeof sitesList>>> = ({ signal }) =>
    sitesList(params, requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions }
}

export type SitesListInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof sitesList>>>
export type SitesListInfiniteQueryError = ErrorType<unknown>

export const useSitesListInfinite = <TData = Awaited<ReturnType<typeof sitesList>>, TError = ErrorType<unknown>>(
  params?: SitesListParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof sitesList>>, TError, TData>
    request?: SecondParameter<typeof customInstance>
  }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getSitesListInfiniteQueryOptions(params, options)

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey }

  query.queryKey = queryOptions.queryKey

  return query
}

export const getSitesListQueryOptions = <TData = Awaited<ReturnType<typeof sitesList>>, TError = ErrorType<unknown>>(
  params?: SitesListParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof sitesList>>, TError, TData>
    request?: SecondParameter<typeof customInstance>
  }
): UseQueryOptions<Awaited<ReturnType<typeof sitesList>>, TError, TData> & { queryKey: QueryKey } => {
  const { query: queryOptions, request: requestOptions } = options ?? {}

  const queryKey = queryOptions?.queryKey ?? getSitesListQueryKey(params)

  const queryFn: QueryFunction<Awaited<ReturnType<typeof sitesList>>> = ({ signal }) =>
    sitesList(params, requestOptions, signal)

  return { queryKey, queryFn, ...queryOptions }
}

export type SitesListQueryResult = NonNullable<Awaited<ReturnType<typeof sitesList>>>
export type SitesListQueryError = ErrorType<unknown>

export const useSitesList = <TData = Awaited<ReturnType<typeof sitesList>>, TError = ErrorType<unknown>>(
  params?: SitesListParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof sitesList>>, TError, TData>
    request?: SecondParameter<typeof customInstance>
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getSitesListQueryOptions(params, options)

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey }

  query.queryKey = queryOptions.queryKey

  return query
}
