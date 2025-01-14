import Modal from '@/components/common/modal/index'
import { ModalPropsType } from '@/hooks/common/useModal'

type ExcelErrorModalProps = {
  modalProps: ModalPropsType
}

const ExcelErrorModal = ({ modalProps }: ExcelErrorModalProps) => {
  return (
    <>
      <Modal.Header>
        <div className="flex flex-col">
          <span className="text-[24px] font-bold">엑셀 파일 오류</span>
          <span className="text-base-content">엑셀 수정 후 다시 업로드해주세요</span>
        </div>
      </Modal.Header>
      <div className="flex w-[400px] flex-col gap-[5px]">
        <span>00열 00행 입력값이 잘못되었습니다.</span>
        <span>00열 00행 입력값이 잘못되었습니다.</span>
        <span>00열 00행 입력값이 잘못되었습니다.</span>
        <span>00열 00행 입력값이 잘못되었습니다.</span>
        <span>00열 00행 입력값이 잘못되었습니다.</span>
        <span>00열 00행 입력값이 잘못되었습니다.</span>
        <span>00열 00행 입력값이 잘못되었습니다.</span>
      </div>
    </>
  )
}

export default ExcelErrorModal
