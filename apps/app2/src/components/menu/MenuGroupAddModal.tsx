import React from 'react'
import { useTranslation } from 'next-i18next'
import { useShopsProductCategoriesCreate } from '@/api/generated/hooks'
import { AdminProductCategoryCreateReqRequest, AdminProductCategoryRes } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import { Direction } from '@/components/form/FieldSet'
import TextInput from '@/components/form/TextInput'
import { ModalPropsType } from '@/hooks/common/useModal'
import useForm from '@/hooks/form/useForm'
import { ApiUtils } from '@/utils/apiUtils'
import DataUtils from '@/utils/design-system/dataUtils'

interface MenuGroupAddModalProps {
  shopId: number
  modalProps: ModalPropsType
  refetchProductCategories: () => void
  mainCategory?: AdminProductCategoryRes
}

export const MAX_LENGTH_MENU_GROUP_NAME = 30
const MENU_GROUP_ADD_FORM_ID = 'menu-group-add-form'

const MenuGroupAddModalContent = ({
  shopId,
  mainCategory,
  modalProps,
  refetchProductCategories
}: MenuGroupAddModalProps) => {
  const {
    getValues,
    registers: { regi },
    handleSubmit,
    formState: { isValid },
    watch,
    setValue,
  } = useForm<Omit<AdminProductCategoryCreateReqRequest, 'shop'>>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {}
  })

  const { mutateAsync: createMenuGroupMutate, isLoading: isCreateMenuGroupLoading } = useShopsProductCategoriesCreate()
  const menuGroupName = watch('name')

  const { t } = useTranslation()

  const handleFormSubmit = handleSubmit(async (submitData) => {
    try {
      await createMenuGroupMutate(
        {
          shopPk: shopId,
          data: {
            ...submitData,
            name: submitData.name.trimEnd()
          }
        },
        {
          onError: (error) => ApiUtils.onErrorAlert(error)
        }
      )
      await refetchProductCategories()
      modalProps.handleClose()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  })

  console.log('@@ menuGroup', DataUtils.isEmpty(menuGroupName), menuGroupName)

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-group-add-modal.title')}</span>
      </Modal.Header>
      <form className="flex w-full flex-col gap-[10px]" id={MENU_GROUP_ADD_FORM_ID} onSubmit={handleFormSubmit}>
        <TextInput
          {...regi('name')}
          inputMode="text"
          direction={Direction.COLUMN}
          validate={(value) => {
            if (!watch('isMain')) {
              if (DataUtils.isEmpty(value)) return false
              return value.length <= MAX_LENGTH_MENU_GROUP_NAME
                ? true
                : t('common:input-validate.max-length', { maxLength: MAX_LENGTH_MENU_GROUP_NAME })
            } else {
              return true
            }
          }}
          className="w-full bg-[#393F4E]"
          onChange={(value) => setValue('name', value.trimStart())}
          label={{ title: t('menu:menu-group-add-modal.menu-group-name.label') }}
          disabled={!!watch('isMain')}
          required
        />
        {!mainCategory && (
          <div className="ml-[5px] flex items-center gap-[5px]">
            <label className="flex w-[140px] cursor-pointer items-center gap-[4px]">
              <input
                onChange={() => {
                  if (!watch('isMain')) {
                    setValue('name', t('menu:menu-group-update-modal.represent-menu-group-name'), {
                      shouldDirty: true,
                      shouldValidate: true
                    })
                  } else {
                    setValue('name', '', { shouldDirty: true, shouldValidate: true })
                  }
                  setValue('isMain', !getValues('isMain'), { shouldDirty: true, shouldValidate: true })
                }}
                type="checkbox"
                className="checkbox-info checkbox checkbox-sm"
              />
              <span className="whitespace-nowrap text-[14px] text-white">
                {t('menu:menu-group-add-modal.main-menu-set.label-text')}
              </span>
            </label>
            <span className="text-[14px] text-white/20">
              {t('menu:menu-group-add-modal.main-menu-set.label-help-text')}
            </span>
          </div>
        )}
      </form>
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
            form={MENU_GROUP_ADD_FORM_ID}
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            disabled={!isValid}
            type="submit">
            {t('menu:menu-group-add-modal.ok-button')}
          </button>
        </div>
      </Modal.Footer>
      {isCreateMenuGroupLoading && <LoadingOverlay />}
    </div>
  )
}

const MenuGroupAddModal = (props: MenuGroupAddModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuGroupAddModalContent {...props} />
    </Modal>
  )
}

export default MenuGroupAddModal
