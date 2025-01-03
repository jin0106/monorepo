import { ChangeEvent } from 'react'
import { Controller, FieldPath, FieldValues, Path, PathValue, get } from 'react-hook-form'
import FieldSet, { FieldSetProps } from '@/components/form/FieldSet'
import { FormComponentBaseProps } from '@/types/FormType'

interface TextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends FormComponentBaseProps<TFieldValues, TFieldName>,
    Omit<FieldSetProps<TFieldValues>, 'name' | 'errors' | 'children' | 'isRequired'> {
  rows?: number
  onChange?: (value: PathValue<TFieldValues, TFieldName>) => void
}

const TextArea = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  disabled,
  readonly,
  required,
  className,
  rows,
  onChange,
  placeholder,
  validate,
  formControlMethods,
  ...fieldSetProps
}: TextAreaProps<TFieldValues, TFieldName>) => {
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
        const { value = '', ref } = field
        const hasError = !!get(errors, name)

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
          if (readonly) {
            return
          }
          const valueNew = e.target.value
          setValue(name, valueNew as PathValue<TFieldValues, Path<TFieldValues>>, { shouldValidate: true })
          onChange?.(valueNew as PathValue<TFieldValues, TFieldName>)
        }

        return (
          <FieldSet {...fieldSetProps} isRequired={!!required} errors={errors}>
            <textarea
              className={`textarea flex-1 ${className} ${hasError ? 'textarea-error' : ''}`}
              name={name}
              ref={ref}
              value={value}
              disabled={disabled}
              readOnly={readonly}
              placeholder={placeholder}
              rows={rows}
              onChange={handleChange}
            />
          </FieldSet>
        )
      }}
    />
  )
}

export default TextArea
