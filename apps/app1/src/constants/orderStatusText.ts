import { TFunction } from 'i18next'
import { SaleStatusEnum, UserTypeEnum } from '@/api/generated/types'
import { OrderStatusEnum } from '@/api/generated/types/orderStatusEnum'

export const getOrderStatusEnumText = (t: TFunction, orderStatus: OrderStatusEnum): string => {
  switch (orderStatus) {
    case OrderStatusEnum.CANCELED:
      return t('common:order_status.canceled')
    case OrderStatusEnum.CHECKING:
      return t('common:order_status.checking')
    case OrderStatusEnum.DELIVERED:
      return t('common:order_status.delivered')
    case OrderStatusEnum.DELIVERING:
      return t('common:order_status.delivering')
    case OrderStatusEnum.PREPARING:
      return t('common:order_status.preparing')
    case OrderStatusEnum.ERROR:
      return t('common:order_status.error')
    case OrderStatusEnum.READY:
      return t('common:order_status.ready')
    case OrderStatusEnum.REQUEST_CANCEL:
      return t('common:order_status.request_cancel')
  }
}

export const getSaleStatusEnumText = (t: TFunction, saleStatus: SaleStatusEnum): string => {
  switch (saleStatus) {
    case SaleStatusEnum.SALE:
      return t('common:sale_status.sale')
    case SaleStatusEnum.HIDDEN:
      return t('common:sale_status.hidden')
    case SaleStatusEnum.SOLD_OUT:
      return t('common:sale_status.sold_out')
  }
}

export const getUserTypeEnumText = (t: TFunction, userType: UserTypeEnum): string => {
  switch (userType) {
    case UserTypeEnum.USER:
      return t('common:user_type.user')
    case UserTypeEnum.SHOP_ADMIN:
      return t('common:user_type.shop_admin')
    case UserTypeEnum.SITE_ADMIN:
      return t('common:user_type.site_admin')
    case UserTypeEnum.ADMIN:
      return t('common:user_type.admin')
  }
}
