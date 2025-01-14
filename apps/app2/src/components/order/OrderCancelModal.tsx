import { useState } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'next-i18next'
import Modal from '@/components/common/modal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import OrderContainer from '@/containers/order/OrderContainer'
import { ModalPropsType } from '@/hooks/common/useModal'

type OptionDetailModalProps = {
  modalProps?: ModalPropsType
}

const getCancelRows = (t: TFunction) => {
  return [
    t('order:modal.cancel.no_neubie'),
    t('order:modal.cancel.cargo_limit'),
    t('order:modal.cancel.sold_out'),
    t('order:modal.cancel.customer_request')
  ]
}

const OrderCancelModal = ({ modalProps }: OptionDetailModalProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const [cancelText, setCancelText] = useState<string>('')
  const [showTextInput, setShowTextInput] = useState<boolean>(false)
  const { mutateOrderCancel } = OrderContainer.useContainer()

  const onSubmit = () => {
    if (!modalProps?.modalData?.orderNumber || !cancelText) {
      alert(t('order:modal.cancel.err_no_cancel_reason'))
      return
    }
    const data = { orderNumber: modalProps?.modalData?.orderNumber, reason: cancelText }
    mutateOrderCancel({ data })
  }
  return (
    <div className="flex min-w-[500px] max-w-[500px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold">{t('order:modal.cancel.cancel_order')}</span>
      </Modal.Header>
      <div className="flex flex-col gap-[12px] py-[16px]">
        {getCancelRows(t).map((v, i) => (
          <label
            key={i}
            role="presentation"
            className="label h-12 cursor-pointer justify-start rounded-[12px] border border-gray-500"
            onClick={() => {
              setShowTextInput(false)
              setCancelText(v)
            }}>
            <input type="radio" className="radio ml-2 checked:bg-info" readOnly checked={cancelText === v} />
            <span className="label-text ml-4">{v}</span>
          </label>
        ))}
        <label
          role="presentation"
          className="label h-12 cursor-pointer justify-start rounded-[12px] border border-gray-500"
          onClick={() => {
            setCancelText('')
            setShowTextInput(true)
          }}>
          <input type="radio" className="radio ml-2 checked:bg-info" readOnly checked={showTextInput} />
          <span className="label-text ml-4">{t('order:modal.cancel.other')}</span>
        </label>
      </div>
      {showTextInput && (
        <textarea
          className="textarea resize-none bg-gray-700"
          placeholder={t('order:modal.cancel.other_placeholder')}
          onChange={(e) => setCancelText(e.target.value)}></textarea>
      )}
      <div className="mt-6 flex min-w-full max-w-full gap-2 gap-2">
        <button className="btn-outline btn relative w-full flex-shrink" onClick={modalProps?.handleClose}>
          {t('common:cancel')}
        </button>
        <button className="btn-info btn w-full flex-shrink text-white" onClick={onSubmit}>
          {t('order:modal.cancel.cta')}
        </button>
      </div>
    </div>
  )
}

export default OrderCancelModal
