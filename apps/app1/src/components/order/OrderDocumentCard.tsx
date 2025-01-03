import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { AdminOrderRes, OrdersListDeliveryStatusItem, UserTypeEnum } from '@/api/generated/types'
import Permission from '@/components/permission/Permission'
import { CurrencyEnum, I18nNamespaceEnum } from '@/constants/i18n'
import OrderDocumentContainer from '@/containers/order/OrderDocumentContainer'
import { pageOrderI18nNamespaces } from '@/pages/order'
import { DateUtils } from '@/utils/date'
import { PriceUtils } from '@/utils/price'

const OrderDocumentCard = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.OrderDocument, I18nNamespaceEnum.Common])
  if (!order?.deliveryStatus) return null

  return (
    <div
      className={classNames(
        'card bg-[#1B1F27] px-[8px] py-[8px] shadow-xl',
        order?.deliveryStatus === OrdersListDeliveryStatusItem.ARRIVED && 'border-[1px] border-[#44C073]'
      )}>
      <div className="scrollbar-hide h-[454px] w-full overflow-y-auto">
        <HeaderOrderCard order={order} />
        <div className="flex min-h-[280px] flex-col gap-[12px] px-[24px]">
          <div className="grid grid-cols-3 gap-[12px]">
            <OrderCardDescriptionItem
              title={t('order_document:card.assign_neubie')}
              description={order?.delivery?.robotNickname || '-'}
            />

            <OrderCardDescriptionItem
              title={t('order_document:card.origin')}
              description={order.startNodeName ?? undefined}
            />
            {order.destinationNodeName && (
              <OrderCardDescriptionItem
                title={t('order_document:card.destination')}
                description={order.destinationNodeName}
              />
            )}
            <OrderCardDescriptionItem
              title={t('order_document:card.sender_info')}
              description={`${order?.senderName}\n${order?.senderMobileNumber}`}
            />
            <OrderCardDescriptionItem
              title={t('order_document:card.receiver_info')}
              description={`${order?.recipientName}\n${order?.recipientMobileNumber}`}
            />
            <OrderCardDescriptionItem
              title={t('order_document:card.delivery_price')}
              description={PriceUtils.toUnitPriceByCurrency(order.totalPrice, order.currency as CurrencyEnum)}
            />
            <OrderCardDescriptionItem
              title={t('order_document:card.order_number')}
              description={order.orderNumber ?? ''}
            />
          </div>
          {order.userNote && (
            <OrderCardDescriptionItem title={t('order_document:card.user_note')} description={order.userNote} />
          )}
          {order.cancelReason && (
            <div>
              <OrderCardDescriptionItem
                title={t('order_document:card.cancel_reason')}
                description={order.cancelReason}
              />
            </div>
          )}
        </div>
        {/* 하단 버튼 영역*/}
        <BottomButtonsArea order={order} />
      </div>
    </div>
  )
}

const BottomButtonsArea = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.OrderDocument, I18nNamespaceEnum.Common])
  const { handleCancelDocumentOrder, handleOpenCargo, handleStartDelivery } = OrderDocumentContainer.useContainer()
  const showCancelStatuses: OrdersListDeliveryStatusItem[] = [
    OrdersListDeliveryStatusItem.MOVING,
    OrdersListDeliveryStatusItem.ARRIVED,
    OrdersListDeliveryStatusItem.DELIVERING
  ]
  const showOpenAndStartStatuses: OrdersListDeliveryStatusItem[] = [
    OrdersListDeliveryStatusItem.MOVING,
    OrdersListDeliveryStatusItem.ARRIVED
  ]

  if (!order?.deliveryStatus) return null

  const isStatusCancel = showCancelStatuses.includes(order?.deliveryStatus)
  const isStatusOpenAndStart = showOpenAndStartStatuses.includes(order?.deliveryStatus)
  const showButtonArea = isStatusCancel || isStatusOpenAndStart

  return (
    <div className="sticky bottom-0">
      <div className="h-[30px] w-full bg-gradient-to-t from-[#1B1F27]"></div>
      {showButtonArea && (
        <div className="flex gap-[12px] bg-[#1B1F27] px-[24px] pb-[16px] pt-[20px]">
          {isStatusCancel && (
            <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN]}>
              <button
                className="btn-sm btn h-[36px] w-full shrink normal-case text-white"
                onClick={() => handleCancelDocumentOrder(order)}>
                {t('order_document:card.button.order_cancel')}
              </button>
            </Permission>
          )}
          {isStatusOpenAndStart && (
            <>
              <button
                className="btn-sm btn h-[36px] w-full shrink bg-[#00B2E3] normal-case text-white"
                disabled={order?.deliveryStatus !== OrdersListDeliveryStatusItem.ARRIVED}
                onClick={() => handleOpenCargo(order)}>
                {t('order_document:card.button.open_cargo')}
              </button>
              <button
                className="btn-sm btn h-[36px] w-full shrink bg-[#00B45A] normal-case text-white"
                onClick={() => handleStartDelivery(order)}
                disabled={order?.deliveryStatus !== OrdersListDeliveryStatusItem.ARRIVED}>
                {t('order_document:card.button.start_delivery')}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const HeaderOrderCard = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.OrderDocument, I18nNamespaceEnum.Common])
  return (
    <div className="sticky top-0 flex h-[70px] w-full items-center justify-between gap-[16px] bg-[#1B1F27] px-[24px] pb-[16px] pt-[20px]">
      <h3 className="text-[24px] font-bold text-base-content">
        {t('order_document:card.title', { index: order.dailySeriesOfShop })}
      </h3>
      <div className="flex items-center gap-[12px]">
        {order?.createdAt && (
          <span className="whitespace-nowrap text-[14px] text-[#7B7B7B]">
            {DateUtils.getDateString(order.createdAt, 'YYYY.MM.DD HH:mm')}
          </span>
        )}
        <OrderStatusBadge status={order.deliveryStatus} />
      </div>
    </div>
  )
}

const OrderCardDescriptionItem = ({ title, description }: { title: string; description?: string | number }) => {
  return (
    <dl className="flex w-full flex-col">
      <dt className="text-[14px] text-[#7B7B7B]">{title}</dt>
      <dd className="text-[14px] text-base-content">{description}</dd>
    </dl>
  )
}

const OrderStatusBadge = ({ status }: { status?: OrdersListDeliveryStatusItem }) => {
  const { t } = useTranslation(pageOrderI18nNamespaces)
  const defaultClassName = 'whitespace-nowrap rounded-[4px] px-[8px] py-[4px] text-[12px] font-bold'

  if (!status) {
    return null
  }

  // 뉴비 이동중
  if (status === OrdersListDeliveryStatusItem.MOVING) {
    return (
      <div className={`${defaultClassName} bg-[#434343] text-white`}>
        {t('order_document:card.order_status.loading_start')}
      </div>
    )
  }

  // 뉴비 도착
  if (status === OrdersListDeliveryStatusItem.ARRIVED) {
    return (
      <div className={`${defaultClassName} bg-[#434343] text-white`}>
        {t('order_document:card.order_status.loading_arrived')}
      </div>
    )
  }

  // 배달중
  if (status === OrdersListDeliveryStatusItem.DELIVERING) {
    return <div className={`${defaultClassName} bg-[#006224] text-white`}>{t('common:order_status.delivering')}</div>
  }

  // 배달완료
  if (status === OrdersListDeliveryStatusItem.DONE) {
    return (
      <div className={`${defaultClassName} bg-[#434343] text-white`}>
        {t('order_document:card.order_status.delivered')}
      </div>
    )
  }

  // 배달취소
  if (status === OrdersListDeliveryStatusItem.CANCELED) {
    return (
      <div className={`${defaultClassName} bg-[#C83532]/[0.15] text-[#C83532]`}>
        {t('order_document:card.order_status.cancel_order')}
      </div>
    )
  }

  return null
}

export default OrderDocumentCard
