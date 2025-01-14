import { useShopsList } from '@/api/generated/hooks'
import { PaginatedAdminShopResList, ShopsListParams } from '@/api/generated/types'
import useAllList, { UseAllListProps } from '@/hooks/query/useAllList'

type UseAllShopsListProps = Omit<UseAllListProps<PaginatedAdminShopResList, ShopsListParams>, 'queryFn'>

const useShopsListAll = (props?: UseAllShopsListProps) => {
  const { queryParams, enabled } = props || {}
  const { list: shopsList, count: shopsCount, ...res } = useAllList({ queryFn: useShopsList, queryParams, enabled })
  return { shopsList, shopsCount, ...res }
}

export default useShopsListAll
