import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'
import { createContainer } from 'unstated-next'
import {
  getOrdersListQueryKey,
  ordersList,
  useOrdersAcceptUpdate,
  useOrdersCancelCreate,
  useOrdersCancelManualCreate,
  useOrdersOpenCoverUpdate,
  useOrdersStartDeliveryUpdate
} from '@/api/generated/hooks'
import {
  AdminOrderDetailRes,
  AdminOrderRes,
  DeliveryTypesEnum,
  OrdersListParams,
  OrderStatusEnum
} from '@/api/generated/types'
import { I18nNamespaceEnum } from '@/constants/i18n'
import useInfinityScroll from '@/hooks/common/useInfinityScroll'
import useModal from '@/hooks/common/useModal'
import useNativeBridgeRoutingEffect from '@/hooks/common/useNativeBridgeRoutingEffect'
import usePullToRefresh from '@/hooks/common/usePullToRefresh'
import useSoundPlayer from '@/hooks/common/useSoundPlayer'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import { isInApp } from '@/pages/_app'
import { ApiUtils } from '@/utils/apiUtils'

const eventManagerKey = 'OrderContainer'

const OrderContainer = createContainer(() => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const queryClient = useQueryClient()
  const { isReady, isPlaying, play, stop } = useSoundPlayer({ src: '/sounds/noti_sound_check.mp3', isLoop: true })
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
        deliveryType: DeliveryTypesEnum.FOOD
      }
    },
    {
      query: {
        cacheTime: 0,
        ...(isInApp()
          ? {}
          : {
              refetchOnWindowFocus: true,
              refetchIntervalInBackground: true,
              refetchInterval: 10 * 1000
            })
      }
    }
  )

  useEffect(() => {
    if (isReady && !isInApp()) {
      const isOrderCheckingExists = ordersData?.pages?.some((page) => {
        return page.results?.some((order) => {
          return order.orderStatus === OrderStatusEnum.CHECKING
        })
      })
      if (isOrderCheckingExists) {
        !isPlaying && play()
      } else {
        isPlaying && stop()
      }
    }
  }, [ordersData, isReady])

  useNativeBridgeRoutingEffect({
    key: eventManagerKey,
    onRefreshData: () => {
      refetchOrdersList()
    }
  })

  // 주문 취소 사유 메모 모달
  const orderCancelModalNoteControls = useModal()
  const orderDetailModalControls = useModal<AdminOrderDetailRes>()

  // 주문 취소
  const { mutate: mutateOrderCancel, isLoading: isLoadingOrderCancel } = useOrdersCancelCreate({
    mutation: {
      onMutate: () => {
        orderCancelModalNoteControls.handleClose()
        orderDetailModalControls.handleClose()
      },
      onSuccess: () => {
        refetchOrdersList()
      }
    }
  })

  // 주문 수동 취소
  const { mutate: mutateOrderCancelManual } = useOrdersCancelManualCreate({
    mutation: {
      onSuccess: () => refetchOrdersList()
    }
  })

  const handleCancelOrder = (order: AdminOrderRes) => {
    orderCancelModalNoteControls.handleOpen()
    orderCancelModalNoteControls.setModalData({ orderNumber: order?.orderNumber })
  }

  const handleManualCancelOrder = (order: AdminOrderRes) => {
    if (!order?.orderNumber) return
    const result = window?.confirm(t('order:content'))
    if (result) {
      mutateOrderCancelManual({ data: { orderNumber: order.orderNumber } })
    }
  }

  const handleOrderAccept = (order: AdminOrderRes) => {
    mutateOrderAccept({ id: order?.id })
  }

  const handleOpenCargo = (order: AdminOrderRes) => {
    mutateOpenCover({ id: order?.id })
  }

  const handleStartDelivery = (order: AdminOrderRes) => {
    mutateStartDelivery({ id: order?.id })
  }
  // 운영일지
  const orderDrivingLogModalControls = useModal()

  // 주문 접수
  const { mutate: mutateOrderAccept } = useOrdersAcceptUpdate({
    mutation: {
      onSuccess: () => refetchOrdersList(),
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })
  // 적재함 열기
  const { mutate: mutateOpenCover } = useOrdersOpenCoverUpdate({
    mutation: {
      onSuccess: () => refetchOrdersList(),
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })
  // 배달시작
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
    orderCancelModalNoteControls,
    orderDrivingLogModalControls,
    isLoadingAfterCancel: isRefetchingOrdersList || isLoadingOrderCancel,
    orderDetailModalControls,
    handleCancelOrder,
    handleOrderAccept,
    handleOpenCargo,
    handleManualCancelOrder,
    handleStartDelivery,
    mutateOrderCancel,
    pullToRefreshStatus
  }
})

export default OrderContainer
