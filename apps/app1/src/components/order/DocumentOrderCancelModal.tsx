import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import Modal from '@/components/common/modal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import OrderDocumentContainer from '@/containers/order/OrderDocumentContainer'
import { ModalPropsType } from '@/hooks/common/useModal'

const DocumentOrderCancelModal = ({ modalProps }: { modalProps?: ModalPropsType }) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const [cancelText, setCancelText] = useState<string>('')
  const { mutateOrderCancel, documentOrderCancelModalControls } = OrderDocumentContainer.useContainer()

  const onSubmit = () => {
    if (!modalProps?.modalData?.orderNumber || !cancelText) {
      alert(t('order_document:modal.cancel.other_placeholder'))
      return
    }
    const data = { orderNumber: modalProps.modalData.orderNumber, reason: cancelText }
    mutateOrderCancel({ data })
  }
  return (
    <div className="flex min-w-[500px] max-w-[500px] flex-col">
      <Modal.Header>
        <span className="w-full text-center text-[24px] font-bold">{t('order_document:modal.cancel.header')}</span>
      </Modal.Header>
      <textarea
        className="textarea resize-none bg-gray-700"
        placeholder={t('order_document:modal.cancel.other_placeholder')}
        onChange={(e) => setCancelText(e.target.value)}></textarea>
      <div className="mt-6 flex min-w-full max-w-full gap-2 gap-2">
        <button className="btn-outline btn relative w-full flex-shrink" onClick={modalProps?.handleClose}>
          {t('common:close')}
        </button>
        <button className="btn-info btn w-full flex-shrink text-white" onClick={onSubmit}>
          {t('order_document:modal.cancel.cta')}
        </button>
      </div>
    </div>
  )
}

export default DocumentOrderCancelModal
