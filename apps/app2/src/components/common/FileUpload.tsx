import { useEffect, useRef, useState } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'next-i18next'
import { I18nNamespaceEnum } from '@/constants/i18n'

type FileUploadProps = {
  onFileChange?: (file: File) => void
  onFileUpload?: (file: File) => void
  isLoading: boolean
  accept?: string
  /**
   *
   * @param fileList 파일 리스트
   * @return -true: validate 성공 -false: validate 실패
   */
  validate?: (fileList: FileList) => boolean
}

/**
 * 한가지 파일만 넣을 수 있습니다.
 * @param onFileChange
 * @constructor
 */
const FileUpload = ({ onFileChange, isLoading, onFileUpload, accept, validate }: FileUploadProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.Menu, I18nNamespaceEnum.Common])
  const [files, setFiles] = useState<FileList>()
  const dragBoundaryRef = useRef<HTMLDivElement>(null)

  const handleDragIn = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragOut = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragOver = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    // if (e.dataTransfer!.files) {
    // }
  }

  const handleDrop = (e: DragEvent): void => {
    e.preventDefault()
    e.stopPropagation()

    if (!e.dataTransfer || !e.dataTransfer?.files) {
      return
    }

    if (validate && !validate(e.dataTransfer.files)) {
      return
    }

    // onFileChange(e.dataTransfer.files)
    setFiles(e.dataTransfer.files)
  }

  useEffect(() => {
    const file = files?.[0]
    if (!file) return
    onFileChange?.(file)
  }, [files])

  useEffect(() => {
    if (!dragBoundaryRef.current) {
      return
    }
    dragBoundaryRef.current.addEventListener('dragenter', handleDragIn)
    dragBoundaryRef.current.addEventListener('dragleave', handleDragOut)
    dragBoundaryRef.current.addEventListener('dragover', handleDragOver)
    dragBoundaryRef.current.addEventListener('drop', handleDrop)
    return () => {
      if (!dragBoundaryRef.current) {
        return
      }
      dragBoundaryRef.current.removeEventListener('dragenter', handleDragIn)
      dragBoundaryRef.current.removeEventListener('dragleave', handleDragOut)
      dragBoundaryRef.current.removeEventListener('dragover', handleDragOver)
      dragBoundaryRef.current.removeEventListener('drop', handleDrop)
    }
  }, [])

  const handleUpload = () => {
    const file = files?.[0]
    if (!file) {
      alert(t('common:error.file_not_selected'))
      return
    }
    onFileUpload?.(file)
  }

  return (
    <div className="flex w-[70vw] flex-col gap-5">
      <div
        ref={dragBoundaryRef}
        className="rounded-box flex h-[240px] w-full flex-col items-center justify-center gap-[8px] border border-dashed border-base-content">
        <div className="flex">
          <label className="btn-md btn">
            <ArrowUpTrayIcon className="mr-2 h-5 w-5 text-base-content" />
            {t('menu:file_upload.select_file')}
            <input
              type="file"
              accept={accept}
              placeholder="파일"
              className="hidden"
              onChange={(e) => {
                if (!e?.target?.files) return
                if (validate && !validate(e.target.files)) return
                setFiles(e.target.files)
              }}
            />
          </label>
          <button className="btn-md btn ml-4 h-5" onClick={handleUpload}>
            {t('menu:file_upload.upload_file')}
          </button>
        </div>

        <span className="text-base-content/50">{t('menu:file_upload.content')}</span>
        <span className="w-[300px] text-center text-base-content">{t('menu:file_upload.guide')}</span>
        {!!files?.length && <span className="rounded-[8px] border border-info p-[10px]">{files[0].name}</span>}
      </div>
      {isLoading && (
        <div className="rounded-box flex w-full flex-col items-center justify-center gap-[10px] border border-dashed border-base-content px-[20px] py-[14px]">
          <span>{t('menu:file_upload.uploading_file')}</span>
          <progress className="progress progress-info w-56" />
        </div>
      )}
    </div>
  )
}

export default FileUpload
