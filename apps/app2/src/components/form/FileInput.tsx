import React, { ChangeEvent } from 'react'
import { Controller, FieldPath, FieldValues, Path, PathValue } from 'react-hook-form'
import Modal from '@/components/common/modal'
import FieldSet, { FieldSetProps } from '@/components/form/FieldSet'
import useModal from '@/hooks/common/useModal'
import { FormComponentBaseProps } from '@/types/FormType'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

export const Accepts = {
  Image: 'image/jpeg, image/png',
  Excel: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
}

const isFileType = (f: File | Blob | undefined, accepts: string): boolean => {
  return !!f && accepts.replaceAll(' ', '').split(',').includes(f.type)
}
export const isFileTypeImage = (f?: File | Blob): boolean => {
  return isFileType(f, Accepts.Image)
}

export const isFileTypeExcel = (f?: File | Blob): boolean => {
  return isFileType(f, Accepts.Excel)
}

interface FileInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends Path<TFieldValues> = Path<TFieldValues>
> extends FormComponentBaseProps<TFieldValues, TFieldName>,
    Omit<FieldSetProps<TFieldValues>, 'name' | 'errors' | 'children' | 'isRequired'> {
  onChange?: (value: PathValue<TFieldValues, TFieldName>, event?: ChangeEvent<HTMLInputElement>) => void
  convertFileList?: (fileList: FileList) => Promise<PathValue<TFieldValues, Path<TFieldValues>>>
  accept?: string
  isShowFileName?: boolean
  presetImage?: string | null
}

const FileInput = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  isShowFileName = true,
  disabled,
  readonly,
  required,
  className,
  accept,
  onChange,
  convertFileList,
  placeholder,
  validate,
  formControlMethods,
  presetImage,
  ...fieldSetProps
}: FileInputProps<TFieldValues, TFieldName>) => {
  const { name } = fieldSetProps
  const {
    control,
    setValue,
    formState: { errors }
  } = formControlMethods

  const previewImageModalControls = useModal()

  return (
    <Controller<TFieldValues, TFieldName>
      name={name}
      control={control}
      rules={{ required, validate }}
      render={({ field: { ref, value } }) => {
        const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
          if (readonly || !e.target.files || e.target.files.length < 1) {
            return
          }
          const _valueNew = e.target.files[0]
          const buffer = await _valueNew.arrayBuffer()
          const valueNew = new File([buffer], _valueNew.name, { type: _valueNew.type })
          setValue(name, valueNew as PathValue<TFieldValues, Path<TFieldValues>>, { shouldValidate: true })
          onChange?.(valueNew as PathValue<TFieldValues, TFieldName>, e)
        }

        return (
          <FieldSet {...fieldSetProps} isRequired={!!required} errors={errors}>
            {presetImage && (
              <button
                type="button"
                className="my-auto underline"
                onClick={() => previewImageModalControls.handleOpen()}>
                image
              </button>
            )}
            <input
              className={ComponentUtils.cn('file-input w-full max-w-xs flex-1', className)}
              name={name}
              ref={ref}
              type="file"
              accept={accept}
              disabled={disabled}
              readOnly={readonly}
              placeholder={placeholder}
              onChange={handleChange}
            />
            {isShowFileName && typeof value === 'string' && value}
            <Modal modalProps={previewImageModalControls}>
              <button
                type="button"
                onClick={() => {
                  previewImageModalControls.handleClose()
                }}>
                {presetImage && <img src={presetImage} alt="preview" />}
              </button>
            </Modal>
          </FieldSet>
        )
      }}
    />
  )
}

export default FileInput
