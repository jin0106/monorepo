import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { DragDropContext, Draggable, DraggingStyle, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { useShopsProductCategoriesProductsBulkUpdatePartialUpdate } from '@/api/generated/hooks'
import {
  AdminProductCategoryRes,
  AdminProductRes,
  PatchedAdminProductBulkUpdateReqRequest
} from '@/api/generated/types'
import Icon from '@/components/common/Icon'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import useDraggableTopStyleCorrection from '@/hooks/common/useDraggableTopStyleCorrection'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'
import { ComponentUtils } from '@/utils/design-system/componentUtils'
import DataUtils from '@/utils/design-system/dataUtils'

interface MenuSeriesChangeModalProps {
  shopId: number
  modalProps: ModalPropsType
  selectedCategory: AdminProductCategoryRes
  products: AdminProductRes[]
  refetchProductCategories: () => void
  refetchProductsSelectedCategory: () => void
}

const MenuSeriesChangeModal = (props: MenuSeriesChangeModalProps) => {
  return (
    <Modal modalProps={props.modalProps} showCloseBtn={false}>
      <MenuSeriesChangeModalContent {...props} />
    </Modal>
  )
}

const MenuSeriesChangeModalContent = ({
  modalProps,
  shopId,
  refetchProductCategories,
  refetchProductsSelectedCategory,
  selectedCategory,
  products
}: MenuSeriesChangeModalProps) => {
  const { t } = useTranslation()
  const [isEdited, setIsEdited] = useState(false)
  const [normalMenu, setNormalMenu] = useState<AdminProductRes[]>(DataUtils.copy(products))
  const { draggableStyleTopCorrectionValue } = useDraggableTopStyleCorrection()

  const { mutateAsync: updateBulkMenuMutate, isLoading: isUpdateBulkMenuLoading } =
    useShopsProductCategoriesProductsBulkUpdatePartialUpdate()

  const handleDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result
    if (!destination || destination.index === source.index) {
      return
    }
    setNormalMenu((prev) => {
      const result = DataUtils.moveArrayElement(prev, source.index, destination.index)
      return result ?? prev
    })
    setIsEdited(true)
  }

  const handleSeriesChangeSaveButtonClick = async () => {
    const getMenuGroupSeriesBulk = (): PatchedAdminProductBulkUpdateReqRequest => {
      return {
        products: normalMenu.map((menu) => ({
          id: menu.id
        }))
      }
    }

    try {
      await updateBulkMenuMutate(
        { shopPk: shopId, id: selectedCategory.id, data: getMenuGroupSeriesBulk() },
        {
          onError: (error) => {
            ApiUtils.onErrorAlert(error)
          }
        }
      )
      await refetchProductCategories()
      await refetchProductsSelectedCategory()
      modalProps.handleClose()
    } catch (error: any) {
      ApiUtils.onErrorAlert(error)
    }
  }

  return (
    <div className="flex w-[688px] flex-col">
      <Modal.Header>
        <div className="flex flex-col gap-[4px]">
          <span className="text-[24px] font-bold text-[#E9E9E9]">{t('menu:menu-series-change-modal.title')}</span>
          <div className="flex">
            <span className="text-[14px] text-[#EF8A43]">{selectedCategory.name}</span>
            <span className="text-[14px] text-[#C4C4C4]">{t('menu:menu-series-change-modal.subtitle')}</span>
          </div>
        </div>
      </Modal.Header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided) => {
            return (
              <div
                ref={(r) => ComponentUtils.setRefs(r, droppableProvided.innerRef)}
                className="h-[440px] w-full overflow-auto"
                {...droppableProvided.droppableProps}>
                {normalMenu?.map((menu, index) => {
                  return (
                    <Draggable draggableId={String(menu.id)} index={index} key={menu.id}>
                      {(provided) => {
                        const draggbleStyle = provided.draggableProps.style as DraggingStyle
                        const draggableStyle = {
                          ...draggbleStyle,
                          left: 20,
                          // 어떤 값 때문에 이러한 수정값이 일어나는지 의문.. 아마 화면 width, height 차이 때문인 것으로 생각합니다.
                          top: draggbleStyle.top - draggableStyleTopCorrectionValue || 0
                        }
                        return (
                          <div
                            className="w-full"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={draggableStyle}>
                            <MenuRow menu={menu} index={index} />
                          </div>
                        )
                      }}
                    </Draggable>
                  )
                })}
                {droppableProvided.placeholder}
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
      {isUpdateBulkMenuLoading && <LoadingOverlay />}
    </div>
  )
}

interface MenuRowProps {
  menu: AdminProductRes
  index: number
}
const MenuRow = ({ menu, index }: MenuRowProps) => {
  return (
    <div className="flex h-[68px] w-full items-center justify-between gap-[24px] text-white">
      <span className="text-[14px] text-white">{index + 1}</span>
      <span className="ml-[10px] w-full text-[14px] text-white">{menu.name}</span>
      <Icon name={IconNamesEnum.UnionThreeBar} className="h-[20px] w-[20px]" />
    </div>
  )
}

export default MenuSeriesChangeModal
