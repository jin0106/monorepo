import React from 'react'
import { useTranslation } from 'next-i18next'
import { useShopsProductsProductOptionGroupsDestroy } from '@/api/generated/hooks'
import { AdminProductOptionGroupRes } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'

interface OptionGroupDeleteModalProps {
  modalProps: ModalPropsType
  shopId: number
  productId: number
  optionGroup: AdminProductOptionGroupRes
  onDeleteOptionGroup: () => Promise<void>
}

const OptionGroupDeleteModalContent = ({
  modalProps,
  shopId,
  optionGroup,
  productId,
  onDeleteOptionGroup
}: OptionGroupDeleteModalProps) => {
  const { mutateAsync: deleteOptionGroup, isLoading: isDeleteOptionGroupLoading } =
    useShopsProductsProductOptionGroupsDestroy()

  const { t } = useTranslation()

  const handleDeleteButtonClick = async () => {
    try {
      await deleteOptionGroup(
        {
          shopPk: shopId,
          productPk: productId,
          id: optionGroup.id
        },
        {
          onError: (error) => ApiUtils.onErrorAlert(error)
        }
      )
      await onDeleteOptionGroup()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }

    modalProps.handleClose()
  }

  return (
    <div className="flex w-[560px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">
          {t('menu:modal.option_detail.delete-option-group-modal.title')}
        </span>
      </Modal.Header>
      <div className="flex flex-col px-[24px] py-[16px]">
        <span className="text-[16px] text-[#C4C4C4]">
          {t('menu:modal.option_detail.delete-option-group-modal.content')}
        </span>
        <span className="text-[16px] text-pink-700">
          {t('menu:modal.option_detail.delete-option-group-modal.warning-content')}
        </span>
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
      {isDeleteOptionGroupLoading && <LoadingOverlay />}
    </div>
  )
}

const OptionGroupDeleteModal = (props: OptionGroupDeleteModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <OptionGroupDeleteModalContent {...props} />
    </Modal>
  )
}

export default OptionGroupDeleteModal
