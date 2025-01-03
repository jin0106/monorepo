import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'
import { Controller, useForm } from 'react-hook-form'
import { AdminSiteRes, OrdersListOrderStatusItem, OrdersListParams, SiteRes, UserTypeEnum } from '@/api/generated/types'
import DateRangeInput, { DateProps } from '@/components/common/date/DateRangeInput'
import AuthContainer from '@/containers/common/AuthContainer'
import useShopsListAll from '@/hooks/query/useShopsListAll'
import { pageOrderI18nNamespaces } from '@/pages/order'
import DataUtils from '@/utils/design-system/dataUtils'
import { FilterUtils } from '@/utils/filter'

export const getSearchOrderStatus = (t: TFunction) => ({
  [OrdersListOrderStatusItem.CHECKING]: t('order:card.order_status.request_order'),
  [OrdersListOrderStatusItem.DELIVERING]: t('common:order_status.delivering'),
  [OrdersListOrderStatusItem.DELIVERED]: t('order:card.order_status.delivered'),
  [OrdersListOrderStatusItem.REQUEST_CANCEL]: t('order:card.order_status.request_cancel'),
  [OrdersListOrderStatusItem.CANCELED]: t('order:card.order_status.cancel_order')
})

type OrderListFilterFormType = {
  site: number
  shop: number
  date: DateProps
  orderStatus: OrdersListOrderStatusItem
}

type OrderSearchFilterProps = {
  sites?: AdminSiteRes[] | SiteRes[]
  setSearchParam: Dispatch<SetStateAction<OrdersListParams | undefined>>
}

const OrderSearchFilter = ({ sites, setSearchParam }: OrderSearchFilterProps) => {
  const { t } = useTranslation(pageOrderI18nNamespaces)
  const [selectedSite, setSelectedSite] = useState<number>()

  // shops
  const { shopsList: shops } = useShopsListAll({
    queryParams: { sites: [...(selectedSite ? [selectedSite] : [])] },
    enabled: !!selectedSite
  })

  // forms
  const { register, handleSubmit, control, resetField, setValue } = useForm<OrderListFilterFormType>()
  const onSubmit = handleSubmit((data) => {
    const { createdAtAfter, createdAtBefore } = FilterUtils.getCreatedAtString({ ...data?.date })
    setSearchParam?.({
      ...(createdAtAfter && { createdAtAfter }),
      ...(createdAtBefore && { createdAtBefore }),
      ...(data?.shop && { shop: data.shop }),
      ...(data?.site && { site: data.site }),
      ...(data?.orderStatus && { orderStatus: [data.orderStatus] })
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
              rangeText={t('common:filter.order_period')}
              date={field.value}
              setDate={(date) => {
                field.onChange(date)
              }}
            />
          )}
          name={'date'}
        />
        <select
          className="select-bordered select"
          {...register('site', {
            onChange: (e) => {
              e?.target?.value && setSelectedSite(e.target.value)
              resetField('shop')
            }
          })}>
          <option value="">{t('common:filter.all_sites')}</option>
          {sites?.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            )
          })}
        </select>
        {!DataUtils.isEmpty(shops) && (
          <select className="select-bordered select" {...register('shop')}>
            <option value="">{t('common:filter.shop')}</option>
            {shops.map((option) => {
              return (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              )
            })}
          </select>
        )}
        <select className="select-bordered select" {...register('orderStatus')}>
          <option value="">{t('order:filter.order_status')}</option>
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

export default OrderSearchFilter
