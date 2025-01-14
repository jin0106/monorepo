import React, { useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { DragDropContext, Draggable, DraggingStyle, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { useShopsProductCategoriesBulkUpdatePartialUpdate } from '@/api/generated/hooks'
import { type AdminProductCategoryRequest, AdminProductCategoryRes } from '@/api/generated/types'
import Icon from '@/components/common/Icon'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import useDraggableTopStyleCorrection from '@/hooks/common/useDraggableTopStyleCorrection'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'
import { ComponentUtils } from '@/utils/design-system/componentUtils'
import DataUtils from '@/utils/design-system/dataUtils'

interface MenuGroupSeriesChangeModalProps {
  modalProps: ModalPropsType
  shopId: number
  productCategories: AdminProductCategoryRes[]
  refetchProductCategories: () => Promise<void>
  mainCategory?: AdminProductCategoryRes
}

const MenuGroupSeriesChangeModal = (props: MenuGroupSeriesChangeModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuGroupSeriesChangeModalContent {...props} />
    </Modal>
  )
}

const MenuGroupSeriesChangeModalContent = ({
  modalProps,
  shopId,
  refetchProductCategories,
  productCategories,
  mainCategory
}: MenuGroupSeriesChangeModalProps) => {
  const { t } = useTranslation()
  const [isEdited, setIsEdited] = useState(false)
  const draggableBoundaryRef = useRef<HTMLDivElement>(null)
  const { draggableStyleTopCorrectionValue } = useDraggableTopStyleCorrection()
  const [normalMenuGroup, setNormalMenuGroup] = useState<AdminProductCategoryRes[]>(
    DataUtils.copy(productCategories.filter((category) => !category.isMain))
  )

  const { mutateAsync: updateBulkMenuGroupMutate, isLoading: isUpdateBulkMenuGroupLoading } =
    useShopsProductCategoriesBulkUpdatePartialUpdate()

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result
    if (!destination || destination.index === source.index) {
      return
    }
    setNormalMenuGroup((prev) => {
      const result = DataUtils.moveArrayElement(prev, source.index, destination.index)
      return result ?? prev
    })
    setIsEdited(true)
  }

  const handleSeriesChangeSaveButtonClick = async () => {
    const getCategoriesBulk = (): AdminProductCategoryRequest[] => {
      const result: AdminProductCategoryRequest[] = []
      if (mainCategory) {
        result.push({ id: mainCategory.id, name: mainCategory.name })
      }
      normalMenuGroup.forEach((menuGroup) => {
        result.push({ id: menuGroup.id, name: menuGroup.name })
      })
      return result
    }
    try {
      await updateBulkMenuGroupMutate(
        { shopPk: shopId, data: { categories: getCategoriesBulk() } },
        {
          onError: (error) => {
            ApiUtils.onErrorAlert(error)
          }
        }
      )
      await refetchProductCategories()
      modalProps.handleClose()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  }

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-group-series-change-modal.title')}</span>
      </Modal.Header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => {
            return (
              <div
                ref={(r) => ComponentUtils.setRefs(r, draggableBoundaryRef, provided.innerRef)}
                className="h-[440px] w-full overflow-auto"
                {...provided.droppableProps}>
                {normalMenuGroup?.map((menuGroup, index) => {
                  return (
                    <Draggable draggableId={String(menuGroup.id)} index={index} key={menuGroup.id}>
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
                            <MenuGroupRow menuGroup={menuGroup} index={index} />
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
      {isUpdateBulkMenuGroupLoading && <LoadingOverlay />}
    </div>
  )
}

interface MenuGroupRowProps {
  menuGroup: AdminProductCategoryRes
  index: number
}
const MenuGroupRow = ({ menuGroup, index }: MenuGroupRowProps) => {
  return (
    <div className="flex h-[68px] w-full items-center justify-between gap-[24px] text-white">
      <span className="text-[14px] text-white">{index + 1}</span>
      <span className="ml-[10px] w-full text-[14px] text-white">{menuGroup.name}</span>
      <Icon name={IconNamesEnum.UnionThreeBar} className="h-[20px] w-[20px]" />
    </div>
  )
}

export default MenuGroupSeriesChangeModal
