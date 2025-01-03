import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { createContainer } from 'unstated-next'
import {
  getSettlementsSummaryListQueryKey,
  getSitesListQueryKey,
  settlementsSummaryExportRetrieve,
  useSettlementsSummaryList
} from '@/api/generated/hooks'
import { SettlementsSummaryListParams } from '@/api/generated/types'
import { TableContentsType } from '@/components/common/tables/TableContent'
import { I18nNamespaceEnum } from '@/constants/i18n'
import useLocale from '@/hooks/common/useLocale'
import usePullToRefresh from '@/hooks/common/usePullToRefresh'
import { ApiUtils } from '@/utils/apiUtils'

const useSettlementHook = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Settlement])
  const { toUnitPriceByCurrency, toMonthName } = useLocale()
  const queryClient = useQueryClient()
  const [searchParam, setSearchParam] = useState<SettlementsSummaryListParams>()
  const [shopName, setShopName] = useState<string>()
  const { data: settlementList } = useSettlementsSummaryList(searchParam || { shop: 0, year: 0 }, {
    query: { enabled: !!searchParam }
  })

  const requestExcelExport = async (month: number, shop: number, year: number) => {
    const data = await settlementsSummaryExportRetrieve({ month, shop, year })
    data?.excel && window?.open(data.excel)
  }

  const settlementListContent: TableContentsType[] = useMemo(() => {
    return (
      settlementList?.map((settlement) => {
        return {
          row: [
            {
              content: `${toMonthName(settlement.month)}`,
              key: 'month'
            },
            {
              content: shopName,
              key: 'shopName'
            },
            {
              content: `${t('settlement:orders_count', { n: settlement.numOrders })}`,
              key: 'orderCount'
            },
            {
              // TODO: change to: toUnitPriceByCurrency(settlement?.settlementPrice, settlement?.currency)
              content: toUnitPriceByCurrency(settlement.settlementPrice),
              key: 'settlementAmount'
            },
            {
              content: (
                <button
                  className="btn-md btn"
                  onClick={() => {
                    if (!settlement.month || !searchParam?.shop || !searchParam?.year) return
                    requestExcelExport(settlement.month, searchParam.shop, searchParam.year)
                  }}>
                  {t('settlement:download_details')}
                </button>
              ),
              key: 'detailHistory'
            }
          ]
        }
      }) || []
    )
  }, [settlementList])

  const pullToRefreshCallback = useCallback(async () => {
    await ApiUtils.refreshByQueryKey({
      queryClient: queryClient,
      refetchQueryKeys: [
        [...getSettlementsSummaryListQueryKey(searchParam || { shop: 0, year: 0 })],
        [...getSitesListQueryKey()]
      ]
    })
  }, [searchParam])

  const { pullToRefreshStatus } = usePullToRefresh(pullToRefreshCallback)

  return {
    settlementListContent,
    searchParam,
    setSearchParam,
    setShopName,
    pullToRefreshStatus
  }
}

const SettlementContainer = createContainer(useSettlementHook)

export default SettlementContainer
