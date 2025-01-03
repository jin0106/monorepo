import { QueryClient } from '@tanstack/query-core'
import { ErrorType } from '@/api/mutator/custom-instance'

// 뉴비고와 동일한 방식으로 alert 처리
export const onErrorAlert = (error: ErrorType<unknown>, errorMsg?: string) => {
  if (errorMsg) {
    alert(errorMsg)
  } else {
    if (!error || !error?.response?.data) return
    const data = error.response.data

    const msg = Array.isArray(data) ? data[0] : data
    const alertMsg = typeof msg === 'string' ? msg : JSON.stringify(msg)
    alert(alertMsg)
  }
}

const refreshByQueryKey = ({
  queryClient,
  refetchQueryKeys
}: {
  queryClient: QueryClient
  refetchQueryKeys: unknown[][]
}) => {
  return Promise.all(
    refetchQueryKeys.map((queryKey) => {
      return queryClient.invalidateQueries(queryKey)
    })
  )
}

export const ApiUtils = {
  refreshByQueryKey,
  onErrorAlert
}
