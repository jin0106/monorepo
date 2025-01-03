import { useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import { OrdersListDeliveryStatusItem, UserTypeEnum } from '@/api/generated/types'
import DateRangeInput, { DateProps } from '@/components/common/date/DateRangeInput'
import AuthContainer from '@/containers/common/AuthContainer'
import OrderDocumentContainer from '@/containers/order/OrderDocumentContainer'
import { pageOrderDocumentI18nNamespaces } from '@/pages/order/document'
import { FilterUtils } from '@/utils/filter'

const getSearchOrderStatus = (t: TFunction) => ({
  [OrdersListDeliveryStatusItem.MOVING]: t('order_document:card.order_status.loading_start'),
  [OrdersListDeliveryStatusItem.DELIVERING]: t('order_document:card.order_status.delivering'),
  [OrdersListDeliveryStatusItem.ARRIVED]: t('order_document:card.order_status.loading_arrived'),
  [OrdersListDeliveryStatusItem.DONE]: t('order_document:card.order_status.delivered'),
  [OrdersListDeliveryStatusItem.CANCELED]: t('order_document:card.order_status.cancel_order')
})

type OrderListFilterFormType = {
  site: number
  date: DateProps
  deliveryStatus: OrdersListDeliveryStatusItem
}

const OrderDocumentSearchFilter = () => {
  const { t } = useTranslation(pageOrderDocumentI18nNamespaces)
  const { sites, setSearchParam } = OrderDocumentContainer.useContainer()

  // forms
  const { register, handleSubmit, control, setValue } = useForm<OrderListFilterFormType>()
  const onSubmit = handleSubmit((data) => {
    const { createdAtAfter, createdAtBefore } = FilterUtils.getCreatedAtString({ ...data?.date })
    setSearchParam?.({
      ...(createdAtAfter && { createdAtAfter }),
      ...(createdAtBefore && { createdAtBefore }),
      ...(data?.site && { site: data.site }),
      ...(data?.deliveryStatus && { deliveryStatus: [data.deliveryStatus] })
    })
  })

  // set site
  const { adminInfo } = AuthContainer.useContainer()
  useEffect(() => {
    if (adminInfo?.userType === UserTypeEnum.SITE_ADMIN || adminInfo?.userType === UserTypeEnum.SHOP_ADMIN) {
      const site = adminInfo?.userSites?.[0]?.id
      if (site) {
        setValue('site', site)
        setSearchParam?.({
          site
        })
      }
    }
  }, [adminInfo])

  return (
    <div className="flex">
      <form className="flex flex-wrap gap-2" onSubmit={onSubmit}>
        <Controller
          control={control}
          render={({ field }) => (
            <DateRangeInput
              rangeText={t('common:filter.delivery_period')}
              date={field.value}
              setDate={(date) => {
                field.onChange(date)
              }}
            />
          )}
          name={'date'}
        />
        <select className="select-bordered select" {...register('site')}>
          <option value="">{t('common:filter.all_sites')}</option>
          {sites?.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            )
          })}
        </select>
        <select className="select-bordered select" {...register('deliveryStatus')}>
          <option value="">{t('common:filter.order_status')}</option>
          {Object.entries(getSearchOrderStatus(t)).map(([key, value]) => {
            return (
              <option key={key} value={key}>
                {value}
              </option>
            )
          })}
        </select>
        <div className="flex items-end">
          <button type="submit" className="] btn-md btn">
            <MagnifyingGlassIcon className="h-[25px] w-[25px]" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderDocumentSearchFilter
