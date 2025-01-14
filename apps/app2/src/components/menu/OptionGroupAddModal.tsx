import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useFieldArray } from 'react-hook-form'
import { useShopsProductsProductOptionGroupsCreate } from '@/api/generated/hooks'
import { AdminProductOptionGroupCreateReqRequest } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import OptionGroupForm from '@/components/menu/OptionGroupForm'
import { ModalPropsType } from '@/hooks/common/useModal'
import useForm from '@/hooks/form/useForm'
import { ApiUtils } from '@/utils/apiUtils'

interface OptionGroupAddModalProps {
  shopId: number
  productId: number
  modalProps: ModalPropsType
  onOptionGroupRefresh: () => Promise<void>
}

const OPTION_GROUP_ADD_FORM_ID = 'option-group-add-form'

const OptionGroupAddModalContent = ({
  shopId,
  productId,
  modalProps,
  onOptionGroupRefresh
}: OptionGroupAddModalProps) => {
  const formControls = useForm<AdminProductOptionGroupCreateReqRequest>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {
      minCount: 0,
      maxCount: 1
    }
  })

  const fieldArrayControls = useFieldArray({ control: formControls.control, name: 'productOptions' })

  const {
    handleSubmit,
    formState: { isValid }
  } = formControls

  useEffect(() => {
    fieldArrayControls.append({ name: '', unitPrice: undefined })
  }, [])

  const { mutateAsync: createOptionGroupMutate, isLoading: isCreateOptionGroupLoading } =
    useShopsProductsProductOptionGroupsCreate()

  const { t } = useTranslation()

  const handleFormSubmit = handleSubmit(async (submitData) => {
    await createOptionGroupMutate(
      {
        shopPk: shopId,
        productPk: productId,
        data: {
          ...submitData
        }
      },
      {
        onError: (error) => ApiUtils.onErrorAlert(error)
      }
    )
    await onOptionGroupRefresh()
    modalProps.handleClose()
  })

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header title={t('menu:modal.option_detail.add-option-group-modal.title')} />
      <OptionGroupForm
        formId={OPTION_GROUP_ADD_FORM_ID}
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
            form={OPTION_GROUP_ADD_FORM_ID}
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            disabled={!isValid}
            type="submit">
            {t('menu:modal.option_detail.add-option-group-modal.ok-button')}
          </button>
        </div>
      </Modal.Footer>
      {isCreateOptionGroupLoading && <LoadingOverlay />}
    </div>
  )
}

const OptionGroupAddModal = (props: OptionGroupAddModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <OptionGroupAddModalContent {...props} />
    </Modal>
  )
}

export default OptionGroupAddModal
