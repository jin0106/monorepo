import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { AdminProductCategoryRes, AdminProductCreateReqRequest } from '@/api/generated/types'
import { Direction } from '@/components/form/FieldSet'
import FileInput, { Accepts } from '@/components/form/FileInput'
import Label from '@/components/form/Label'
import TextArea from '@/components/form/TextArea'
import TextInput from '@/components/form/TextInput'
import { LocaleMaxOptionPriceMap } from '@/constants/i18n'
import useLocale from '@/hooks/common/useLocale'
import { FormControlType } from '@/hooks/form/useForm'
import { ComponentUtils } from '@/utils/design-system/componentUtils'
import DataUtils from '@/utils/design-system/dataUtils'
import { Validator } from '@/utils/design-system/validator'

interface MenuFormProps {
  formId: string
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  formControls: FormControlType<AdminProductCreateReqRequest>
  mainCategory?: AdminProductCategoryRes
  selectedCategory?: AdminProductCategoryRes
  mainImage?: string | null
}

const MAX_LENGTH_MENU_NAME = 254
const MAX_LENGTH_MENU_DESCRIPTION = 500
const MAX_MENU_IMAGE_WIDTH_HEIGHT = {
  Width: 750,
  Height: 468
}
const MAX_MENU_IMAGE_SIZE_MB = 2

const MenuForm = ({ formId, formControls, onSubmit, mainCategory, selectedCategory, mainImage }: MenuFormProps) => {
  const { t } = useTranslation()
  const {
    getValues,
    watch,
    setValue,
    setError,
    registers: { regi }
  } = formControls

  const { locale } = useLocale()
  const [isMainChecked, setMainChecked] = useState(
    !!watch('productCategories').find((categoryId) => categoryId === mainCategory?.id)
  )

  const handleMainMenuCheckChange = () => {
    if (!mainCategory) return
    if (isMainChecked) {
      setValue('productCategories', [
        ...getValues('productCategories').filter((categoryId) => categoryId !== mainCategory.id)
      ])
    } else {
      setValue('productCategories', [...getValues('productCategories'), mainCategory.id])
    }
    setMainChecked((prev) => !prev)
  }

  const maxPrice = LocaleMaxOptionPriceMap[locale]

  const [mainImageUrl, setMainImageUrl] = useState<string>(mainImage || '')
  useEffect(() => {
    return () => {
      if (mainImageUrl) {
        URL.revokeObjectURL(mainImageUrl)
      }
    }
  }, [])

  return (
    <form className="flex w-full flex-col gap-[10px]" id={formId} onSubmit={onSubmit}>
      <div className="flex w-full flex-col gap-[10px] p-2">
        <Label title={t('menu:menu-group-add-modal.menu-group-name.label')} />
        <div className="flex w-full items-center justify-between gap-[15px]">
          <input
            className={ComponentUtils.cn('input min-h-[48px] w-full flex-1')}
            type="text"
            value={selectedCategory?.isMain ? t('menu:menu-create-modal.main-menu') : selectedCategory?.name}
            disabled={true}
            readOnly={true}
          />
          {mainCategory && selectedCategory?.id !== mainCategory.id && (
            <label className="flex cursor-pointer items-center gap-[4px]">
              <input
                type="checkbox"
                onChange={handleMainMenuCheckChange}
                className="checkbox-info checkbox checkbox-sm"
                checked={isMainChecked}
              />
              <span className="whitespace-nowrap text-[14px] text-white">{t('menu:menu-create-modal.main-menu')}</span>
            </label>
          )}
        </div>
      </div>
      <TextInput
        {...regi('name')}
        inputMode="text"
        direction={Direction.COLUMN}
        validate={{
          validateEmpty: (value) => Validator.validateIsEmpty(value),
          validateMaxLength: (value) =>
            Validator.validateMaxLength(
              value!,
              MAX_LENGTH_MENU_NAME,
              t('common:input-validate.max-length', { maxLength: MAX_LENGTH_MENU_NAME })
            )
        }}
        className="w-full bg-[#393F4E]"
        onChange={(value) => setValue('name', value.trimStart())}
        label={{ title: t('menu:menu-create-modal.menu-name.label') }}
        required={true}
      />
      <TextInput
        {...regi('unitPrice')}
        type="number"
        inputMode="numeric"
        valueUnit={t('common:price_unit')}
        direction={Direction.COLUMN}
        validate={{
          validateUnitCount: (value) => Validator.validateUnitCount(value),
          validateRange: (value) =>
            Validator.validateRange(value!, 0, maxPrice, t('menu:menu-create-modal.unit-price.validator-text'))
        }}
        className="w-full bg-[#393F4E]"
        label={{ title: t('common:price.label') }}
        required={true}
      />
      <FileInput
        presetImage={mainImageUrl}
        isShowFileName={false}
        className="w-full max-w-full bg-[#393F4E]"
        {...regi('mainImage')}
        label={{ title: t('menu:menu-create-modal.image.label') }}
        helperText={t('common:add-image.helper', {
          width: MAX_MENU_IMAGE_WIDTH_HEIGHT.Width,
          height: MAX_MENU_IMAGE_WIDTH_HEIGHT.Height,
          fileSize: MAX_MENU_IMAGE_SIZE_MB
        })}
        accept={Accepts.Image}
        onChange={async (file, e) => {
          if (!file || !file.type || !e) return
          const confirm = window.confirm(t('menu:image_upload_content'))
          if (!confirm) {
            e.target.value = ''
          }
          const validateResultFileType = Validator.validateFileType(
            file,
            Accepts.Image,
            t('common:input.validate.file_type_image.not_allowed')
          )
          if (validateResultFileType !== true) {
            setError('mainImage', { message: validateResultFileType === false ? '' : validateResultFileType })
            e.target.value = ''
            return
          }
          const validateResultFileSize = Validator.validateFileSize(
            file,
            1024 * 1024 * MAX_MENU_IMAGE_SIZE_MB,
            t('common:input.validate.file_size_smaller', { size: MAX_MENU_IMAGE_SIZE_MB })
          )
          if (validateResultFileSize !== true) {
            setError('mainImage', {
              message: validateResultFileSize === false ? '' : validateResultFileSize
            })
            e.target.value = ''
            return
          }
          setMainImageUrl(URL.createObjectURL(file))
        }}
      />
      <TextArea
        {...regi('description')}
        className="resize-none bg-[#393F4E]"
        placeholder={t('menu:menu-create-modal.menu-description.placeholder')}
        validate={{
          validateMaxLength: (value) => {
            if (value === '') return true
            if (DataUtils.isNullOrUndefined(value)) return true
            return Validator.validateMaxLength(
              value,
              MAX_LENGTH_MENU_DESCRIPTION,
              t('common:input-validate.max-length', { maxLength: MAX_LENGTH_MENU_DESCRIPTION })
            )
          }
        }}
        rows={4}
      />
    </form>
  )
}

export default MenuForm
