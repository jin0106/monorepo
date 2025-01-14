import React from 'react'
import { useForm } from 'react-hook-form'
import Modal from '@/components/common/modal/index'
import { ModalPropsType } from '@/hooks/common/useModal'

export type MemoModalDataType = {
  id: number
  memo: string
}

type MemoModalProps = {
  modalProps: ModalPropsType<MemoModalDataType>
  updateMemo: (memo: string) => void
}

const MemoModal = ({ modalProps, updateMemo }: MemoModalProps): JSX.Element => {
  const { handleClose } = modalProps
  const { register, handleSubmit } = useForm<{ memo: string }>({
    values: {
      memo: modalProps.modalData.memo
    }
  })

  const onSubmit = handleSubmit((data) => {
    updateMemo(data.memo)
    handleClose()
  })

  return (
    <form onSubmit={onSubmit}>
      <Modal.Header title="메모" />
      <textarea
        className="textarea-info textarea h-[340px] w-[400px] resize-none"
        placeholder="메모를 입력해주세요."
        {...register('memo')}
      />
      <Modal.Footer>
        <button type="submit" className="btn-info btn-sm btn w-1/2 px-6 normal-case">
          등록하기
        </button>
      </Modal.Footer>
    </form>
  )
}

export default MemoModal
