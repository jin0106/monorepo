import { TFunction } from 'i18next'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserTypeEnum } from '@/api/generated/types'
import FileUpload from '@/components/common/FileUpload'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import Modal from '@/components/common/modal'
import ExcelErrorModal from '@/components/common/modal/ExcelErrorModal'
import Table from '@/components/common/tables'
import { TableColumnType } from '@/components/common/tables/TableContent'
import { Accepts, isFileTypeExcel } from '@/components/form/FileInput'
import MainLayout from '@/components/layouts/MainLayout'
import IconButton from '@/components/menu/IconButton'
import MenuCreateModal from '@/components/menu/MenuCreateModal'
import MenuDeleteModal from '@/components/menu/MenuDeleteModal'
import MenuExcelDownLoad from '@/components/menu/MenuExcelDownLoad'
import MenuFilter from '@/components/menu/MenuFilter'
import MenuGroupAddModal from '@/components/menu/MenuGroupAddModal'
import MenuGroupSeriesChangeModal from '@/components/menu/MenuGroupSeriesChangeModal'
import MenuGroupUpdateModal from '@/components/menu/MenuGroupUpdateModal'
import MenuSeriesChangeModal from '@/components/menu/MenuSeriesChangeModal'
import MenuUpdateModal from '@/components/menu/MenuUpdateModal'
import OptionDetailModal from '@/components/menu/OptionDetailModal'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import MenuContainer from '@/containers/menu/MenuContainer'
import useModal from '@/hooks/common/useModal'
import DataUtils from '@/utils/design-system/dataUtils'

const getColumns = (t: TFunction): TableColumnType[] => {
  return [
    {
      title: t('menu:name'),
      key: 'menuName'
    },
    {
      title: t('menu:image'),
      key: 'menuImage'
    },
    {
      title: t('menu:unit_price'),
      key: 'unitPrice'
    },
    {
      title: t('menu:sell_status'),
      key: 'sellStatus'
    },
    {
      title: t('menu:option_detail'),
      key: 'optionDetail'
    },
    {
      title: t('common:update'),
      key: 'optionUpdate'
    },
    {
      title: t('common:delete'),
      key: 'optionDelete'
    }
  ]
}

const pageMenuI18nNamespace = [I18nNamespaceEnum.Menu, I18nNamespaceEnum.Common]

const PageMenuContent = () => {
  const { t } = useTranslation(pageMenuI18nNamespace)

  const {
    productsSelectedCategory,
    selectedShop,
    uploadExcelFile,
    isLoading,
    productCategories,
    refetchProductCategories,
    refetchProductsSelectedCategory,
    selectedCategory,
    setSelectedCategory,
    productsContent,
    optionDetailModalProps,
    menuUpdateModalControls,
    menuDeleteModalControls
  } = MenuContainer.useContainer()

  const mainCategory = productCategories?.find((category) => category.isMain)

  const excelErrorModalProps = useModal()
  const menuGroupAddModalControls = useModal()
  const menuGroupUpdateModalControls = useModal()
  const menuGroupSeriesChangeModalControls = useModal()
  const menuCreateModalControls = useModal()
  const menuSeriesChangeModalControls = useModal()

  const handleMenuGroupUpdateButtonClick = () => {
    menuGroupUpdateModalControls.handleOpen()
  }
  const handleMenuGroupOrderChangeButtonClick = () => {
    menuGroupSeriesChangeModalControls.handleOpen()
  }
  const handleMenuGroupAddButtonClick = () => {
    menuGroupAddModalControls.handleOpen()
  }
  const handleMenuAddButtonClick = () => {
    menuCreateModalControls.handleOpen()
  }
  const handleMenuSeriesChangeButtonClick = () => {
    menuSeriesChangeModalControls.handleOpen()
  }

  const isAbleMenuGroupUpdate = !!selectedShop && !DataUtils.isEmpty(productCategories)
  const isAbleMenuGroupSeriesChange =
    !!selectedShop && productCategories && productCategories.filter((menuGroup) => !menuGroup.isMain).length > 1
  const isAbleMenuGroupAdd = !!selectedShop
  const isAbleMenuSeriesChange =
    !!selectedShop && !!selectedCategory && !!productsSelectedCategory && productsSelectedCategory.length > 1
  const isAbleMenuCreate = isAbleMenuGroupAdd
  const isAbleMenuUpdate = isAbleMenuGroupAdd
  const isAbleMenuDelete = isAbleMenuGroupAdd

  return (
    <MainLayout title={t('common:menu.menu')}>
      {DataUtils.isEmpty(productCategories) && !DataUtils.isEmpty(selectedShop) && <MenuExcelDownLoad />}
      <Table>
        <Table.Header
          leftSide={<MenuFilter />}
          rightSide={
            !DataUtils.isEmpty(selectedShop) ? (
              <div className="flex items-center justify-center gap-[20px]">
                <IconButton
                  iconName={IconNamesEnum.Pen}
                  text={t('menu:table-header.menu-group-fix')}
                  onClick={handleMenuGroupUpdateButtonClick}
                  disabled={!isAbleMenuGroupUpdate}
                />
                <div className="h-[13px] w-[1px] bg-[#353A46]" />
                <IconButton
                  iconName={IconNamesEnum.SwitchVertical}
                  text={t('menu:table-header.menu-group-order-change')}
                  onClick={handleMenuGroupOrderChangeButtonClick}
                  disabled={!isAbleMenuGroupSeriesChange}
                />
                <button
                  className="btn-md btn ml-4 h-5 bg-[#00B2E3] text-[#2B303B]"
                  onClick={handleMenuGroupAddButtonClick}
                  disabled={!isAbleMenuGroupAdd}>
                  {t('menu:table-header.menu-group-add')}
                </button>
              </div>
            ) : undefined
          }
        />
        {DataUtils.isEmpty(productCategories) ? (
          <Table.Content
            columns={getColumns(t)}
            emptyElement={
              DataUtils.isEmpty(selectedShop) ? (
                t('menu:empty_shop')
              ) : (
                <Permission allowAdminTypes={[UserTypeEnum.ADMIN]} disallowElement={t('menu:empty_shop')}>
                  <FileUpload
                    accept={Accepts.Excel}
                    isLoading={isLoading}
                    validate={(fileList) => {
                      const file = fileList[0]
                      if (!file) {
                        return false
                      }
                      if (!isFileTypeExcel(file)) {
                        alert(t('common:input.validate.file_type_excel'))
                        return false
                      }
                      return true
                    }}
                    onFileUpload={uploadExcelFile}
                  />
                </Permission>
              )
            }
            contents={[]}
          />
        ) : (
          productCategories.map((category, index) => {
            const categoryName = category.isMain ? t('menu:menu-create-modal.main-menu') : category.name
            const columnIndex = mainCategory ? index : index + 1

            return (
              <div key={category?.series} onClick={() => setSelectedCategory(category)}>
                <Table.Column key={category?.series} summary={`${columnIndex}. ${categoryName}`}>
                  {category === selectedCategory && productsContent && (
                    <div className="flex w-full flex-col">
                      <div className="flex h-[40px] items-center gap-[20px] pl-[10px]">
                        <IconButton
                          iconName={IconNamesEnum.Plus}
                          text={t('menu:table-row-header.menu-add')}
                          onClick={handleMenuAddButtonClick}
                        />
                        <div className="h-[13px] w-[1px] bg-[#353A46]" />
                        <IconButton
                          iconName={IconNamesEnum.SwitchVertical}
                          text={t('menu:table-row-header.menu-series-change')}
                          onClick={handleMenuSeriesChangeButtonClick}
                          disabled={!isAbleMenuSeriesChange}
                        />
                      </div>
                      {!DataUtils.isEmpty(productsSelectedCategory) && (
                        <Table.Content columns={getColumns(t)} contents={productsContent} />
                      )}
                    </div>
                  )}
                </Table.Column>
              </div>
            )
          })
        )}
      </Table>
      <Modal modalProps={excelErrorModalProps}>
        <ExcelErrorModal modalProps={excelErrorModalProps} />
      </Modal>
      {selectedShop && (
        <Modal modalProps={optionDetailModalProps}>
          <OptionDetailModal
            modalProps={optionDetailModalProps}
            shopId={selectedShop}
            refetchProductsSelectedCategory={refetchProductsSelectedCategory}
          />
        </Modal>
      )}
      {isAbleMenuGroupSeriesChange && (
        <MenuGroupSeriesChangeModal
          shopId={selectedShop}
          modalProps={menuGroupSeriesChangeModalControls}
          productCategories={productCategories}
          refetchProductCategories={refetchProductCategories}
          mainCategory={mainCategory}
        />
      )}
      {isAbleMenuGroupUpdate && (
        <MenuGroupUpdateModal
          shopId={selectedShop}
          modalProps={menuGroupUpdateModalControls}
          productCategories={productCategories}
          refetchProductCategories={refetchProductCategories}
        />
      )}
      {isAbleMenuGroupAdd && (
        <MenuGroupAddModal
          shopId={selectedShop}
          modalProps={menuGroupAddModalControls}
          refetchProductCategories={refetchProductCategories}
          mainCategory={mainCategory}
        />
      )}
      {isAbleMenuCreate && (
        <MenuCreateModal
          shopId={selectedShop}
          mainCategory={mainCategory}
          selectedCategory={selectedCategory}
          modalProps={menuCreateModalControls}
          refetchProductCategories={refetchProductCategories}
          refetchProductsSelectedCategory={refetchProductsSelectedCategory}
        />
      )}
      {isAbleMenuUpdate && (
        <MenuUpdateModal
          shopId={selectedShop}
          mainCategory={mainCategory}
          selectedCategory={selectedCategory}
          modalProps={menuUpdateModalControls}
          refetchProductCategories={refetchProductCategories}
          refetchProductsSelectedCategory={refetchProductsSelectedCategory}
        />
      )}
      {isAbleMenuDelete && (
        <MenuDeleteModal
          shopId={selectedShop}
          modalProps={menuDeleteModalControls}
          refetchProductCategories={refetchProductCategories}
          refetchProductsSelectedCategory={refetchProductsSelectedCategory}
        />
      )}
      {isAbleMenuSeriesChange && (
        <MenuSeriesChangeModal
          shopId={selectedShop}
          products={productsSelectedCategory}
          modalProps={menuSeriesChangeModalControls}
          selectedCategory={selectedCategory}
          refetchProductCategories={refetchProductCategories}
          refetchProductsSelectedCategory={refetchProductsSelectedCategory}
        />
      )}
      {isLoading && <LoadingOverlay />}
    </MainLayout>
  )
}

const PageMenu = () => {
  return (
    <MenuContainer.Provider>
      <PageMenuContent />
    </MenuContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageMenuI18nNamespace))
    }
  }
}

export default PageMenu
