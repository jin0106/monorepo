import { ChangeEvent } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'
import { isAndroid } from 'react-device-detect'
import {
  useShopsProductsProductOptionGroupsList,
  useShopsProductsProductOptionsSaleStatusUpdate
} from '@/api/generated/hooks'
import {
  AdminProductOptionGroupRes,
  AdminProductOptionRes,
  AdminProductRes,
  SaleStatusEnum
} from '@/api/generated/types'
import Modal from '@/components/common/modal'
import Table from '@/components/common/tables'
import { TableColumnType } from '@/components/common/tables/TableContent'
import HighLightModalSubtitle from '@/components/menu/HighLightModalSubtitle'
import IconButton from '@/components/menu/IconButton'
import OptionGroupAddModal from '@/components/menu/OptionGroupAddModal'
import OptionGroupSeriesChangeModal from '@/components/menu/OptionGroupSeriesChangeModal'
import OptionGroupUpdateModal from '@/components/menu/OptionGroupUpdateModal'
import OptionSeriesChangeModal from '@/components/menu/OptionSeriesChangeModal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import { getSaleStatusEnumText } from '@/constants/orderStatusText'
import useLocale from '@/hooks/common/useLocale'
import useModal, { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'
import DataUtils from '@/utils/design-system/dataUtils'

interface OptionDetailModalProps {
  shopId: number
  modalProps: ModalPropsType<{ product: AdminProductRes }>
  refetchProductsSelectedCategory: () => Promise<void>
}
const getColumns = (t: TFunction): TableColumnType[] => [
  {
    title: t('menu:modal.option_detail.option_name'),
    key: 'optionName'
  },
  {
    title: t('menu:unit_price'),
    key: 'unitPrice'
  },
  {
    title: t('menu:sell_status'),
    key: 'sellStatus'
  }
]

const OptionDetailModal = ({ modalProps, shopId, refetchProductsSelectedCategory }: OptionDetailModalProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.Menu, I18nNamespaceEnum.Common])
  const { toUnitPrice } = useLocale()
  const { product } = modalProps.modalData
  const optionGroupSeriesChangeModalControls = useModal()
  const optionGroupAddModalControls = useModal()
  const optionSeriesChangeModalControls = useModal<{ optionGroup: AdminProductOptionGroupRes }>()
  const optionUpdateModalControls = useModal<{ optionGroup: AdminProductOptionGroupRes }>()

  const { data: productOptionGroups, refetch: refetchProductOptionGroups } = useShopsProductsProductOptionGroupsList(
    shopId,
    product?.id || 0,
    {
      query: { enabled: !!product?.id && !!shopId }
    }
  )

  const { mutateAsync: updateProductOptionSaleStatusMutate } = useShopsProductsProductOptionsSaleStatusUpdate({
    mutation: {
      onSuccess: () => refetchProductOptionGroups(),
      onError: () => alert(t('common:err_occurred'))
    }
  })

  const handleSaleStatusChange = async (e: ChangeEvent<HTMLSelectElement>, option: AdminProductOptionRes) => {
    if (!e?.target?.value || e.target.value === option?.saleStatus) return
    const confirm = window.confirm(t('menu:status_update_content'))
    if (!confirm) return
    const saleStatus = e.target.value as SaleStatusEnum

    try {
      await updateProductOptionSaleStatusMutate({
        shopPk: String(shopId),
        productPk: product.id,
        id: option.id,
        data: { saleStatus }
      })
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  }

  const handleOptionGroupAddButtonClick = () => {
    optionGroupAddModalControls.handleOpen()
  }
  const handleOptionGroupSeriesChangeButtonClick = () => {
    optionGroupSeriesChangeModalControls.handleOpen()
  }
  const handleOptionsSeriesChangeButtonClick = (optionGroup: AdminProductOptionGroupRes) => {
    optionSeriesChangeModalControls.setModalData({ optionGroup })
    optionSeriesChangeModalControls.handleOpen()
  }
  const handleOptionsUpdateButtonClick = (optionGroup: AdminProductOptionGroupRes) => {
    optionUpdateModalControls.setModalData({ optionGroup })
    optionUpdateModalControls.handleOpen()
  }
  const handleOptionGroupRefresh = async () => {
    try {
      await refetchProductsSelectedCategory()
      await refetchProductOptionGroups()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  }

  const isEmptyProductOptionGroups = DataUtils.isEmpty(productOptionGroups)
  const isAbleAddOptionGroups = !!product.id
  const isAbleUpdateOptionGroups = !!product.id
  const isAbleOptionGroupSeriesChange = !!productOptionGroups && productOptionGroups.length > 1

  return (
    <div className={`flex ${isAndroid ? 'w-[920px]' : 'w-[1000px]'} flex-col`}>
      <Modal.Header title={t('menu:modal.option_detail.title')} />
      <HighLightModalSubtitle highLightText={product?.name} text={t('menu:modal.option_detail.description')} />
      <div className="ml-auto flex items-center justify-center gap-[20px] overflow-y-auto">
        <IconButton
          iconName={IconNamesEnum.SwitchVertical}
          text={t('menu:modal.option_detail.series-change-option-group')}
          onClick={handleOptionGroupSeriesChangeButtonClick}
          disabled={!isAbleOptionGroupSeriesChange}
        />
        <button className="btn-md btn ml-4 h-5 bg-[#00B2E3] text-[#2B303B]" onClick={handleOptionGroupAddButtonClick}>
          {t('menu:modal.option_detail.add-option-button')}
        </button>
      </div>
      <Table>
        {isEmptyProductOptionGroups ? (
          <Table.Content
            emptyElement={t('menu:modal.option_detail.empty-text')}
            columns={getColumns(t)}
            contents={[]}
            emptyWrapperClassName="h-[300px]"
          />
        ) : (
          productOptionGroups?.map((group, index) => {
            const isRequiredOptionGroup = group.minCount && group.minCount > 0
            const isAbleOptionSeriesChange = group.productOptions.length > 1
            return (
              <Table.Column
                key={group?.id}
                summary={
                  <div className="flex items-center gap-[8px]">
                    <span>{`${index + 1}. ${group?.name}`}</span>
                    <span className="flex text-[12px] text-[#6E7380]">
                      {isRequiredOptionGroup
                        ? t('menu:modal.option_detail.option-group-desscription.required', {
                            minCount: group.minCount,
                            maxCount: group.maxCount
                          })
                        : t('menu:modal.option_detail.option-group-desscription.optional')}
                    </span>
                  </div>
                }>
                <div className="flex w-full flex-col">
                  <div className="flex h-[40px] items-center gap-[20px] pl-[10px]">
                    <IconButton
                      iconName={IconNamesEnum.Pen}
                      text={t('menu:modal.option_detail.option-update-button')}
                      onClick={() => handleOptionsUpdateButtonClick(group)}
                    />
                    <div className="h-[13px] w-[1px] bg-[#353A46]" />
                    <IconButton
                      iconName={IconNamesEnum.SwitchVertical}
                      text={t('menu:table-row-header.menu-series-change')}
                      onClick={() => handleOptionsSeriesChangeButtonClick(group)}
                      disabled={!isAbleOptionSeriesChange}
                    />
                  </div>
                  <Table.Content
                    emptyWrapperClassName="h-[300px]"
                    emptyElement={t('menu:modal.option_detail.empty-text')}
                    columns={getColumns(t)}
                    contents={group?.productOptions?.map((option, index) => {
                      return {
                        row: [
                          {
                            key: 'optionName',
                            content: `${index + 1}. ${option.name}`
                          },
                          {
                            key: 'unitPrice',
                            content: '+ ' + toUnitPrice(option.unitPrice)
                          },
                          {
                            key: 'sellStatus',
                            content: (
                              <select
                                className="select w-[120px] max-w-xs"
                                value={option?.saleStatus}
                                onChange={(e) => handleSaleStatusChange(e, option)}>
                                {Object.keys(SaleStatusEnum).map((saleStatus) => (
                                  <option key={saleStatus} value={saleStatus}>
                                    {getSaleStatusEnumText(t, saleStatus as SaleStatusEnum)}
                                  </option>
                                ))}
                              </select>
                            )
                          }
                        ]
                      }
                    })}
                  />
                </div>
              </Table.Column>
            )
          })
        )}
      </Table>
      {isAbleOptionGroupSeriesChange && (
        <OptionGroupSeriesChangeModal
          shopId={shopId}
          product={product}
          modalProps={optionGroupSeriesChangeModalControls}
          productOptionGroups={productOptionGroups}
          refetchProductOptionGroups={refetchProductOptionGroups}
        />
      )}
      {isAbleAddOptionGroups && (
        <OptionGroupAddModal
          shopId={shopId}
          productId={product.id}
          modalProps={optionGroupAddModalControls}
          onOptionGroupRefresh={handleOptionGroupRefresh}
        />
      )}
      {isAbleUpdateOptionGroups && (
        <OptionGroupUpdateModal
          shopId={shopId}
          productId={product.id}
          modalProps={optionUpdateModalControls}
          onOptionGroupRefresh={handleOptionGroupRefresh}
        />
      )}
      <OptionSeriesChangeModal
        shopId={shopId}
        productId={product.id}
        modalProps={optionSeriesChangeModalControls}
        refetchProductOptionGroups={refetchProductOptionGroups}
      />
    </div>
  )
}

export default OptionDetailModal
