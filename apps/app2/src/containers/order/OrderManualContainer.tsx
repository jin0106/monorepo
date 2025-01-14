import { useMemo, useState } from 'react'
import { PencilSquareIcon } from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import { useTranslation } from 'next-i18next'
import { createContainer } from 'unstated-next'
import {
  nodesNodeNumberRetrieve,
  useManualOrdersCancelUpdate,
  useManualOrdersList,
  useManualSitesList
} from '@/api/generated/hooks'
import {
  AdminManualOrderCancelNoteReqRequest,
  AdminOrderRes,
  OrdersListParams,
  PaginatedAdminOrderResList
} from '@/api/generated/types'
import { TableContentsType } from '@/components/common/tables/TableContent'
import { OptionCancelNoteModalData } from '@/components/order/OrderCancelNoteModal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { getOrderStatusEnumText } from '@/constants/orderStatusText'
import useLocale from '@/hooks/common/useLocale'
import useModal from '@/hooks/common/useModal'
import usePagination from '@/hooks/common/usePagination'

const OrderManualContainer = createContainer(() => {
  const { t } = useTranslation([I18nNamespaceEnum.OrderManual, I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const { toUnitPriceByCurrency } = useLocale()
  // orders filter
  const [searchParam, setSearchParam] = useState<OrdersListParams>()

  // 수동 주문 가능한 사이트 리스트
  const { data: manualSites } = useManualSitesList()

  // orders pagination
  const {
    data: ordersList,
    isLoading: isOrderListLoading,
    itemCountPerPage,
    currentPage,
    handlePageChange,
    refetch: refetchOrdersList
  } = usePagination<PaginatedAdminOrderResList>(useManualOrdersList, searchParam, 10, 1)

  // 주문 취소 모달
  const orderCancelNoteModalControls = useModal<OptionCancelNoteModalData>()

  // 주문 취소 기록
  const { mutate: mutateOrderCancel } = useManualOrdersCancelUpdate({
    mutation: {
      onSuccess: () => {
        refetchOrdersList()
        orderCancelNoteModalControls.handleClose()
      }
    }
  })

  const updateOrderCancelNote = (data: AdminManualOrderCancelNoteReqRequest) => {
    mutateOrderCancel({ id: orderCancelNoteModalControls.modalData.id, data })
  }

  const renderOrderCancelNoteButton = (order: AdminOrderRes) => {
    return order.cancelNote ? (
      <button
        className="text-white underline"
        onClick={() => {
          orderCancelNoteModalControls.setModalData({ id: order.id, note: order.cancelNote })
          orderCancelNoteModalControls.handleOpen()
        }}>
        {t('order:cancel_note')}
      </button>
    ) : (
      <PencilSquareIcon
        className="h-5 w-5 cursor-pointer"
        onClick={() => {
          orderCancelNoteModalControls.setModalData({ id: order.id })
          orderCancelNoteModalControls.handleOpen()
        }}
      />
    )
  }

  // 주문 rows
  const ordersListContent: TableContentsType[] = useMemo(() => {
    return (
      ordersList?.results?.map((order) => {
        const createdAt = dayjs(order?.createdAt).format('YYYY.MM.DD HH:mm')
        return {
          row: [
            {
              key: 'orderCancel',
              content: renderOrderCancelNoteButton(order)
            },
            {
              key: 'orderInfo',
              content: (
                <div>
                  <p>{createdAt}</p>
                  <p>{order?.orderNumber}</p>
                </div>
              )
            },
            {
              key: 'orderStatus',
              content: order?.orderStatus && <span>{getOrderStatusEnumText(t, order.orderStatus)}</span>
            },
            {
              key: 'startNode',
              content: <span>{order?.shopName}</span>
            },
            {
              key: 'endNode',
              content: (
                <span
                  onClick={(e) => {
                    if (!order?.destinationNodeNumber || !order?.siteSlug) return
                    nodesNodeNumberRetrieve(order.destinationNodeNumber, { siteSlug: order.siteSlug }).then((data) => {
                      const target = e?.target as HTMLSpanElement
                      target.innerHTML = data?.name
                    })
                  }}>
                  {order?.destinationNodeNumber}
                </span>
              )
            },
            {
              key: 'orderProducts',
              content: <span>{order?.name}</span>
            },
            {
              key: 'orderPrice',
              content: <span>{toUnitPriceByCurrency(order?.totalPrice, order?.currency)}</span>
            },
            {
              key: 'phone',
              content: <span>{order?.mobileNumber}</span>
            }
          ]
        }
      }) || []
    )
  }, [ordersList])

  // 수동 주문 생성
  const orderManualRegisterModalProps = useModal()

  return {
    manualSites: manualSites?.results,
    setSearchParam,
    ordersListContent,
    isOrderListLoading,
    itemCountPerPage,
    currentPage,
    ordersListCount: ordersList?.count,
    refetchOrdersList,
    handlePageChange,
    orderCancelNoteModalControls,
    updateOrderCancelNote,
    orderManualRegisterModalProps
  }
})

export default OrderManualContainer
