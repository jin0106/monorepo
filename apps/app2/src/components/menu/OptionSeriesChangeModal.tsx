import React, { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { DragDropContext, Draggable, DraggingStyle, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { useShopsProductsProductOptionGroupsProductOptionsBulkUpdatePartialUpdate } from '@/api/generated/hooks'
import { AdminProductOptionGroupRes, AdminProductOptionRes } from '@/api/generated/types'
import Icon from '@/components/common/Icon'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import HighLightModalSubtitle from '@/components/menu/HighLightModalSubtitle'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import useDraggableTopStyleCorrection from '@/hooks/common/useDraggableTopStyleCorrection'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'
import { ComponentUtils } from '@/utils/design-system/componentUtils'
import DataUtils from '@/utils/design-system/dataUtils'

interface OptionSeriesChangeModalProps {
  shopId: number
  productId: number
  modalProps: ModalPropsType<{ optionGroup: AdminProductOptionGroupRes }>
  refetchProductOptionGroups: () => void
}

const OptionSeriesChangeModal = (props: OptionSeriesChangeModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <OptionSeriesChangeModalContent {...props} />
    </Modal>
  )
}

const OptionSeriesChangeModalContent = ({
  shopId,
  productId,
  modalProps,
  refetchProductOptionGroups
}: OptionSeriesChangeModalProps) => {
  const { t } = useTranslation()
  const [isEdited, setIsEdited] = useState(false)
  const draggableBoundaryRef = useRef<HTMLDivElement>(null)
  const { draggableStyleTopCorrectionValue } = useDraggableTopStyleCorrection()
  const { optionGroup } = modalProps.modalData
  const [normalOptions, setNormalOptions] = useState<AdminProductOptionRes[]>(
    DataUtils.copy(optionGroup.productOptions)
  )

  const { mutateAsync: updateBulkOptionMutate, isLoading: isUpdateBulkOptionLoading } =
    useShopsProductsProductOptionGroupsProductOptionsBulkUpdatePartialUpdate()

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result
    if (!destination || destination.index === source.index) {
      return
    }

    setNormalOptions((prev) => {
      const result = DataUtils.moveArrayElement(prev, source.index, destination.index)
      return result ?? prev
    })
    setIsEdited(true)
  }

  const handleSeriesChangeSaveButtonClick = async () => {
    const getOptionGroupsBulk = (): { id: number }[] => {
      return normalOptions.map((option) => ({
        id: option.id
      }))
    }
    await updateBulkOptionMutate(
      {
        shopPk: shopId,
        productPk: productId,
        id: optionGroup.id,
        data: { productOptions: getOptionGroupsBulk() }
      },
      {
        onError: (error) => {
          ApiUtils.onErrorAlert(error)
        }
      }
    )
    await refetchProductOptionGroups()
    modalProps.handleClose()
  }

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header title={t('menu:modal.option_detail.series-change-option')} />
      <HighLightModalSubtitle
        highLightText={optionGroup?.name}
        text={t('menu:modal.option_detail.option-series-modal.description')}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => {
            return (
              <div
                ref={(r) => ComponentUtils.setRefs(r, draggableBoundaryRef, provided.innerRef)}
                className="h-[440px] w-full overflow-auto"
                {...provided.droppableProps}>
                {normalOptions?.map((option, index) => {
                  return (
                    <Draggable draggableId={String(option.id)} index={index} key={option.id}>
                      {(provided) => {
                        const draggbleStyle = provided.draggableProps.style as DraggingStyle
                        const draggableStyle = {
                          ...draggbleStyle,
                          left: 20,
                          top: draggbleStyle.top - draggableStyleTopCorrectionValue || 0
                        }
                        return (
                          <div
                            className="w-full"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={draggableStyle}>
                            <OptionRow option={option} index={index} />
                          </div>
                        )
                      }}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </DragDropContext>
      <Modal.Footer>
        <div className="flex w-full gap-2">
          <button
            onClick={(e) => {
              e.preventDefault()
              modalProps.handleClose()
            }}
            className="btn-[#404C63] btn-outline btn h-[22px] w-1/2 px-6 normal-case">
            {t('common:cancel')}
          </button>
          <button
            className="btn h-[22px] w-1/2 bg-[#00B2E3] px-6 normal-case text-[#2B303B]"
            disabled={!isEdited}
            onClick={handleSeriesChangeSaveButtonClick}>
            {t('common:save')}
          </button>
        </div>
      </Modal.Footer>
      {isUpdateBulkOptionLoading && <LoadingOverlay />}
    </div>
  )
}

interface OptionRowProps {
  option: AdminProductOptionRes
  index: number
}
const OptionRow = ({ option, index }: OptionRowProps) => {
  return (
    <div className="flex h-[68px] w-full items-center justify-between gap-[24px] text-white">
      <span className="text-[14px] text-white">{index + 1}</span>
      <span className="ml-[10px] w-full text-[14px] text-white">{option.name}</span>
      <Icon name={IconNamesEnum.UnionThreeBar} className="h-[20px] w-[20px]" />
    </div>
  )
}

export default OptionSeriesChangeModal
