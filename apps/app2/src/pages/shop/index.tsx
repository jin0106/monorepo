import { GetStaticProps, GetStaticPropsContext } from 'next'
import Link from 'next/link'
import { TFunction, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AdminProductUpdateImageReqRequest, UserTypeEnum } from '@/api/generated/types'
import Modal from '@/components/common/modal'
import ImageUploadModal from '@/components/common/modal/ImageUploadModal'
import Table from '@/components/common/tables'
import { TableColumnType } from '@/components/common/tables/TableContent'
import FormDevTools from '@/components/form/FormDevTools'
import MainLayout from '@/components/layouts/MainLayout'
import Permission from '@/components/permission/Permission'
import ShopListFilter from '@/components/shop/ShopListFilter'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { Routes } from '@/constants/routes'
import ShopContainer, { MainImageUploadModalData } from '@/containers/shop/ShopContainer'

const getColumns = (t: TFunction): TableColumnType[] => {
  return [
    {
      title: t('shop:name'),
      key: 'name'
    },
    {
      title: t('shop:center_coordinates'),
      key: 'shopCoordinate'
    },
    {
      title: t('shop:main_image'),
      key: 'mainImage',
      contentClassName: 'truncate overflow-hidden max-w-[200px]'
    },
    {
      title: t('shop:business_hours'),
      key: 'businessHours'
    },
    {
      title: t('shop:break_time'),
      key: 'breakTime'
    },
    {
      title: t('shop:account_manager'),
      key: 'accountManager'
    },
    {
      title: t('common:shop_open'),
      key: 'isOpen'
    },
    {
      title: t('common:update'),
      key: 'goToUpdate'
    }
  ]
}

const pageShopI18nNameSpaces = [I18nNamespaceEnum.Shop, I18nNamespaceEnum.Common]

const PageShopContent = () => {
  const { t } = useTranslation(pageShopI18nNameSpaces)
  const {
    shopsListContent,
    isShopListLoading,
    itemCountPerPage,
    currentPage,
    handlePageChange,
    shopsListCount,
    imageUploadModalFormControl,
    imageUploadModalProps,
    imageUploadModalDescription,
    handleImageUploadSubmit,
    handleImageUploadFileChange,
    pullToRefreshStatus
  } = ShopContainer.useContainer()

  return (
    <MainLayout title={t('common:menu.shop')} pullToRefreshStatus={pullToRefreshStatus}>
      <Table>
        <Table.Header
          leftSide={
            <Permission allowAdminTypes={[UserTypeEnum.ADMIN]}>
              <ShopListFilter />
            </Permission>
          }
          rightSide={
            <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SITE_ADMIN]}>
              <Link href={Routes.Shop.Register}>
                <button className="btn-info btn my-3 normal-case">{t('shop:create_shop')}</button>
              </Link>
            </Permission>
          }
        />
        {!isShopListLoading && (
          <Table.Content columns={getColumns(t)} contents={shopsListContent} emptyElement={t('shop:empty_content')} />
        )}
        {shopsListCount !== undefined && (
          <Table.Pagenation
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pagePerCount={itemCountPerPage}
            totalCount={shopsListCount}
          />
        )}
      </Table>
      <Modal modalProps={imageUploadModalProps}>
        <ImageUploadModal<MainImageUploadModalData, AdminProductUpdateImageReqRequest>
          name="mainImage"
          modalProps={imageUploadModalProps}
          title={t('shop:modal.add_image.title')}
          description={imageUploadModalDescription}
          helperText={t('shop:modal.add_image.helper')}
          imageUploadModalFormControl={imageUploadModalFormControl}
          onSubmit={handleImageUploadSubmit}
          onImageUploadFileChange={handleImageUploadFileChange}
        />
      </Modal>
      <FormDevTools control={imageUploadModalFormControl.control} />
    </MainLayout>
  )
}
const PageShop = () => {
  return (
    <ShopContainer.Provider>
      <PageShopContent />
    </ShopContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageShopI18nNameSpaces))
    }
  }
}

export default PageShop
