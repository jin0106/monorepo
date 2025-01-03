import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { UseFieldArrayReturn } from 'react-hook-form'
import { AdminProductOptionGroupCreateReqRequest } from '@/api/generated/types'
import { Direction } from '@/components/form/FieldSet'
import TextInput from '@/components/form/TextInput'
import IconButton from '@/components/menu/IconButton'
import UnderLineTextButton from '@/components/menu/UnderLineTextButton'
import { MAX_UNIT_COUNT } from '@/constants/count'
import { LocaleMaxOptionPriceMap } from '@/constants/i18n'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import useLocale from '@/hooks/common/useLocale'
import { FormControlType } from '@/hooks/form/useForm'
import DataUtils from '@/utils/design-system/dataUtils'
import { Validator } from '@/utils/design-system/validator'

export const MAX_LENGTH_OPTION_GROUP_NAME = 50
export const MAX_LENGTH_OPTION_NAME = 40
interface OptionGroupFormProps {
  formId: string
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  formControls: FormControlType<AdminProductOptionGroupCreateReqRequest>
  fieldArrayControls: UseFieldArrayReturn<AdminProductOptionGroupCreateReqRequest, 'productOptions', 'id'>
}

enum ValidateCountsErrorEnum {
  MIN_GREATER_MAX = 'MIN_GREATER_MAX',
  MAX_LEAST_ONE = 'MAX_LEAST_ONE',
  LIMIT_COUNT = 'LIMIT_COUNT',
  NOT_NUMBER = 'NOT_NUMBER'
}

const OptionGroupForm = ({ formId, formControls, fieldArrayControls, onSubmit }: OptionGroupFormProps) => {
  const { t } = useTranslation()
  const {
    registers: { regi },
    watch,
    setValue,
    clearErrors,
    getValues
  } = formControls

  const minCount = watch('minCount')
  const maxCount = watch('maxCount')

  const { append, remove, fields } = fieldArrayControls
  const [countsErrorValidateResult, setCountsErrorValidateResult] = useState<ValidateCountsErrorEnum | boolean>(true)
  const handleAddOptionButtonClick = () => {
    append({ name: '', unitPrice: undefined })
  }

  const getValidateCountsText = (validateCountsResult: ValidateCountsErrorEnum | boolean) => {
    switch (validateCountsResult) {
      case true:
        return undefined
      case ValidateCountsErrorEnum.MIN_GREATER_MAX:
      case ValidateCountsErrorEnum.MAX_LEAST_ONE:
        return t('menu:modal.option_detail.add-option-group-modal.maxCount.validator-text')
      case ValidateCountsErrorEnum.LIMIT_COUNT:
        return t('common:validate-text.unit-count.max', { count: MAX_UNIT_COUNT })
      case ValidateCountsErrorEnum.NOT_NUMBER:
        return undefined
      default:
        return undefined
    }
  }

  const validateCounts = () => {
    const minCount = Number(getValues('minCount'))
    const maxCount = Number(getValues('maxCount'))
    if (!(Validator.validateUnitCount(minCount) && Validator.validateUnitCount(maxCount))) {
      return ValidateCountsErrorEnum.NOT_NUMBER
    } else if (minCount > maxCount) {
      return ValidateCountsErrorEnum.MIN_GREATER_MAX
    } else if (maxCount < 1) {
      return ValidateCountsErrorEnum.MAX_LEAST_ONE
    } else if (minCount > MAX_UNIT_COUNT || maxCount > MAX_UNIT_COUNT) {
      return ValidateCountsErrorEnum.LIMIT_COUNT
    } else {
      clearErrors('minCount')
      clearErrors('maxCount')
      return true
    }
  }

  useEffect(() => {
    const testResult = validateCounts()
    setCountsErrorValidateResult(testResult)
  }, [minCount, maxCount])

  return (
    <form className="flex w-full flex-col gap-[10px] overflow-y-auto" id={formId} onSubmit={onSubmit}>
      <TextInput
        {...regi('name')}
        inputMode="text"
        direction={Direction.COLUMN}
        validate={{
          validateEmpty: (value) => Validator.validateIsEmpty(value),
          validateLength: (value) =>
            Validator.validateMaxLength(
              value,
              MAX_LENGTH_OPTION_GROUP_NAME,
              t('common:input-validate.max-length', { maxLength: MAX_LENGTH_OPTION_GROUP_NAME })
            )
        }}
        className="w-full bg-[#393F4E]"
        onChange={(value) => setValue('name', value.trimStart(), { shouldDirty: true })}
        label={{ title: t('menu:modal.option_detail.add-option-group-modal.name.label') }}
        required
      />
      <div className="flex w-full items-center gap-[4px]">
        <TextInput
          {...regi('minCount')}
          type="number"
          inputMode="numeric"
          direction={Direction.COLUMN}
          className="w-full bg-[#393F4E]"
          wrapperClassName="w-full"
          label={{ title: t('menu:modal.option_detail.add-option-group-modal.minCount.label') }}
          valueUnit={t('common:valueUnit.count')}
          validate={(value) => Validator.validateUnitCount(value) && validateCounts() === true}
          required
        />
        <span className="mt-[27px] text-[14px] text-[#8E95A8]">~</span>
        <TextInput
          {...regi('maxCount')}
          type="number"
          inputMode="numeric"
          direction={Direction.COLUMN}
          className="w-full bg-[#393F4E]"
          wrapperClassName="w-full"
          label={{ title: t('menu:modal.option_detail.add-option-group-modal.maxCount.label') }}
          valueUnit={t('common:valueUnit.count')}
          validate={(value) => Validator.validateUnitCount(value) && validateCounts() === true}
          required
        />
      </div>
      {countsErrorValidateResult !== true && (
        <span className="text-pink-700">{getValidateCountsText(countsErrorValidateResult)}</span>
      )}
      <div className="my-[20px] h-[1px] w-full bg-[#404C63]" />
      <div className="flex items-center justify-between">
        <span className="text-[14px] text-[#8E95A8]">
          {t('menu:modal.option_detail.add-option-group-modal.option-header-title')}
        </span>
        <IconButton
          iconName={IconNamesEnum.Plus}
          text={t('menu:modal.option_detail.add-option-group-modal.add-option-button')}
          onClick={handleAddOptionButtonClick}
        />
      </div>
      <div className="flex w-full flex-col gap-[12px]">
        {fields.map((field, index, fields) => {
          return (
            <OptionRow
              key={field.id}
              index={index}
              formControls={formControls}
              optionDelete={() => remove(index)}
              disabledDeleteOption={fields.length === 1}
            />
          )
        })}
      </div>
    </form>
  )
}

export default OptionGroupForm

interface OptionRowProps {
  index: number
  formControls: FormControlType<Omit<AdminProductOptionGroupCreateReqRequest, 'shop'>, unknown>
  optionDelete: () => void
  disabledDeleteOption: boolean
}
const OptionRow = ({ formControls, index, optionDelete, disabledDeleteOption }: OptionRowProps) => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const {
    setValue,
    registers: { regi }
  } = formControls

  const handleDeleteOptionButtonClick = () => {
    optionDelete()
  }
  const maxPrice = LocaleMaxOptionPriceMap[locale]

  return (
    <div className="flex items-center justify-stretch gap-[20px]">
      <span>{index + 1}</span>
      <TextInput
        {...regi(`productOptions.${index}.name`)}
        inputMode="text"
        direction={Direction.COLUMN}
        validate={(value) => {
          if (DataUtils.isEmpty(value)) return false
          return value.length <= MAX_LENGTH_OPTION_NAME
            ? true
            : t('common:input-validate.max-length', { maxLength: MAX_LENGTH_OPTION_NAME })
        }}
        className="w-full bg-[#393F4E]"
        onChange={(value) => setValue(`productOptions.${index}.name`, value.trimStart(), { shouldDirty: true })}
        placeholder={t('menu:modal.option_detail.add-option-group-modal.option-name.place-holder-text')}
        required
      />
      <TextInput
        {...regi(`productOptions.${index}.unitPrice`)}
        type="number"
        inputMode="numeric"
        direction={Direction.COLUMN}
        validate={{
          validateUnitCount: (value) => Validator.validateUnitCount(value),
          validateRange: (value) =>
            Validator.validateRange(value!, 0, maxPrice, t('menu:menu-create-modal.unit-price.validator-text'))
        }}
        onChange={(value) => setValue(`productOptions.${index}.unitPrice`, value, { shouldDirty: true })}
        className="w-full bg-[#393F4E]"
        wrapperClassName="w-full"
        placeholder={t('common:price.label')}
        valueUnit={t('common:price_unit')}
        required
      />
      <UnderLineTextButton
        text={t('common:delete')}
        onClick={handleDeleteOptionButtonClick}
        disabled={disabledDeleteOption}
      />
    </div>
  )
}
