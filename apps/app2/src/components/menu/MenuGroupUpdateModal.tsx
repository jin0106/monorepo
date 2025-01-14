import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useShopsProductCategoriesBulkUpdatePartialUpdate } from '@/api/generated/hooks'
import { type AdminProductCategoryRequest, AdminProductCategoryRes } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import { Direction } from '@/components/form/FieldSet'
import TextInput from '@/components/form/TextInput'
import { MAX_LENGTH_MENU_GROUP_NAME } from '@/components/menu/MenuGroupAddModal'
import UnderLineTextButton from '@/components/menu/UnderLineTextButton'
import { ModalPropsType } from '@/hooks/common/useModal'
import useForm from '@/hooks/form/useForm'
import { ApiUtils } from '@/utils/apiUtils'
import DataUtils from '@/utils/design-system/dataUtils'

interface MenuGroupUpdateModalProps {
  shopId: number
  modalProps: ModalPropsType
  productCategories: AdminProductCategoryRes[]
  refetchProductCategories: () => void
}

const MenuGroupUpdateModal = (props: MenuGroupUpdateModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuGroupUpdateModalContent {...props} />
    </Modal>
  )
}

const MENU_GROUP_UPDATE_FORM_ID = 'menu-group-update-form'
const getMenuGroupNameFormFieldName = (menuId?: number) => {
  if (DataUtils.isEmpty(menuId)) return
  return 'name' + menuId
}
const extractMenuGroupIdFromFieldName = (fieldName: string) => {
  return Number(fieldName.replace('name', ''))
}

const MenuGroupUpdateModalContent = ({
  modalProps,
  shopId,
  productCategories,
  refetchProductCategories
}: MenuGroupUpdateModalProps) => {
  const getInitMenuGroupFormData = () => {
    const obj: Record<string, string> = {}
    productCategories.forEach((categories) => {
      if (DataUtils.isEmpty(categories.id)) return
      obj[getMenuGroupNameFormFieldName(categories.id) as string] = categories.name
    })
    return obj
  }

  const [isEdited, setIsEdited] = useState(false)

  const mainMenuGroupId = productCategories.find((category) => !!category.isMain)?.id

  const {
    setValue,
    unregister,
    registers: { regi },
    handleSubmit,
    formState: { isValid },
    getValues
  } = useForm<Record<string, string>>({
    mode: 'onBlur',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: getInitMenuGroupFormData()
  })

  const menuGroupFieldList = Object.keys(getValues())
  const { mutateAsync: updateBulkMenuGroupMutate, isLoading: isUpdateBulkMenuGroupLoading } =
    useShopsProductCategoriesBulkUpdatePartialUpdate()
  const { t } = useTranslation()

  const hanldeUpdateMenuSubmit = handleSubmit(async (formData) => {
    const getCategoriesBulk = (): AdminProductCategoryRequest[] => {
      return Object.entries(formData).map(([menuGroupFieldName, name]) => {
        return { id: extractMenuGroupIdFromFieldName(menuGroupFieldName), name }
      })
    }
    try {
      await updateBulkMenuGroupMutate(
        { shopPk: shopId, data: { categories: getCategoriesBulk() } },
        {
          onError: (error) => {
            ApiUtils.onErrorAlert(error)
          }
        }
      )
      await refetchProductCategories()
      modalProps.handleClose()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  })

  const deleteMenuGroup = (menuGroupIdWillDelete: number) => {
    unregister(getMenuGroupNameFormFieldName(menuGroupIdWillDelete))
  }

  const normalMenuGroupsFieldNames = menuGroupFieldList.filter(
    (menuGroupFieldName) => menuGroupFieldName !== getMenuGroupNameFormFieldName(mainMenuGroupId)
  )
  const mainMenuGroupFieldName = menuGroupFieldList.filter(
    (menuGroupFieldName) => menuGroupFieldName === getMenuGroupNameFormFieldName(mainMenuGroupId)
  )?.[0]

  const handleMenuGroupNameFieldChange = (value: string, fieldName: string) => {
    const originMeueGroupName = productCategories.find(
      (menuGroup) => menuGroup.id === extractMenuGroupIdFromFieldName(fieldName)
    )?.name
    const newValue = value.trimStart()
    setValue(fieldName, newValue)
    setIsEdited(newValue !== originMeueGroupName)
  }

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-group-update-modal.title')}</span>
      </Modal.Header>
      <form
        id={MENU_GROUP_UPDATE_FORM_ID}
        className="flex max-h-[440px] w-full flex-col divide-y divide-white/20 overflow-auto px-[24px] py-[16px]"
        onSubmit={hanldeUpdateMenuSubmit}>
        {mainMenuGroupFieldName && (
          <div className="flex h-[68px] min-h-[68px] items-center justify-between gap-[24px]">
            <span className="text-14 text-white">0</span>
            <span className="ml-[10px] w-full text-[14px] text-white">
              {t('menu:menu-group-update-modal.represent-menu-group-name')}
            </span>
            <UnderLineTextButton
              text={t('common:delete')}
              onClick={() => {
                deleteMenuGroup(extractMenuGroupIdFromFieldName(mainMenuGroupFieldName))
                setIsEdited(true)
              }}
            />
          </div>
        )}
        {normalMenuGroupsFieldNames.map((menuGroupFieldName, index) => {
          const menuGroupId = extractMenuGroupIdFromFieldName(menuGroupFieldName)
          return (
            <div className="flex w-full items-center justify-between gap-[24px]" key={menuGroupId}>
              <span className="text-14 text-white">{index + 1}</span>
              <TextInput
                {...regi(menuGroupFieldName)}
                inputMode="text"
                direction={Direction.ROW}
                validate={(value) => {
                  if (DataUtils.isEmpty(value)) return false
                  return value.length <= MAX_LENGTH_MENU_GROUP_NAME
                    ? true
                    : t('common:input-validate.max-length', { maxLength: MAX_LENGTH_MENU_GROUP_NAME })
                }}
                wrapperClassName="w-full"
                className="bg-[#393F4E]"
                required
                onChange={(value) => handleMenuGroupNameFieldChange(value, menuGroupFieldName)}
              />
              <UnderLineTextButton
                text={t('common:delete')}
                onClick={() => {
                  deleteMenuGroup(menuGroupId)
                  setIsEdited(true)
                }}
              />
            </div>
          )
        })}
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
            form={MENU_GROUP_UPDATE_FORM_ID}
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-white"
            disabled={!isValid || !isEdited}
            type="submit">
            {t('common:save')}
          </button>
        </div>
      </Modal.Footer>
      {isUpdateBulkMenuGroupLoading && <LoadingOverlay />}
    </div>
  )
}

export default MenuGroupUpdateModal
