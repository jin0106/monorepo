import React, { useCallback, useEffect } from 'react'
import Modal from '@/components/common/modal/index'
import { ModalPropsType } from '@/hooks/common/useModal'

export type NoticeModalDataType = {
  id?: number
  content: string
}

type NoticeModalProps = {
  modalProps: ModalPropsType<NoticeModalDataType>
  onOk: () => void
  title?: string
}

const NoticeModal = ({ title, modalProps, onOk }: NoticeModalProps): JSX.Element => {
  const { modalData, handleClose } = modalProps
  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onOk?.()
        handleClose()
        return
      }
      if (e.key === 'Escape') handleClose()
    },
    [handleClose, onOk]
  )
  useEffect(() => {
    window?.addEventListener('keyup', onKeyUp)
    return () => {
      window?.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyUp])
  return (
    <>
      <Modal.Header title={title} />
      <div className="flex w-full justify-center">
        <span>{modalData.content}</span>
      </div>
      <Modal.Footer>
        <div className="flex w-full gap-2">
          <button
            onClick={() => {
              onOk?.()
              handleClose()
            }}
            className="btn-info btn-sm btn w-1/2 px-6 normal-case">
            확인
          </button>
          <button
            onClick={() => {
              handleClose()
            }}
            className="btn-outline btn-info btn-sm btn w-1/2 px-6 normal-case">
            취소
          </button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default NoticeModal
