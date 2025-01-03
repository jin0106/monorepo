import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { AdminOrderRes, DetailedDeliveryStatusEnum, OrderStatusEnum, UserTypeEnum } from '@/api/generated/types'
import Permission from '@/components/permission/Permission'
import { CurrencyEnum, I18nNamespaceEnum } from '@/constants/i18n'
import OrderContainer from '@/containers/order/OrderContainer'
import { pageOrderI18nNamespaces } from '@/pages/order'
import { DateUtils } from '@/utils/date'
import { ComponentUtils } from '@/utils/design-system/componentUtils'
import { NumberUtils, numberWithCommas } from '@/utils/number'
import { PriceUtils } from '@/utils/price'

/***
 * todo: 뉴비 이동중과 뉴비 도착은 프론트가 status를 조합하므로 백엔드한테 정확하게 요청
 * - status가 현재 너무 복잡한 관계로 정리가 필요함
 * @param order
 */
const isNeubieMoving = (order: AdminOrderRes) => {
  if (order.orderStatus === OrderStatusEnum.PREPARING) {
    if (!order.delivery?.detailedDeliveryStatus) {
      return true
    }
    if (order.delivery?.detailedDeliveryStatus === DetailedDeliveryStatusEnum.LOADING_START) {
      return true
    }
  }
  return false
}

const isNeubieArrived = (order: AdminOrderRes) => {
  if (order.orderStatus === OrderStatusEnum.PREPARING) {
    if (!order.delivery?.detailedDeliveryStatus) {
      return false
    }
    if (order.delivery?.detailedDeliveryStatus !== DetailedDeliveryStatusEnum.LOADING_START) {
      return true
    }
  }
  return false
}

const OrderFoodCard = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const isActiveCard = order.orderStatus === OrderStatusEnum.CHECKING || isNeubieArrived(order)

  if (!order || !order?.orderStatus) {
    return null
  }

  return (
    <div
      className={classNames(
        'card bg-[#1B1F27] px-[8px] py-[8px] shadow-xl',
        isActiveCard && 'border-[1px] border-[#44C073]'
      )}>
      <div className="scrollbar-hide h-[454px] w-full overflow-y-auto">
        <HeaderOrderCard order={order} />
        <div className="flex min-h-[280px] flex-col gap-[12px] px-[24px]">
          <div className="grid grid-cols-3 gap-[12px]">
            <OrderCardDescriptionItem
              title={t('order:card.neubie_name')}
              description={order.delivery.robotNickname || '-'}
            />
            <OrderCardDescriptionItem title={t('order:card.origin')} description={order.shopName ?? undefined} />
            {order.destinationNodeName && (
              <OrderCardDescriptionItem title={t('order:card.destination')} description={order.destinationNodeName} />
            )}
            <OrderCardDescriptionItem
              title={t('order:card.order_price')}
              description={PriceUtils.toUnitPriceByCurrency(order.originalTotalPrice, order.currency as CurrencyEnum)}
            />
            {NumberUtils.isNumber(order?.deliveryTotalPrice) && (
              <OrderCardDescriptionItem
                title={t('order:card.delivery_fee')}
                description={PriceUtils.toUnitPriceByCurrency(order.deliveryTotalPrice, order.currency as CurrencyEnum)}
              />
            )}
            <OrderCardDescriptionItem
              title={t('order:card.total_price')}
              description={PriceUtils.toUnitPriceByCurrency(order.totalPrice, order.currency as CurrencyEnum)}
            />
            <OrderCardDescriptionItem
              title={t('order:card.customer_phone_number')}
              description={order.mobileNumber ?? ''}
              contentClassName="break-all"
            />
            <OrderCardDescriptionItem
              title={t('order:order_number')}
              description={order.orderNumber ?? ''}
              contentClassName="break-all"
            />
            <OrderCardDescriptionItem
              title={t('order:card.used_coupon')}
              description={`${PriceUtils.toUnitPriceByCurrency(
                order.couponDiscountTotalPrice,
                order.currency as CurrencyEnum
              )}`}
            />
            <OrderCardDescriptionItem
              title={t('order:card.used_point')}
              description={`${numberWithCommas(order.usedPoint)} P`}
            />
          </div>
          <OrderSummary order={order} />
          {order.userNote && (
            <OrderCardDescriptionItem title={t('order:card.user_note')} description={order.userNote} />
          )}
          {order.cancelReason && (
            <OrderCardDescriptionItem title={t('order:card.cancel_reason')} description={order.cancelReason} />
          )}
        </div>
        {/* 하단 버튼 영역*/}
        <BottomButtonsArea order={order} />
      </div>
    </div>
  )
}

const BottomButtonsArea = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const { handleCancelOrder, handleManualCancelOrder, handleStartDelivery, handleOrderAccept, handleOpenCargo } =
    OrderContainer.useContainer()
  const showCancelStatuses: OrderStatusEnum[] = [
    OrderStatusEnum.CHECKING,
    OrderStatusEnum.PREPARING,
    OrderStatusEnum.DELIVERING,
    OrderStatusEnum.REQUEST_CANCEL
  ]

  if (!order || !order?.orderStatus) {
    return null
  }

  const isStatusCancel = showCancelStatuses.includes(order.orderStatus)
  const isStatusChecking = order.orderStatus === OrderStatusEnum.CHECKING
  const isStatusPreparing = order.orderStatus === OrderStatusEnum.PREPARING
  const isStatusRequestCancel = order.orderStatus === OrderStatusEnum.REQUEST_CANCEL
  const showButtonArea = isStatusCancel || isStatusChecking || isStatusPreparing || isStatusRequestCancel

  return (
    <div className="sticky bottom-0">
      <div className="h-[30px] w-full bg-gradient-to-t from-[#1B1F27]"></div>
      {showButtonArea && (
        <div className="flex gap-[12px] bg-[#1B1F27] px-[24px] pb-[16px] pt-[20px]">
          {isStatusCancel && (
            <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN]}>
              <button
                className="btn-sm btn h-[36px] w-full shrink border-[#404C63] bg-[#2B303B] normal-case text-white"
                onClick={() => handleCancelOrder(order)}
                disabled={isStatusRequestCancel}>
                {isStatusRequestCancel
                  ? t('order:card.button.order_canceled_fail')
                  : t('order:card.button.order_cancel')}
              </button>
            </Permission>
          )}
          {isStatusChecking && (
            <button
              className="btn-sm btn h-[36px] w-full shrink bg-[#00B2E3] normal-case text-white"
              onClick={() => handleOrderAccept(order)}>
              {t('order:card.button.order_accept')}
            </button>
          )}
          {isStatusPreparing && !order.isUseSimpleDelivery && (
            <button
              className="btn-sm btn h-[36px] w-full shrink bg-[#00B2E3] normal-case text-white"
              disabled={isNeubieMoving(order)}
              onClick={() => handleOpenCargo(order)}>
              {t('order:card.button.open_cargo')}
            </button>
          )}
          {isStatusRequestCancel && (
            <Permission allowAdminTypes={[UserTypeEnum.ADMIN]}>
              <button
                className="btn-sm btn h-[36px] w-full shrink normal-case text-white"
                onClick={() => handleManualCancelOrder(order)}>
                {t('order:card.button.cancellation_complete')}
              </button>
            </Permission>
          )}
          {isStatusPreparing && !order.isUseSimpleDelivery && (
            <button
              className="btn-sm btn h-[36px] w-full shrink bg-[#00B45A] normal-case text-white hover:bg-[#00B45A]"
              onClick={() => handleStartDelivery(order)}
              disabled={isNeubieMoving(order)}>
              {t('order:card.button.start_delivery')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const HeaderOrderCard = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  return (
    <div className="sticky top-0 flex h-[70px] w-full items-center justify-between gap-[16px] bg-[#1B1F27] px-[24px] pb-[16px] pt-[20px]">
      <h3 className="text-[24px] font-bold text-base-content">
        {t('order:card.title', { index: order.dailySeriesOfShop })}
      </h3>
      <div className="flex flex-col items-end gap-[4px]">
        {order?.createdAt && (
          <span className="whitespace-nowrap text-[14px] text-[#7B7B7B]">
            {DateUtils.getDateString(order.createdAt, 'YYYY.MM.DD HH:mm')}
          </span>
        )}
        <OrderStatusBadge order={order} />
      </div>
    </div>
  )
}

const OrderCardDescriptionItem = ({
  title,
  description,
  contentClassName
}: {
  title: string
  description?: string | number
  contentClassName?: string
}) => {
  return (
    <dl className="flex w-full flex-col">
      <dt className="text-[14px] text-[#7B7B7B]">{title}</dt>
      <dd className={ComponentUtils.cn('whitespace-pre-wrap text-[14px] text-base-content', contentClassName)}>
        {description}
      </dd>
    </dl>
  )
}

const OrderStatusBadge = ({ order }: { order?: AdminOrderRes }) => {
  const { t } = useTranslation(pageOrderI18nNamespaces)
  const defaultClassName = 'whitespace-nowrap rounded-[4px] px-[8px] py-[4px] text-[12px] font-bold'

  if (!order) {
    return null
  }

  // 주문 요청
  if (order.orderStatus === OrderStatusEnum.CHECKING) {
    return (
      <div className={`${defaultClassName} bg-[#00548D] text-white`}>{t('order:card.order_status.request_order')}</div>
    )
  }

  // 뉴비 이동중
  if (isNeubieMoving(order)) {
    return (
      <div className={`${defaultClassName} bg-[#434343] text-white`}>{t('order:card.order_status.loading_start')}</div>
    )
  }
  // 뉴비 도착
  if (isNeubieArrived(order)) {
    return (
      <div className={`${defaultClassName} bg-[#434343] text-white`}>
        {t('order:card.order_status.loading_arrived')}
      </div>
    )
  }

  // 배달중
  if (order.orderStatus === OrderStatusEnum.DELIVERING) {
    return (
      <div className={`${defaultClassName} bg-[#006224] text-white`}>{t('order:card.order_status.delivering')}</div>
    )
  }

  // 배달완료
  if (order.orderStatus === OrderStatusEnum.DELIVERED) {
    return <div className={`${defaultClassName} bg-[#434343] text-white`}>{t('order:card.order_status.delivered')}</div>
  }

  // 주문 취소
  if (order.orderStatus === OrderStatusEnum.CANCELED) {
    return (
      <div className={`${defaultClassName} bg-[#C83532]/[0.15] text-[#C83532]`}>
        {t('order:card.order_status.cancel_order')}
      </div>
    )
  }

  // 취소 요청
  if (order.orderStatus === OrderStatusEnum.REQUEST_CANCEL) {
    return (
      <div className={`${defaultClassName} bg-[#C83532]/[0.15] text-[#C83532]`}>
        {t('order:card.order_status.request_cancel')}
      </div>
    )
  }

  return null
}

const OrderSummary = ({ order }: { order: AdminOrderRes }) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  if (order.orderItemsSummary) {
    return (
      <>
        {NumberUtils.isNumber(order?.orderItemCount) && (
          <dt className="text-[14px] text-[#7B7B7B]">
            {t('order:card.order_description_title', { count: order.orderItemCount })}
          </dt>
        )}
        <dl>
          {order.orderItemsSummary?.split('\n').map((item, index) => (
            <dd key={index} className="text-[14px] before:mr-[5px] before:content-['•']">
              {item}
            </dd>
          ))}
        </dl>
      </>
    )
  }

  if (order.name) {
    return (
      <>
        <dt className="text-[14px] text-[#7B7B7B]">{t('order:card.order_description_old_title')}</dt>
        <dd className="before:mr-[5px] before:content-['•']">{order.name}</dd>
      </>
    )
  }
  return null
}

export default OrderFoodCard
