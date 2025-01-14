import React, { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { DragDropContext, Draggable, DraggingStyle, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { useShopsProductsProductOptionGroupsBulkUpdatePartialUpdate } from '@/api/generated/hooks'
import { AdminProductOptionGroupRequest, AdminProductOptionGroupRes, AdminProductRes } from '@/api/generated/types'
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

interface OptionGroupSeriesChangeModalProps {
  shopId: number
  product: AdminProductRes
  modalProps: ModalPropsType
  productOptionGroups: AdminProductOptionGroupRes[]
  refetchProductOptionGroups: () => void
}

const OptionGroupSeriesChangeModal = (props: OptionGroupSeriesChangeModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <OptionGroupSeriesChangeModalContent {...props} />
    </Modal>
  )
}

const OptionGroupSeriesChangeModalContent = ({
  shopId,
  product,
  modalProps,
  productOptionGroups,
  refetchProductOptionGroups
}: OptionGroupSeriesChangeModalProps) => {
  const { t } = useTranslation()
  const [isEdited, setIsEdited] = useState(false)
  const draggableBoundaryRef = useRef<HTMLDivElement>(null)
  const { draggableStyleTopCorrectionValue } = useDraggableTopStyleCorrection()
  const [normalOptionGroups, setNormalOptionGroups] = useState<AdminProductOptionGroupRes[]>(
    DataUtils.copy(productOptionGroups)
  )

  const { mutateAsync: updateBulkOptionGroupsMutate, isLoading: isUpdateBulkOptionGroupsLoading } =
    useShopsProductsProductOptionGroupsBulkUpdatePartialUpdate()

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result
    if (!destination || destination.index === source.index) {
      return
    }

    setNormalOptionGroups((prev) => {
      const result = DataUtils.moveArrayElement(prev, source.index, destination.index)
      return result ?? prev
    })
    setIsEdited(true)
  }

  const handleSeriesChangeSaveButtonClick = async () => {
    const getOptionGroupsBulk = (): AdminProductOptionGroupRequest[] => {
      return normalOptionGroups.map((menuGroup) => ({
        id: menuGroup.id
      }))
    }
    await updateBulkOptionGroupsMutate(
      { shopPk: shopId, productPk: product.id, data: { productOptionGroups: getOptionGroupsBulk() } },
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
      <Modal.Header title={t('menu:modal.option_detail.series-change-option-group')} />
      <HighLightModalSubtitle
        highLightText={product?.name}
        text={t('menu:modal.option_detail.option-group-series-modal.description')}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => {
            return (
              <div
                ref={(r) => ComponentUtils.setRefs(r, draggableBoundaryRef, provided.innerRef)}
                className="h-[440px] w-full overflow-auto"
                {...provided.droppableProps}>
                {normalOptionGroups?.map((group, index) => {
                  return (
                    <Draggable draggableId={String(group.id)} index={index} key={group.id}>
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
                            <OptionGroupRow optionGroup={group} index={index} />
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
      {isUpdateBulkOptionGroupsLoading && <LoadingOverlay />}
    </div>
  )
}

interface OptionGroupRowProps {
  optionGroup: AdminProductOptionGroupRes
  index: number
}
const OptionGroupRow = ({ optionGroup, index }: OptionGroupRowProps) => {
  return (
    <div className="flex h-[68px] w-full items-center justify-between gap-[24px] text-white">
      <span className="text-[14px] text-white">{index + 1}</span>
      <span className="ml-[10px] w-full text-[14px] text-white">{optionGroup.name}</span>
      <Icon name={IconNamesEnum.UnionThreeBar} className="h-[20px] w-[20px]" />
    </div>
  )
}

export default OptionGroupSeriesChangeModal
