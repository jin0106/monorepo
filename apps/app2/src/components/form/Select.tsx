import { ChangeEvent } from 'react'
import { Controller, FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'
import FieldSet, { FieldSetProps } from '@/components/form/FieldSet'
import { FormComponentBaseProps } from '@/types/FormType'

export type SelectOptionType<TValue extends string | number = string> = {
  label: string
  value: TValue
}

interface SelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends FormComponentBaseProps<TFieldValues, TFieldName>,
    Omit<FieldSetProps<TFieldValues>, 'name' | 'errors' | 'children' | 'isRequired'> {
  options: SelectOptionType<PathValue<TFieldValues, TFieldName>>[]
  onChange?: (value: PathValue<TFieldValues, TFieldName>) => void
  placeholder?: string
}

const Select = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  disabled,
  readonly,
  required,
  className,
  options,
  onChange,
  placeholder,
  validate,
  formControlMethods,
  ...fieldSetProps
}: SelectProps<TFieldValues, TFieldName>) => {
  const { name } = fieldSetProps
  const {
    control,
    setValue,
    formState: { errors }
  } = formControlMethods

  const valueType = typeof options[0]?.value

  return (
    <Controller<TFieldValues, TFieldName>
      name={name}
      control={control}
      rules={{ required, validate }}
      render={({ field: { value, ref } }) => {
        const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
          if (readonly) {
            return
          }
          const valueNew = e.target.value && valueType === 'number' ? Number(e.target.value) : e.target.value
          setValue(name, valueNew as PathValue<TFieldValues, Path<TFieldValues>>, { shouldValidate: true })
          onChange?.(valueNew as PathValue<TFieldValues, TFieldName>)
        }

        return (
          <FieldSet {...fieldSetProps} isRequired={!!required} errors={errors}>
            <select
              className={`select flex-1 ${className ?? ''}`}
              ref={ref}
              value={value}
              disabled={disabled}
              onChange={handleChange}>
              {placeholder && (
                <option key="" value="">
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FieldSet>
        )
      }}
    />
  )
}

export default Select
