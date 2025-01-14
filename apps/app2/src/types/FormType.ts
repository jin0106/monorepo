import { FieldPath, FieldPathValue, FieldValues, Path, UseFormReturn, Validate, ValidationRule } from 'react-hook-form'
import { FormControlType } from '@/hooks/form/useForm'

export interface FormComponentBaseProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> {
  name: TFieldName
  formControlMethods: UseFormReturn<TFieldValues>
  disabled?: boolean
  readonly?: boolean
  required?: string | ValidationRule<boolean>
  className?: string
  placeholder?: string
  fieldSetProps?: {
    className?: string
  }
  validate?:
    | Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>
    | Record<string, Validate<FieldPathValue<TFieldValues, TFieldName>, TFieldValues>>
}

export type RegiType<TFieldValues extends FieldValues = FieldValues, TContext = unknown> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  /**
   * form interface에서 해당 컴포넌트가 사용하는 이름
   */
  name: TFieldName
) => {
  name: TFieldName
  formControl: FormControlType<TFieldValues, TContext>
}
