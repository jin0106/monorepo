import { ReactNode } from 'react'
import { Controller, FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'
import FieldSet, { FieldSetProps } from '@/components/form/FieldSet'
import { FormComponentBaseProps } from '@/types/FormType'

export type RadioOptionType<TValue extends string | number | boolean = string> = {
  label: string
  value: TValue
}

interface RadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> extends Omit<FormComponentBaseProps<TFieldValues, TFieldName>, 'placeholder'>,
    Omit<FieldSetProps<TFieldValues>, 'name' | 'errors' | 'children' | 'isRequired'> {
  isRow?: boolean
  options: RadioOptionType<PathValue<TFieldValues, TFieldName>>[]
  onChange?: (value: PathValue<TFieldValues, TFieldName>) => void
  isOptionChecked?: (
    option: RadioOptionType<PathValue<TFieldValues, TFieldName>>,
    valueCurrent: PathValue<TFieldValues, TFieldName>
  ) => boolean
  renderOption?: (state: {
    option: RadioOptionType<PathValue<TFieldValues, TFieldName>>
    isChecked: boolean
    isRequired: boolean
    disabled: boolean
    onRadioOptionClick: (option: RadioOptionType<PathValue<TFieldValues, TFieldName>>) => void
  }) => ReactNode
}

const RadioGroup = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  disabled,
  readonly,
  required,
  className,
  isRow = true,
  options,
  isOptionChecked,
  onChange,
  renderOption,
  validate,
  formControlMethods,
  ...fieldSetProps
}: RadioGroupProps<TFieldValues, TFieldName>) => {
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
      rules={{ required, validate }}
      render={({ field }) => {
        const { value } = field

        const handleRadioOptionClick = (option: RadioOptionType<PathValue<TFieldValues, TFieldName>>) => {
          if (readonly) {
            return
          }
          const valueNew = option.value
          setValue(name, valueNew as PathValue<TFieldValues, Path<TFieldValues>>)
          onChange?.(valueNew as PathValue<TFieldValues, TFieldName>)
        }

        return (
          <FieldSet {...fieldSetProps} isRequired={!!required} errors={errors}>
            <div className={`form-control flex ${isRow ? 'flex-row' : 'flex-col'} ${className ?? ''}`}>
              {options.map((option) => {
                const isChecked = isOptionChecked
                  ? isOptionChecked(option, value as PathValue<TFieldValues, TFieldName>)
                  : option.value === value
                if (renderOption) {
                  return renderOption({
                    option,
                    isChecked,
                    isRequired: !!required,
                    disabled: !!disabled,
                    onRadioOptionClick: handleRadioOptionClick
                  })
                }
                return (
                  <label className="label cursor-pointer" key={`${option.value}`}>
                    <input
                      type="radio"
                      name={name}
                      className="radio checked:bg-blue-500"
                      onClick={() => handleRadioOptionClick(option)}
                      disabled={disabled}
                      checked={isChecked}
                    />
                    <span className="label-text">{option.label}</span>
                  </label>
                )
              })}
            </div>
          </FieldSet>
        )
      }}
    />
  )
}

export default RadioGroup
