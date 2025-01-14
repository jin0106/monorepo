import React, { PropsWithChildren } from 'react'
import ModalFooter from '@/components/common/modal/ModalFooter'
import ModalHeader from '@/components/common/modal/ModalHeader'
import Portal from '@/components/layouts/Portal'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

export const MODAL_PORTAL_ID = 'modal-portal-id'

type ModalProps = {
  className?: string
  modalProps: ModalPropsType
  showCloseBtn?: boolean
  onDimClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}
const Modal = ({ className, modalProps, children, showCloseBtn = true, onDimClick }: PropsWithChildren<ModalProps>) => {
  const { isOpen, handleClose, mount } = modalProps

  if (!mount) {
    return null
  }

  return (
    <Portal id={MODAL_PORTAL_ID}>
      <section className={`modal ${isOpen ? 'modal-open' : ''}`} onClick={onDimClick}>
        <div
          className={ComponentUtils.cn(
            'modal-box flex w-fit min-w-[300px] max-w-[80vw] flex-col justify-between',
            className
          )}
          onClick={(e) => e.stopPropagation()}>
          {showCloseBtn && (
            <button
              type="button"
              className="btn-sm btn-circle btn absolute right-2 top-2 z-10"
              onClick={() => {
                handleClose()
              }}>
              ✕
            </button>
          )}
          <div className="flex w-full grow flex-col justify-start">{children}</div>
        </div>
      </section>
    </Portal>
  )
}

export default Modal

Modal.Header = ModalHeader
Modal.Footer = ModalFooter
