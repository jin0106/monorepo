import React from 'react'
import { useTranslation } from 'next-i18next'
import { useFieldArray } from 'react-hook-form'
import { useShopsProductsProductOptionGroupsPartialUpdate } from '@/api/generated/hooks'
import { AdminProductOptionGroupCreateReqRequest, AdminProductOptionGroupRes } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import OptionGroupDeleteModal from '@/components/menu/OptionGroupDeleteModal'
import OptionGroupForm from '@/components/menu/OptionGroupForm'
import UnderLineTextButton from '@/components/menu/UnderLineTextButton'
import useModal, { ModalPropsType } from '@/hooks/common/useModal'
import useForm from '@/hooks/form/useForm'
import { ApiUtils } from '@/utils/apiUtils'

interface OptionGroupUpdateModalProps {
  shopId: number
  productId: number
  modalProps: ModalPropsType<{ optionGroup: AdminProductOptionGroupRes }>
  onOptionGroupRefresh: () => Promise<void>
}

const OPTION_GROUP_UPDATE_FORM_ID = 'option-group-update-form'

const OptionGroupUpdateModalContent = ({
  shopId,
  productId,
  modalProps,
  onOptionGroupRefresh
}: OptionGroupUpdateModalProps) => {
  const { optionGroup } = modalProps.modalData
  const formControls = useForm<AdminProductOptionGroupCreateReqRequest>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {
      name: optionGroup.name,
      maxCount: optionGroup.maxCount ?? 0,
      minCount: optionGroup.minCount ?? 0,
      productOptions: optionGroup.productOptions
    }
  })

  const {
    handleSubmit,
    formState: { isValid },
    control
  } = formControls

  const fieldArrayControls = useFieldArray({ control, name: 'productOptions' })

  const { mutateAsync: updateOptionGroupMutate, isLoading: isUpdateOptionGroupLoading } =
    useShopsProductsProductOptionGroupsPartialUpdate()
  const optionGroupDeleteModalControls = useModal()

  const { t } = useTranslation()

  const handleFormSubmit = handleSubmit(async (submitData) => {
    try {
      await updateOptionGroupMutate(
        {
          shopPk: shopId,
          productPk: productId,
          id: optionGroup.id,
          data: {
            ...submitData
          }
        },
        {
          onError: (error) => ApiUtils.onErrorAlert(error)
        }
      )
      await onOptionGroupRefresh()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }

    modalProps.handleClose()
  })

  const handleOptionGroupDeleteButtonClick = () => {
    optionGroupDeleteModalControls.handleOpen()
  }
  const handleOptionGroupDelete = async () => {
    await onOptionGroupRefresh()
    modalProps.handleClose()
  }

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header title={t('menu:modal.option_detail.update-option-group-modal.ok-button')} />
      <UnderLineTextButton className="ml-auto" text={t('common:delete')} onClick={handleOptionGroupDeleteButtonClick} />
      <OptionGroupForm
        formId={OPTION_GROUP_UPDATE_FORM_ID}
        formControls={formControls}
        onSubmit={handleFormSubmit}
        fieldArrayControls={fieldArrayControls}
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
            form={OPTION_GROUP_UPDATE_FORM_ID}
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            disabled={!isValid}
            type="submit">
            {t('menu:modal.option_detail.update-option-group-modal.ok-button')}
          </button>
        </div>
      </Modal.Footer>
      <OptionGroupDeleteModal
        modalProps={optionGroupDeleteModalControls}
        shopId={shopId}
        productId={productId}
        optionGroup={optionGroup}
        onDeleteOptionGroup={handleOptionGroupDelete}
      />
      {isUpdateOptionGroupLoading && <LoadingOverlay />}
    </div>
  )
}

const OptionGroupUpdateModal = (props: OptionGroupUpdateModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <OptionGroupUpdateModalContent {...props} />
    </Modal>
  )
}

export default OptionGroupUpdateModal
