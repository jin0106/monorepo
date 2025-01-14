import React from 'react'
import { useTranslation } from 'next-i18next'
import { useShopsProductsDestroy } from '@/api/generated/hooks'
import { AdminProductRes } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'

interface MenuDeleteModalProps {
  modalProps: ModalPropsType<{ menu: AdminProductRes }>
  shopId: number
  refetchProductCategories: () => void
  refetchProductsSelectedCategory: () => void
}

const MenuDeleteModalContent = ({
  modalProps,
  shopId,
  refetchProductCategories,
  refetchProductsSelectedCategory
}: MenuDeleteModalProps) => {
  const { mutateAsync: deleteMenuMutate, isLoading: isDeleteMenuMutateLoading } = useShopsProductsDestroy()

  const { t } = useTranslation()

  const handleDeleteButtonClick = async () => {
    try {
      await deleteMenuMutate(
        {
          shopPk: shopId,
          id: modalProps.modalData.menu.id
        },
        {
          onError: (error) => ApiUtils.onErrorAlert(error)
        }
      )
      await refetchProductCategories()
      await refetchProductsSelectedCategory()
      modalProps.handleClose()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  }

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-delete-modal.title')}</span>
      </Modal.Header>
      <div className="px-[24px] py-[16px]">
        <span className="text-[16px] text-[#C4C4C4]">{t('menu:menu-delete-modal.content')}</span>
      </div>
      <Modal.Footer>
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              modalProps.handleClose()
            }}
            className="btn-[#404C63] btn-outline btn h-[22px] w-1/2 px-6 normal-case">
            {t('common:cancel')}
          </button>
          <button
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            type="button"
            onClick={handleDeleteButtonClick}>
            {t('common:delete-button')}
          </button>
        </div>
      </Modal.Footer>
      {isDeleteMenuMutateLoading && <LoadingOverlay />}
    </div>
  )
}

const MenuDeleteModal = (props: MenuDeleteModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuDeleteModalContent {...props} />
    </Modal>
  )
}

export default MenuDeleteModal
