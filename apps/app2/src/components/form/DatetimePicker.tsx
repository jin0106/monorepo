import { ChangeEvent } from 'react'
import { Controller, FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'
import FieldSet, { FieldSetProps } from '@/components/form/FieldSet'
import { FormComponentBaseProps } from '@/types/FormType'

interface DatetimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> extends FormComponentBaseProps<TFieldValues, TFieldName>,
    Omit<FieldSetProps<TFieldValues>, 'name' | 'errors' | 'children' | 'isRequired'> {
  type: 'datetime-local' | 'date' | 'time'
  /**
   * type에 따라서 다음과 같은 format으로 설정해야 함
   * datetime-local: YYYY-MM-DDTHH:mm
   *   - sample: 2023-10-10T-05:30
   * date: YYYY-MM-DD
   *   - sample: 2023-10-10
   * time: HH:mm
   *   - sample: 05:30
   */
  min?: string
  /**
   * {@Link DatetimePickerProps.min} 과 동일하게 설정
   */
  max?: string
  onChange?: (value: PathValue<TFieldValues, TFieldName>) => void
  descriptionClassName?: string
}

const DatetimePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  type,
  min,
  max,
  disabled,
  readonly,
  required,
  className,
  onChange,
  placeholder,
  validate,
  formControlMethods,
  ...fieldSetProps
}: DatetimePickerProps<TFieldValues, TFieldName>) => {
  const { name } = fieldSetProps
  const {
    control,
    setValue,
    formState: { errors }
  } = formControlMethods

  return (
    <Controller<TFieldValues, TFieldName>
      name={name}
      control={control}
      rules={{
        required,
        validate
      }}
      render={({ field }) => {
        const { value = '', ref } = field

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          if (readonly) {
            return
          }
          const valueNew = e.target.value
          setValue(name, valueNew as PathValue<TFieldValues, Path<TFieldValues>>, { shouldValidate: true })
          onChange?.(valueNew as PathValue<TFieldValues, TFieldName>)
        }

        return (
          <FieldSet {...fieldSetProps} isRequired={!!required} errors={errors}>
            <input
              className={`input min-h-[48px] flex-1 ${className}`}
              name={name}
              ref={ref}
              type={type}
              min={min}
              max={max}
              value={value}
              disabled={disabled}
              readOnly={readonly}
              placeholder={placeholder}
              onChange={handleChange}
            />
          </FieldSet>
        )
      }}
    />
  )
}

export default DatetimePicker
