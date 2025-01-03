import { ReactElement, ReactNode } from 'react'
import { ErrorMessage } from '@hookform/error-message'
import { FieldErrors, FieldValues, Path } from 'react-hook-form'
import Label, { LabelProps } from '@/components/form/Label'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

export const enum Direction {
  ROW = 'ROW',
  COLUMN = 'COLUMN'
}

export interface FieldSetProps<TFieldValues extends FieldValues = FieldValues> {
  label?: { title: LabelProps['title']; className?: string }
  name: Path<TFieldValues>
  isRequired?: boolean
  direction?: Direction
  description?: string | ReactElement
  helperText?: string | ReactElement
  errors?: FieldErrors
  children: ReactNode
  className?: string
  descriptionClassName?: string
}

const FieldSet = <TFieldValues extends FieldValues = FieldValues>({
  label,
  name,
  isRequired,
  direction = Direction.ROW,
  description,
  children,
  helperText,
  errors,
  className,
  descriptionClassName
}: FieldSetProps<TFieldValues>) => {
  return (
    <div className={`flex flex-col ${className ?? ''}`}>
      {direction === Direction.ROW ? (
        typeof description === 'string' ? (
          <span className={descriptionClassName}>{description}</span>
        ) : (
          description
        )
      ) : null}
      <div
        className={`flex ${
          direction === Direction.ROW ? 'flex-row items-center' : 'flex-col items-start gap-[10px]'
        } p-2`}>
        {label && <Label title={label.title} className={label.className} isRequired={isRequired} />}
        <div className="flex w-full">{children}</div>
      </div>
      {direction === Direction.COLUMN ? (
        typeof description === 'string' ? (
          <span className={ComponentUtils.cn('px-2', descriptionClassName)}>{description}</span>
        ) : (
          description
        )
      ) : null}
      <ErrorMessage
        name={name}
        errors={errors}
        render={(error) => <span className="text-pink-700">{error.message}</span>}
      />
      {typeof helperText === 'string' ? <span>{helperText}</span> : helperText}
    </div>
  )
}

export default FieldSet
