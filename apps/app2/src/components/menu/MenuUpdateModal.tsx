import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { AdminProductCategoryRes, type AdminProductCreateReqRequest, AdminProductRes } from '@/api/generated/types'
import { AXIOS_INSTANCE, getAccessToken } from '@/api/mutator/custom-instance'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import MenuForm from '@/components/menu/MenuForm'
import { ModalPropsType } from '@/hooks/common/useModal'
import useForm from '@/hooks/form/useForm'
import { ApiUtils } from '@/utils/apiUtils'

interface MenuUpdateModalProps {
  shopId: number
  modalProps: ModalPropsType<{ menu: AdminProductRes }>
  refetchProductCategories: () => Promise<void>
  refetchProductsSelectedCategory: () => Promise<void>
  mainCategory?: AdminProductCategoryRes
  selectedCategory?: AdminProductCategoryRes
}

const MENU_UPDATE_FORM_ID = 'menu-update-form'

const MenuUpdateModalContent = ({
  shopId,
  selectedCategory,
  mainCategory,
  modalProps,
  refetchProductCategories,
  refetchProductsSelectedCategory
}: MenuUpdateModalProps) => {
  const { menu } = modalProps.modalData
  const formControls = useForm<AdminProductCreateReqRequest>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {
      unitPrice: menu.unitPrice,
      name: menu.name,
      description: menu.description,
      productCategories: menu.productCategories
    }
  })

  const {
    handleSubmit,
    formState: { isValid }
  } = formControls

  // orval custom-form-data를 써서 formData 직렬화 커스텀을 해야하는데 사이드 이팩트 범위가 커져서 이렇게 커스텀 합니다.
  const updateMenuMutate = (formData: FormData) => {
    const accessToken = getAccessToken()
    return AXIOS_INSTANCE.patch(`/admin/shops/${shopId}/products/${modalProps.modalData.menu.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      }
    })
  }

  const [isUpdateMenuLoading, setIsUpdateMenuLoading] = useState(false)

  const { t } = useTranslation()

  const handleFormSubmit = handleSubmit(async (submitData) => {
    const formData = new FormData()
    Object.entries(submitData).forEach(([fieldName, fieldValue]) => {
      if (!!fieldValue && fieldName && typeof fieldName === 'string') {
        if (typeof fieldValue === 'number') {
          formData.append(fieldName, String(fieldValue))
        } else if (Array.isArray(fieldValue)) {
          fieldValue.forEach((atom) => {
            formData.append(fieldName, String(atom))
          })
        } else {
          formData.append(fieldName, fieldValue)
        }
      }
    })

    try {
      setIsUpdateMenuLoading(true)
      await updateMenuMutate(formData)
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    } finally {
      setIsUpdateMenuLoading(false)
      await refetchProductCategories()
      await refetchProductsSelectedCategory()
      modalProps.handleClose()
    }
  })

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-update-modal.title')}</span>
      </Modal.Header>
      <MenuForm
        mainImage={menu.mainImage.menuMain}
        formId={MENU_UPDATE_FORM_ID}
        formControls={formControls}
        mainCategory={mainCategory}
        selectedCategory={selectedCategory}
        onSubmit={handleFormSubmit}
      />
      <Modal.Footer>
        <div className="flex w-full gap-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              modalProps.handleClose()
            }}
            className="btn-[#404C63] btn-outline btn h-[22px] w-1/2 px-6 normal-case">
            {t('common:cancel')}
          </button>
          <button
            form={MENU_UPDATE_FORM_ID}
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            type="submit"
            disabled={!isValid}>
            {t('menu:menu-update-modal.ok-button')}
          </button>
        </div>
      </Modal.Footer>
      {isUpdateMenuLoading && <LoadingOverlay />}
    </div>
  )
}

const MenuUpdateModal = (props: MenuUpdateModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuUpdateModalContent {...props} />
    </Modal>
  )
}

export default MenuUpdateModal
