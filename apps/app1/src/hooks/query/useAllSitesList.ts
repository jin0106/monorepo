import { useSitesList } from '@/api/generated/hooks'
import { PaginatedAdminSiteResList, SitesListParams } from '@/api/generated/types'
import useAllList, { UseAllListProps } from '@/hooks/query/useAllList'

type UseAllSitesListProps = Omit<UseAllListProps<PaginatedAdminSiteResList, SitesListParams>, 'queryFn'>

const useAllSitesList = (props?: UseAllSitesListProps) => {
  const { queryParams, enabled } = props || {}
  const { list: sitesList, count: sitesCount, ...res } = useAllList({ queryFn: useSitesList, queryParams, enabled })
  return { sitesList, sitesCount, ...res }
}

export default useAllSitesList
