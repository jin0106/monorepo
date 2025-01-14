import { useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'next-i18next'
import { createContainer } from 'unstated-next'
import {
  useShopsProductCategoriesList,
  useShopsProductCategoriesProductsList,
  useShopsProductsExcelCreate,
  useShopsProductsMainImageUpdate,
  useShopsProductsSaleStatusUpdate
} from '@/api/generated/hooks'
import { AdminProductCategoryRes, AdminProductRes, SaleStatusEnum, UserTypeEnum } from '@/api/generated/types'
import Icon from '@/components/common/Icon'
import { TableContentsType } from '@/components/common/tables/TableContent'
import { Accepts, isFileTypeImage } from '@/components/form/FileInput'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import { getSaleStatusEnumText } from '@/constants/orderStatusText'
import useLocale from '@/hooks/common/useLocale'
import useModal from '@/hooks/common/useModal'

const useMenu = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Menu, I18nNamespaceEnum.Common])
  const { toUnitPrice } = useLocale()
  // menu list
  const [selectedShop, setSelectedShop] = useState<number>()
  const { data: productCategories, refetch: refetchProductCategories } = useShopsProductCategoriesList(
    selectedShop || 0,
    {},
    {
      query: { enabled: !!selectedShop }
    }
  )
  const [selectedCategory, setSelectedCategory] = useState<AdminProductCategoryRes>()

  const { data: productsSelectedCategory, refetch: refetchProductsSelectedCategory } =
    useShopsProductCategoriesProductsList(selectedShop || 0, selectedCategory?.id || 0, {
      query: { enabled: !!selectedCategory && !!selectedShop }
    })

  const menuUpdateModalControls = useModal<{ menu: AdminProductRes }>()
  const menuDeleteModalControls = useModal<{ menu: AdminProductRes }>()

  const handleMenuUpdateButtonClick = (selectedMenu: AdminProductRes) => {
    menuUpdateModalControls.setModalData({ menu: selectedMenu })
    menuUpdateModalControls.handleOpen()
  }

  const handleMenuDeleteButtonClick = (selectedMenu: AdminProductRes) => {
    menuDeleteModalControls.setModalData({ menu: selectedMenu })
    menuDeleteModalControls.handleOpen()
  }

  const productsContent: TableContentsType[] =
    productsSelectedCategory?.map((product, index) => {
      return {
        row: [
          {
            key: 'menuName',
            content: <span>{`${index + 1}. ${product?.name}`}</span>
          },
          {
            key: 'unitPrice',
            content: toUnitPrice(product?.unitPrice)
          },
          {
            key: 'sellStatus',
            content: (
              <Permission
                allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN]}
                disallowElement={getSaleStatusEnumText(t, product?.saleStatus)}>
                <select
                  value={product?.saleStatus}
                  className="select select-sm w-[120px] max-w-xs"
                  onChange={async (e) => {
                    if (!e?.target?.value || e.target.value === product?.saleStatus) return
                    const confirm = window.confirm(t('menu:status_update_content'))
                    if (!confirm) return
                    const saleStatus = e.target.value as SaleStatusEnum
                    await createProductStatusMutate({ shopPk: selectedShop || 0, id: product.id, data: { saleStatus } })
                  }}>
                  {Object.keys(SaleStatusEnum).map((saleStatus) => (
                    <option key={saleStatus} value={saleStatus}>
                      {getSaleStatusEnumText(t, saleStatus as SaleStatusEnum)}
                    </option>
                  ))}
                </select>
              </Permission>
            )
          },
          {
            key: 'optionDetail',
            content: (
              <button
                className="underline"
                onClick={() => {
                  optionDetailModalProps.setModalData({ product: product })
                  optionDetailModalProps.handleOpen()
                }}>
                {t('menu:option_count', { n: product?.productOptionCount || 0 })}
              </button>
            )
          },
          {
            key: 'menuImage',
            content: (
              <>
                {product?.mainImage?.fullSize && (
                  <a href={product.mainImage.fullSize} target="_blank" className="underline">
                    image
                  </a>
                )}
                <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN]}>
                  <label className="btn flex items-center gap-[5px] p-2 text-white">
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    <span>{t('menu:image_upload')}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept={Accepts.Image}
                      onChange={async (e) => {
                        const file = e?.target?.files?.[0]
                        if (!file) return
                        if (!isFileTypeImage(file)) {
                          alert(t('common:input.validate.file_type_image'))
                          return
                        }
                        const fileMaxSizeMB = 2
                        if (file.size > 1024 * 1024 * fileMaxSizeMB) {
                          alert(t('common:input.validate.file_size_smaller', { size: fileMaxSizeMB }))
                          return
                        }
                        const confirm = window.confirm(t('menu:image_upload_content'))
                        if (!confirm) return
                        await updateProductsMainImageMutate({
                          shopPk: selectedShop || 0,
                          id: product.id,
                          data: { mainImage: file }
                        })
                      }}
                    />
                  </label>
                </Permission>
              </>
            )
          },
          {
            key: 'optionUpdate',
            content: (
              <button className="btn flex items-center text-white" onClick={() => handleMenuUpdateButtonClick(product)}>
                <Icon name={IconNamesEnum.Pen} className="h-[16px] w-[16px]" />
                {t('common:update')}
              </button>
            )
          },
          {
            key: 'optionDelete',
            content: (
              <button className="btn text-white" onClick={() => handleMenuDeleteButtonClick(product)}>
                {t('common:delete')}
              </button>
            )
          }
        ]
      }
    }) || []

  // excel 파일 업로드
  const { mutate: createExcelUploadMutate, isLoading: isCreateExcelUploadMutateLoading } = useShopsProductsExcelCreate({
    mutation: {
      onSuccess: () => {
        refetchProductCategories()
        alert('업로드 성공')
      },
      onError: (error) => {
        alert(error.response?.data ?? '오류가 발생했습니다.')
      }
    }
  })
  const uploadExcelFile = (file: File) => {
    createExcelUploadMutate({ shopPk: selectedShop || 0, data: { excel: file } })
  }

  // 메뉴 이미지 파일 업로드
  const { mutate: updateProductsMainImageMutate, isLoading: isUpdateProductsMainImageMutateLoading } =
    useShopsProductsMainImageUpdate({
      mutation: {
        onSuccess: () => refetchProductsSelectedCategory(),
        onError: () => {
          alert('오류가 발생했습니다.')
        }
      }
    })

  // 메뉴 상태 변경
  const { mutateAsync: createProductStatusMutate, isLoading: isCreateProductStatusMutateLoading } =
    useShopsProductsSaleStatusUpdate({
      mutation: {
        onSuccess: () => refetchProductsSelectedCategory(),
        onError: () => {
          alert('오류가 발생했습니다.')
        }
      }
    })

  // 옵션 상세
  const optionDetailModalProps = useModal<{ product: AdminProductRes }>()

  const isLoading =
    isCreateExcelUploadMutateLoading || isCreateProductStatusMutateLoading || isUpdateProductsMainImageMutateLoading

  return {
    productsSelectedCategory,
    selectedShop,
    setSelectedShop,
    productsContent,
    productCategories,
    refetchProductCategories: async () => {
      await refetchProductCategories()
    },
    refetchProductsSelectedCategory: async () => {
      await refetchProductsSelectedCategory()
    },
    uploadExcelFile,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    optionDetailModalProps,
    menuUpdateModalControls,
    menuDeleteModalControls
  }
}

const MenuContainer = createContainer(useMenu)

export default MenuContainer
