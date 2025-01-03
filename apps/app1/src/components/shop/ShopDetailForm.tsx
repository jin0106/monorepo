import { BaseSyntheticEvent, ReactNode } from 'react'
import { useTranslation } from 'next-i18next'
import { FormProvider, Path } from 'react-hook-form'
import { AdminShopCreateReqRequest, UserTypeEnum } from '@/api/generated/types'
import DatetimePicker from '@/components/form/DatetimePicker'
import { Direction } from '@/components/form/FieldSet'
import FileInput, { Accepts, isFileTypeImage } from '@/components/form/FileInput'
import RadioGroup from '@/components/form/RadioGroup'
import Select, { SelectOptionType } from '@/components/form/Select'
import TextArea from '@/components/form/TextArea'
import TextInput from '@/components/form/TextInput'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { Regex } from '@/constants/regex'
import { FormControlType } from '@/hooks/form/useForm'
import { DateUtils } from '@/utils/date'
import { ComponentUtils } from '@/utils/design-system/componentUtils'
import { DateFormat } from '@/utils/design-system/dateUtils'
import { Validator } from '@/utils/design-system/validator'

interface ShopDetailFormProps {
  formControl: FormControlType<AdminShopCreateReqRequest>
  siteSelectOptions: SelectOptionType<number>[]
  nodeSelectOptions: SelectOptionType<string>[]
  onSubmit: (e?: BaseSyntheticEvent | undefined) => Promise<void> | void
  disabledNames?: Set<Path<AdminShopCreateReqRequest>>
  children?: ReactNode
}

const MAX_LENGTH_SHOP_NAME = 20
const NEXT_DAY_TEXT_COLOR = 'text-[#FFB689]'
const NEXT_DAY_DESCRIPTION_TEXT_COLOR = 'text-[#6E7380]'
const ShopDetailForm = ({
  formControl,
  siteSelectOptions,
  nodeSelectOptions,
  onSubmit,
  disabledNames,
  children
}: ShopDetailFormProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.Shop, I18nNamespaceEnum.Common])
  const {
    registers: { regi },
    ...methods
  } = formControl

  const { watch } = methods

  const mainImageDefault = watch('mainImage')
  const [openAt, lastOrderAt, breakStartAt, breakEndAt] = watch(['openAt', 'lastOrderAt', 'breakStartAt', 'breakEndAt'])
  // 영업 시간이 익일 설정 여부
  const isOpenToNextDay =
    openAt && lastOrderAt && DateUtils.convertToDayjs(openAt).isAfter(DateUtils.convertToDayjs(lastOrderAt))
  // 휴게 사적 시간이 익일 여부
  const isBreakStartNextDAy =
    openAt && breakStartAt && DateUtils.convertToDayjs(openAt).isAfter(DateUtils.convertToDayjs(breakStartAt))
  // 휴게 종료 시간이 익일 여부
  const isBreakEndNextDay =
    openAt && breakEndAt && DateUtils.convertToDayjs(openAt).isAfter(DateUtils.convertToDayjs(breakEndAt))

  return (
    <FormProvider {...methods}>
      <form className="grid-rows-14 grid grid-cols-6" onSubmit={onSubmit}>
        <div className="col-span-6">
          <Select
            {...regi('site')}
            direction={Direction.COLUMN}
            className="w-full"
            label={{ title: t('shop:register.site') }}
            disabled={disabledNames?.has('site')}
            placeholder={t('common:please_select')}
            required={t('common:please_select')}
            options={siteSelectOptions}
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('name')}
            direction={Direction.COLUMN}
            className="w-full"
            disabled={disabledNames?.has('name')}
            label={{ title: t('shop:register.name') }}
            required
            validate={(value) =>
              Validator.validateMaxLength(value, MAX_LENGTH_SHOP_NAME, t('common:input.validate.max_length'))
            }
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('telephoneNumber')}
            direction={Direction.COLUMN}
            validate={(value) => {
              const inputValue = String(value)
              return Regex.NumberHyphen.test(inputValue) || t('common:input.validate.number_hyphen')
            }}
            className="w-full"
            disabled={disabledNames?.has('telephoneNumber')}
            label={{ title: t('shop:register.shop_name_placeholder') }}
            required
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('representativeName')}
            direction={Direction.COLUMN}
            className="w-full"
            disabled={disabledNames?.has('representativeName')}
            label={{ title: t('shop:register.representative_name') }}
            required
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('businessRegistrationNumber')}
            direction={Direction.COLUMN}
            validate={(value) => Regex.NumberHyphen.test(value) || t('common:input.validate.number_hyphen')}
            className="w-full"
            disabled={disabledNames?.has('businessRegistrationNumber')}
            label={{ title: t('shop:register.business_registration_number') }}
            required
          />
        </div>
        <div className="col-span-6">
          <TextInput
            {...regi('address.postNumber')}
            direction={Direction.COLUMN}
            className="w-full"
            inputMode="numeric"
            validate={(value) => Regex.Number.test(value) || t('common:input.validate.number')}
            disabled={disabledNames?.has('address.postNumber')}
            label={{ title: t('shop:register.postal_number') }}
            required
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('address.basicAddress')}
            direction={Direction.COLUMN}
            className="w-full"
            disabled={disabledNames?.has('address.basicAddress')}
            label={{ title: t('common:basic_address') }}
            required
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('address.detailAddress')}
            direction={Direction.COLUMN}
            className="w-full"
            disabled={disabledNames?.has('address.detailAddress')}
            label={{ title: t('common:shop') }}
            required
          />
        </div>
        <div className="col-span-6">
          <Select
            {...regi('neubieGoNodeNumber')}
            direction={Direction.COLUMN}
            className="w-full"
            label={{ title: t('shop:register.neubie_go_node_number') }}
            disabled={disabledNames?.has('neubieGoNodeNumber')}
            placeholder={t('common:please_select')}
            options={nodeSelectOptions}
            required
          />
        </div>
        <div className="col-span-3">
          <DatetimePicker
            {...regi('openAt')}
            direction={Direction.COLUMN}
            className="w-full"
            label={{ title: t('shop:register.open_at') }}
            disabled={disabledNames?.has('openAt')}
            placeholder={t('common:please_select')}
            type={'time'}
            validate={(value, formValues) => {
              if (!value) {
                return false
              }

              if (DateUtils.isSameDateTime(value, formValues.lastOrderAt, DateFormat.TIME)) {
                return t('shop:register.same-open-time')
              }
              return true
            }}
            required
          />
        </div>
        <div className="col-span-3">
          <DatetimePicker
            {...regi('lastOrderAt')}
            direction={Direction.COLUMN}
            className={ComponentUtils.cn('w-full', isOpenToNextDay && NEXT_DAY_TEXT_COLOR)}
            label={{ title: t('shop:register.last_order_at') }}
            disabled={disabledNames?.has('lastOrderAt')}
            placeholder={t('common:please_select')}
            type={'time'}
            description={isOpenToNextDay && t('shop:register.close-time.next-day')}
            descriptionClassName={NEXT_DAY_DESCRIPTION_TEXT_COLOR}
            validate={(value, formValues) => {
              if (!value) {
                return false
              }

              if (DateUtils.isSameDateTime(value, formValues.openAt, DateFormat.TIME)) {
                return t('shop:register.same-close-time')
              }
              return true
            }}
            required
          />
        </div>
        <div className="col-span-3">
          <DatetimePicker
            {...regi('breakStartAt')}
            direction={Direction.COLUMN}
            className={ComponentUtils.cn('w-full', isBreakStartNextDAy && NEXT_DAY_TEXT_COLOR)}
            label={{ title: t('shop:register.break_start_at') }}
            disabled={disabledNames?.has('breakStartAt')}
            description={isBreakEndNextDay && t('shop:register.break-start-time.next-day')}
            descriptionClassName={NEXT_DAY_DESCRIPTION_TEXT_COLOR}
            placeholder={t('common:please_select')}
            type={'time'}
            validate={(value, formValues) => {
              if (!value) {
                return true
              }
              const openAt = formValues.openAt
              const lastOrderAt = formValues.lastOrderAt
              const breakEndAt = formValues.breakEndAt

              // 영업 시간 익일 여부에 따라 휴게 시간의 validation 처리
              if (isOpenToNextDay) {
                const adjustLastOrderAt = DateUtils.convertToDayjs(lastOrderAt).add(1, 'day')
                const adjustOpenAt = DateUtils.convertToDayjs(openAt)
                const adjustValue =
                  openAt && value <= openAt
                    ? DateUtils.convertToDayjs(value).add(1, 'day')
                    : DateUtils.convertToDayjs(value)
                const adjustBreakEndAt =
                  openAt && breakEndAt && openAt >= breakEndAt
                    ? DateUtils.convertToDayjs(breakEndAt).add(1, 'day')
                    : DateUtils.convertToDayjs(breakEndAt)

                if (adjustValue.isBefore(adjustOpenAt)) {
                  return t('shop:register.err_below_open_at')
                }
                if (adjustValue.isAfter(adjustLastOrderAt) || adjustValue.isSame(adjustLastOrderAt)) {
                  return t('shop:register.err_more_than_last_order_at')
                }
                if (adjustValue.isSame(adjustBreakEndAt)) {
                  return t('shop:register.err_more_than_break_end_at')
                }
              } else {
                if (openAt && value <= openAt) {
                  return t('shop:register.err_below_open_at')
                }

                if (breakEndAt && value >= breakEndAt) {
                  return t('shop:register.err_more_than_break_end_at')
                }

                if (lastOrderAt && value >= lastOrderAt) {
                  return t('shop:register.err_more_than_last_order_at')
                }
              }
              return true
            }}
          />
        </div>
        <div className="col-span-3">
          <DatetimePicker
            {...regi('breakEndAt')}
            direction={Direction.COLUMN}
            className={ComponentUtils.cn('w-full', isBreakEndNextDay && NEXT_DAY_TEXT_COLOR)}
            label={{ title: t('shop:register.break_end_at') }}
            disabled={disabledNames?.has('breakEndAt')}
            description={isBreakEndNextDay && t('shop:register.break-end-time.next-day')}
            descriptionClassName={NEXT_DAY_DESCRIPTION_TEXT_COLOR}
            placeholder={t('common:please_select')}
            type={'time'}
            validate={(value, formValues) => {
              if (!value) {
                return true
              }
              const openAt = formValues.openAt
              const breakStartAt = formValues.breakStartAt
              const lastOrderAt = formValues.lastOrderAt
              const adjustBreakStartAt =
                openAt && breakStartAt && openAt >= breakStartAt
                  ? DateUtils.convertToDayjs(breakStartAt).add(1, 'day')
                  : DateUtils.convertToDayjs(breakStartAt)
              const adjustLastOrderAt =
                openAt && lastOrderAt && openAt >= lastOrderAt
                  ? DateUtils.convertToDayjs(lastOrderAt).add(1, 'day')
                  : DateUtils.convertToDayjs(lastOrderAt)

              // 영업 시간 익일 여부에 따라 휴게 시간의 validation 처리
              if (isOpenToNextDay) {
                const adjustValue =
                  openAt && value <= openAt
                    ? DateUtils.convertToDayjs(value).add(1, 'day')
                    : DateUtils.convertToDayjs(value)
                if (adjustValue.isBefore(adjustBreakStartAt)) {
                  return t('shop:register.err_more_than_break_start_at')
                }
                if (adjustValue.isAfter(adjustLastOrderAt) || adjustValue.isSame(adjustLastOrderAt)) {
                  return t('err_more_than_last_order_at')
                }

                if (adjustValue.isSame(adjustBreakStartAt)) {
                  return t('shop:register.err_more_than_break_start_at')
                }
              } else {
                if (openAt && value <= openAt) {
                  return t('shop:register.err_below_open_at')
                }

                if (breakStartAt && value <= breakStartAt) {
                  return t('shop:register.err_more_than_break_start_at')
                }

                if (lastOrderAt && value >= lastOrderAt) {
                  return t('shop:register.err_more_than_last_order_at')
                }
              }
              return true
            }}
          />
        </div>
        <div className="col-span-2">
          <TextInput
            {...regi('minOrderPrice')}
            direction={Direction.COLUMN}
            className="w-full"
            inputMode="numeric"
            validate={(value) => {
              const inputValue = String(value)
              return Regex.Number.test(inputValue) || t('common:input.validate.number')
            }}
            disabled={disabledNames?.has('minOrderPrice')}
            label={{ title: t('shop:register.min_order_amount') }}
            valueUnit={t('common:price_unit')}
            required
          />
        </div>
        <Permission allowAdminTypes={[UserTypeEnum.ADMIN]}>
          <div className="col-span-2">
            <TextInput
              {...regi('platformFee')}
              direction={Direction.COLUMN}
              className="w-full"
              inputMode="numeric"
              validate={(value) => {
                const inputValue = String(value)
                return Regex.Number.test(inputValue) || t('common:input.validate.number')
              }}
              disabled={disabledNames?.has('platformFee')}
              label={{ title: t('shop:register.payment_fees') }}
              valueUnit="%"
              required
            />
          </div>
        </Permission>
        <div className="col-span-2">
          <TextInput
            {...regi('deliveryUnitPrice')}
            direction={Direction.COLUMN}
            className="w-full"
            inputMode="numeric"
            validate={(value) => {
              const inputValue = String(value)
              return Regex.Number.test(inputValue) || t('common:input.validate.number')
            }}
            disabled={disabledNames?.has('deliveryUnitPrice')}
            label={{ title: t('shop:register.delivery_tip') }}
            valueUnit={t('common:price_unit')}
            required
          />
        </div>
        <div className="col-span-6">
          <TextArea
            {...regi('announce')}
            className="resize-none"
            disabled={disabledNames?.has('announce')}
            placeholder={t('shop:register.announce_placeholder')}
            label={{ title: t('shop:register.announce') }}
            rows={5}
          />
        </div>
        <div className="col-span-6">
          <TextArea
            {...regi('originLabel')}
            className="resize-none"
            disabled={disabledNames?.has('originLabel')}
            placeholder={t('shop:register.origin_label_placeholder')}
            label={{ title: t('shop:register.origin_label') }}
            rows={5}
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('accountManagerName')}
            direction={Direction.COLUMN}
            className="w-full"
            disabled={disabledNames?.has('accountManagerName')}
            label={{ title: t('shop:account_manager') }}
            required
          />
        </div>
        <div className="col-span-3">
          <TextInput
            {...regi('accountManagerMobileNumber')}
            direction={Direction.COLUMN}
            className="w-full"
            validate={(value) => Regex.NumberHyphen.test(value) || t('common:input.validate.number_hyphen')}
            disabled={disabledNames?.has('accountManagerMobileNumber')}
            label={{ title: t('shop:account_manager_mobile') }}
            required
          />
        </div>
        <div className="col-span-6 flex items-center">
          <FileInput
            {...regi('mainImage')}
            disabled={disabledNames?.has('mainImage')}
            label={{ title: t('shop:main_image') }}
            helperText={t('shop:modal.add_image.helper')}
            accept={Accepts.Image}
            validate={(v) => {
              /**
               * mainImage의 타입이 아래와 같이 다름
               * - create인 경우 AdminShopCreateReqRequest 이며 Blob
               * - response를 받은 경우 AdminShopRes 이며 ShopImageRes
               * 우선은 type 여부로 예외 처리를 함
               */
              if (!v || !v.type) {
                return true
              }

              if (!isFileTypeImage(v)) {
                return t('common:input.validate.file_type_image')
              }

              const fileMaxSizeMB = 2
              if (v.size > 1024 * 1024 * fileMaxSizeMB) {
                return t('common:input.validate.file_size_smaller', { size: fileMaxSizeMB })
              }

              return true
            }}
          />
          {mainImageDefault && t('shop:register.image_uploaded')}
        </div>
        <div className="col-span-3">
          <RadioGroup
            {...regi('isOpen')}
            disabled={disabledNames?.has('isOpen')}
            className="btn-group"
            label={{ title: t('shop:open_status') }}
            options={[
              { label: t('common:shop_temp_close'), value: false },
              { label: t('common:shop_open'), value: true }
            ]}
            renderOption={({ option, isChecked, disabled, onRadioOptionClick }) => {
              return (
                <button
                  key={`${option.value}`}
                  className={`btn normal-case ${isChecked ? 'btn-active' : ''}`}
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault()
                    onRadioOptionClick(option)
                  }}>
                  {option.label}
                </button>
              )
            }}
          />
        </div>
        {children}
      </form>
    </FormProvider>
  )
}

export default ShopDetailForm
