import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { AdminProductCategoryRes, type AdminProductCreateReqRequest } from '@/api/generated/types'
import { AXIOS_INSTANCE, getAccessToken } from '@/api/mutator/custom-instance'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import MenuForm from '@/components/menu/MenuForm'
import { ModalPropsType } from '@/hooks/common/useModal'
import useForm from '@/hooks/form/useForm'
import { ApiUtils } from '@/utils/apiUtils'

interface MenuCreateModalProps {
  shopId: number
  modalProps: ModalPropsType
  refetchProductCategories: () => Promise<void>
  refetchProductsSelectedCategory: () => Promise<void>
  mainCategory?: AdminProductCategoryRes
  selectedCategory?: AdminProductCategoryRes
}

const MENU_CREATE_FORM_ID = 'menu-create-form'

const MenuCreateModalContent = ({
  shopId,
  selectedCategory,
  mainCategory,
  modalProps,
  refetchProductCategories,
  refetchProductsSelectedCategory
}: MenuCreateModalProps) => {
  const formControls = useForm<AdminProductCreateReqRequest>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {
      description: '',
      productCategories: [selectedCategory?.id]
    }
  })
  const {
    handleSubmit,
    formState: { isValid }
  } = formControls

  const [isCreateMenuLoading, setIsCreateMenuLoading] = useState(false)

  // orval custom-form-data를 써서 formData 직렬화 커스텀을 해야하는데 사이드 이팩트 범위가 커져서 이렇게 커스텀 합니다.
  const createMenuMutate = (formData: FormData) => {
    const accessToken = getAccessToken()
    return AXIOS_INSTANCE.post(`/admin/shops/${shopId}/products/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` })
      }
    })
  }

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
      setIsCreateMenuLoading(true)
      await createMenuMutate(formData)
      await refetchProductCategories()
      await refetchProductsSelectedCategory()
      modalProps.handleClose()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    } finally {
      setIsCreateMenuLoading(false)
    }
  })

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-create-modal.title')}</span>
      </Modal.Header>
      <MenuForm
        formId={MENU_CREATE_FORM_ID}
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
            form={MENU_CREATE_FORM_ID}
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            type="submit"
            disabled={!isValid}>
            {t('menu:menu-create-modal.ok-button')}
          </button>
        </div>
      </Modal.Footer>
      {isCreateMenuLoading && <LoadingOverlay />}
    </div>
  )
}

const MenuCreateModal = (props: MenuCreateModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuCreateModalContent {...props} />
    </Modal>
  )
}

export default MenuCreateModal
