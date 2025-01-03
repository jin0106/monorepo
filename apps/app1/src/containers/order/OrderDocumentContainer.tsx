import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { createContainer } from 'unstated-next'
import {
  getOrdersListQueryKey,
  ordersList,
  useOrdersCancelCreate,
  useOrdersOpenCoverUpdate,
  useOrdersStartDeliveryUpdate
} from '@/api/generated/hooks'
import { AdminOrderRes, DeliveryTypesEnum, OrdersListParams } from '@/api/generated/types'
import { I18nNamespaceEnum } from '@/constants/i18n'
import useInfinityScroll from '@/hooks/common/useInfinityScroll'
import useModal from '@/hooks/common/useModal'
import useNativeBridgeRoutingEffect from '@/hooks/common/useNativeBridgeRoutingEffect'
import usePullToRefresh from '@/hooks/common/usePullToRefresh'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import { ApiUtils } from '@/utils/apiUtils'

const eventManagerKey = 'OrderDocumentContainer'

const OrderDocumentContainer = createContainer(() => {
  const queryClient = useQueryClient()
  const { sitesList: sites } = useAllSitesList()
  // orders filter
  const [searchParam, setSearchParam] = useState<OrdersListParams>()

  const {
    data: ordersData,
    fetchNextPage: fetchNextOrderList,
    refetch: refetchOrdersList,
    isLoading: isRefetchingOrdersList
  } = useInfinityScroll<AdminOrderRes, OrdersListParams>(
    {
      queryKey: getOrdersListQueryKey(searchParam),
      queryFn: ordersList,
      itemPerPage: 12,
      params: {
        ...searchParam,
        deliveryType: DeliveryTypesEnum.DOCUMENT
      }
    },
    {
      query: {
        cacheTime: 0
      }
    }
  )

  useNativeBridgeRoutingEffect({
    key: eventManagerKey,
    onRefreshData: () => {
      refetchOrdersList()
    }
  })

  // 주문 취소
  const documentOrderCancelModalControls = useModal()
  const { mutate: mutateOrderCancel, isLoading: isLoadingOrderCancel } = useOrdersCancelCreate({
    mutation: {
      onSuccess: () => {
        documentOrderCancelModalControls.handleClose()
        refetchOrdersList()
      },
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })
  const handleCancelDocumentOrder = (order: AdminOrderRes) => {
    documentOrderCancelModalControls.handleOpen()
    documentOrderCancelModalControls.setModalData({ orderNumber: order?.orderNumber })
  }

  // 적재함 열기
  const handleOpenCargo = (order: AdminOrderRes) => {
    mutateOpenCover({ id: order?.id })
  }
  const { mutate: mutateOpenCover } = useOrdersOpenCoverUpdate({
    mutation: {
      onSuccess: () => refetchOrdersList(),
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })

  // 배달시작
  const handleStartDelivery = (order: AdminOrderRes) => {
    mutateStartDelivery({ id: order?.id })
  }
  const { mutate: mutateStartDelivery } = useOrdersStartDeliveryUpdate({
    mutation: {
      onSuccess: () => refetchOrdersList(),
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })

  const pullToRefreshCallback = useCallback(async () => {
    await ApiUtils.refreshByQueryKey({
      queryClient: queryClient,
      refetchQueryKeys: [[...getOrdersListQueryKey(searchParam)]]
    })
  }, [searchParam])

  const { pullToRefreshStatus } = usePullToRefresh(pullToRefreshCallback)

  return {
    sites,
    setSearchParam,
    ordersList: ordersData,
    fetchNextOrderList,
    isLoadingAfterCancel: isRefetchingOrdersList || isLoadingOrderCancel,
    handleOpenCargo,
    handleStartDelivery,
    mutateOrderCancel,
    pullToRefreshStatus,
    handleCancelDocumentOrder,
    documentOrderCancelModalControls
  }
})

export default OrderDocumentContainer
