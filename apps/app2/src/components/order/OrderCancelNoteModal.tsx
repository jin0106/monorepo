import { isEmpty } from 'lodash'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { AdminManualOrderCancelNoteReqRequest } from '@/api/generated/types'
import Modal from '@/components/common/modal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { ModalPropsType } from '@/hooks/common/useModal'

export type OptionCancelNoteModalData = {
  id: number
  note?: string | null
}

type OptionDetailModalProps = {
  modalControls?: ModalPropsType<OptionCancelNoteModalData>
  updateOrderCancelNote(data: AdminManualOrderCancelNoteReqRequest): void
}

type OptionDetailFormData = {
  note?: string
}
const OrderCancelNoteModal = ({ modalControls, updateOrderCancelNote }: OptionDetailModalProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.OrderManual, I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<OptionDetailFormData>({
    mode: 'onChange',
    values: {
      note: modalControls?.modalData.note ? modalControls?.modalData.note : ''
    }
  })
  const onSubmit = handleSubmit((data) => {
    if (!modalControls?.modalData.id || !data.note) return
    updateOrderCancelNote({ cancelNote: data.note })
  })

  return (
    <form className="flex w-[500px] flex-col" onSubmit={onSubmit}>
      <Modal.Header>
        <span className="text-[24px] font-bold">{t('order_manual:modal.cancel.title')}</span>
      </Modal.Header>
      <span>{t('order_manual:modal.cancel.description')}</span>
      <textarea
        className="textarea mt-[16px] resize-none bg-gray-700"
        placeholder={t('order_manual:modal.cancel.placeholder')}
        {...register('note', {
          required: true
        })}
      />
      <div className="mt-4 flex gap-2">
        <button className="btn-outline btn-wide btn flex-shrink" onClick={modalControls?.handleClose}>
          {t('common:cancel')}
        </button>
        <button type="submit" className="btn-info btn-wide btn flex-shrink text-white" disabled={!isEmpty(errors)}>
          {t('common:save')}
        </button>
      </div>
    </form>
  )
}

export default OrderCancelNoteModal
