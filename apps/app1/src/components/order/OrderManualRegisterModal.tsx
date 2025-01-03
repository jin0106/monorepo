import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'next-i18next'
import DaisyDropDown, { DropDownDirectionEnum, searchTextHighLight } from '@/components/common/dropdown/DaisyDropDown'
import Modal from '@/components/common/modal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import OrderManualContainer from '@/containers/order/OrderManualContainer'
import { ModalPropsType } from '@/hooks/common/useModal'
import useOrderManualRegister from '@/hooks/order/useOrderManualRegister'

type OptionDetailModalProps = {
  modalProps?: ModalPropsType
}
const OrderManualRegisterModal = ({ modalProps }: OptionDetailModalProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.OrderManual, I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const {
    destinationDropDownControls,
    manualSites,
    mutateManualOrderCreate,
    manualOrderFormMethods,
    shops,
    searchAddress
  } = useOrderManualRegister()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors }
  } = manualOrderFormMethods

  const { refetchOrdersList } = OrderManualContainer.useContainer()

  const onSubmit = handleSubmit(async (data) => {
    await mutateManualOrderCreate({
      data: {
        siteSlug: data.siteSlug,
        shop: data.shop,
        destinationNodeNumber: data.destinationNodeNumber,
        name: data.name,
        originalTotalPrice: data.originalTotalPrice,
        deliveryTotalPrice: data.deliveryTotalPrice,
        mobileNumber: data.mobileNumber
      }
    })
    refetchOrdersList()
    modalProps?.handleClose()
  })

  return (
    <div className="flex w-[655px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold">{t('order_manual:create_order')}</span>
      </Modal.Header>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}>
        <div className="flex w-full gap-2">
          <select
            className="select-bordered select w-full flex-shrink"
            {...register('siteSlug', {
              required: true,
              onChange: (e) => {
                const site = manualSites?.results?.find((site) => site.slug === e.target.value)
                setValue('selectedSite', site)
                site?.slug && setValue('siteSlug', site.slug)
              }
            })}>
            <option value="">{t('common:filter.all_sites')}</option>
            {manualSites?.results?.map((option) => {
              return (
                <option key={option.slug} value={option.slug ?? ''}>
                  {option.name}
                </option>
              )
            })}
          </select>
          <select className="select-bordered select w-full flex-shrink" {...register('shop', { required: true })}>
            <option value="">{t('common:filter.shop')}</option>
            {shops.map((option) => {
              return (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              )
            })}
          </select>
        </div>
        <div className="mt-4 h-[1px] w-full bg-base-content/30" />
        <div className="input-group mt-4">
          <input
            type="text"
            className="input-bordered input w-full"
            placeholder={t('order_manual:modal.create.address_placeholder')}
            {...register('searchText')}
          />
          <button
            className="btn-square btn"
            type="button"
            onClick={() => {
              searchAddress()
            }}>
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">
          <DaisyDropDown
            defaultItemText={t('order_manual:modal.create.select_location')}
            dropDownControls={destinationDropDownControls}
            direction={DropDownDirectionEnum.Down}>
            <DaisyDropDown.Search
              searchPlaceHolder={t('order_manual:modal.create.search-word')}
              dropDownProps={destinationDropDownControls}
            />
            <DaisyDropDown.List>
              {destinationDropDownControls.searchFilterList?.map((item) => {
                return (
                  <DaisyDropDown.Item
                    dropDownProps={destinationDropDownControls}
                    key={item.id}
                    itemContent={{
                      id: item.id,
                      content: <span>{searchTextHighLight(item.content, destinationDropDownControls.searchText)}</span>
                    }}
                  />
                )
              })}
            </DaisyDropDown.List>
          </DaisyDropDown>
        </div>
        <div id="map" className="mt-4 h-[540px] w-full rounded-[8px] bg-gray-300" />
        <div className="mt-4 h-[1px] w-full bg-base-content/30" />
        <textarea
          {...register('name', {
            required: true
          })}
          className="border-1 input-bordered textarea mt-6 h-[100px] w-full resize-none"
          placeholder={t('order_manual:modal.create.name_placeholder')}
        />
        <input
          className="input-bordered input mt-4 w-full"
          type="number"
          inputMode="numeric"
          placeholder={t('order_manual:modal.create.order_total_price_placeholder')}
          {...register('originalTotalPrice', {
            required: true
          })}
        />
        <input
          className="input-bordered input mt-4 w-full"
          type="number"
          inputMode="numeric"
          placeholder={t('order_manual:modal.create.delivery_total_price_placeholder')}
          {...register('deliveryTotalPrice', {
            required: true
          })}
        />
        <div className="mt-4 h-[1px] w-full bg-base-content/30" />
        <input
          className="input-bordered input mt-4 w-full"
          type="text"
          placeholder={t('order_manual:modal.create.mobile_number_placeholder')}
          {...register('mobileNumber', {
            required: true
          })}
        />
        <div className="mt-8 flex gap-2">
          <button
            type="button"
            className="btn-outline btn-wide btn w-full flex-shrink"
            onClick={modalProps?.handleClose}>
            {t('common:cancel')}
          </button>
          <button
            type="submit"
            className="btn-info btn-wide btn ml-2 w-full flex-shrink text-white"
            disabled={!isEmpty(errors)}>
            {t('order_manual:modal.create.cta')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderManualRegisterModal
