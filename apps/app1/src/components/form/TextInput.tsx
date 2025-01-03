import { ChangeEvent, DetailedHTMLProps, forwardRef, InputHTMLAttributes, Ref } from 'react'
import { Controller, FieldPath, FieldValues, Path, PathValue, get } from 'react-hook-form'
import FieldSet, { FieldSetProps } from '@/components/form/FieldSet'
import { FormComponentBaseProps } from '@/types/FormType'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

interface TextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> extends FormComponentBaseProps<TFieldValues, TFieldName>,
    Omit<FieldSetProps<TFieldValues>, 'name' | 'errors' | 'children' | 'isRequired'>,
    Pick<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'inputMode' | 'type'> {
  onChange?: (value: PathValue<TFieldValues, TFieldName>) => void
  valueUnit?: string
  wrapperClassName?: string
}

const TextInput = forwardRef(
  <
    TFieldValues extends FieldValues = FieldValues,
    TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
  >(
    {
      disabled,
      readonly,
      required,
      className,
      onChange,
      valueUnit,
      placeholder,
      validate,
      formControlMethods,
      inputMode,
      wrapperClassName,
      type = 'text',
      ...fieldSetProps
    }: TextInputProps<TFieldValues, TFieldName>,
    ref: Ref<HTMLInputElement>
  ) => {
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
          const { value = '', ref: refCallback } = field
          const hasError = !!get(errors, name)

          const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (readonly) {
              return
            }
            const valueNew = e.target.value as PathValue<TFieldValues, Path<TFieldValues>>
            setValue(name, valueNew, { shouldValidate: true, shouldDirty: true })
            onChange?.(valueNew as PathValue<TFieldValues, TFieldName>)
          }

          return (
            <FieldSet {...fieldSetProps} isRequired={!!required} errors={errors} className={wrapperClassName}>
              <input
                className={ComponentUtils.cn(
                  'input min-h-[48px] flex-1',
                  valueUnit ? 'rounded-r-none' : '',
                  className,
                  hasError && 'input-bordered input-error'
                )}
                name={name}
                ref={(r) => ComponentUtils.setRefs(r, ref, refCallback)}
                type={type}
                value={value}
                disabled={disabled}
                readOnly={readonly}
                placeholder={placeholder}
                onChange={handleChange}
                inputMode={inputMode}
              />
              {valueUnit && (
                <span className={`body3 flex h-[3rem] items-center rounded-r-lg bg-[#20232B] px-[12px] text-gray-300`}>
                  {valueUnit}
                </span>
              )}
            </FieldSet>
          )
        }}
      />
    )
  }
)
TextInput.displayName = 'TextInput'

export default TextInput as <TFieldValues extends FieldValues, TFieldName extends Path<TFieldValues>>(
  props: TextInputProps<TFieldValues, TFieldName> & {
    ref?: Ref<HTMLInputElement>
  }
) => JSX.Element
