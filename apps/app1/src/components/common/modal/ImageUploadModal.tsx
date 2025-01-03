import React, { BaseSyntheticEvent, ReactElement, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { FieldValues, FormProvider, Path } from 'react-hook-form'
import Modal from '@/components/common/modal/index'
import FileInput, { Accepts, isFileTypeImage } from '@/components/form/FileInput'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { ModalPropsType } from '@/hooks/common/useModal'
import { FormControlType } from '@/hooks/form/useForm'

export interface ImageUploadModalBaseData {
  imageUrl: string | undefined
}

type ImageUploadModalProps<TData extends ImageUploadModalBaseData, TFormInterface extends FieldValues = FieldValues> = {
  modalProps: ModalPropsType<TData>
  title?: string
  description?: string | ReactElement
  helperText?: string | ReactElement
  imageUploadModalFormControl: FormControlType<TFormInterface>
  name: Path<TFormInterface>
  onSubmit: (e?: BaseSyntheticEvent | undefined) => Promise<void> | void
  onImageUploadFileChange: (file: string | File) => void
}

const ImageUploadModal = <TData extends ImageUploadModalBaseData, TFormInterface extends FieldValues = FieldValues>({
  title,
  description,
  helperText,
  modalProps,
  imageUploadModalFormControl,
  name,
  onSubmit,
  onImageUploadFileChange
}: ImageUploadModalProps<TData, TFormInterface>): JSX.Element => {
  const { t } = useTranslation(I18nNamespaceEnum.Common)
  const { modalData, handleClose } = modalProps
  const {
    registers: { regi },
    ...methods
  } = imageUploadModalFormControl
  const {
    formState: { isValid: isFormValid },
    watch
  } = methods
  const image = watch(name)

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    },
    [handleClose]
  )
  useEffect(() => {
    window?.addEventListener('keyup', onKeyUp)
    return () => {
      window?.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyUp])

  return (
    <>
      <FormProvider<TFormInterface> {...methods}>
        <form onSubmit={onSubmit}>
          <Modal.Header title={title}></Modal.Header>
          {description}
          <FileInput
            {...regi(name)}
            helperText={helperText}
            accept={Accepts.Image}
            validate={(v) => {
              if (!v) {
                return false
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
            onChange={onImageUploadFileChange}
          />
          {modalData.imageUrl && <img className="h-[468px] w-[750px]" src={modalData.imageUrl} alt="이미지" />}
          <Modal.Footer>
            <div className="flex w-full gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleClose()
                }}
                className="btn-outline btn-primary btn-sm btn w-1/2 px-6 normal-case">
                {t('common:cancel')}
              </button>
              <button
                className="btn-primary btn-sm btn w-1/2 px-6 normal-case"
                type="submit"
                disabled={!isFormValid || !image}>
                {t('common:confirm')}
              </button>
            </div>
          </Modal.Footer>
        </form>
      </FormProvider>
    </>
  )
}

export default ImageUploadModal
