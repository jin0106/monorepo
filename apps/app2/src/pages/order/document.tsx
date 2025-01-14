import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AdminOrderRes } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import InfiniteContainer from '@/components/common/infinite/InfiniteContainer'
import Modal from '@/components/common/modal'
import MainLayout from '@/components/layouts/MainLayout'
import DocumentOrderCancelModal from '@/components/order/DocumentOrderCancelModal'
import OrderDocumentCard from '@/components/order/OrderDocumentCard'
import OrderDocumentSearchFilter from '@/components/order/OrderDocumentSearchFilter'
import { I18nNamespaceEnum } from '@/constants/i18n'
import AuthContainer from '@/containers/common/AuthContainer'
import OrderDocumentContainer from '@/containers/order/OrderDocumentContainer'
import Page404 from '../404'

export const pageOrderDocumentI18nNamespaces = [I18nNamespaceEnum.OrderDocument, I18nNamespaceEnum.Common]

const PageOrderDocumentContent = () => {
  const {
    ordersList,
    fetchNextOrderList,
    isLoadingAfterCancel,
    documentOrderCancelModalControls,
    pullToRefreshStatus
  } = OrderDocumentContainer.useContainer()

  const { t } = useTranslation(pageOrderDocumentI18nNamespaces)

  return (
    <MainLayout title={t('common:menu.document_order')} pullToRefreshStatus={pullToRefreshStatus}>
      <div className="mt-[20px]">
        <OrderDocumentSearchFilter />
      </div>
      <InfiniteContainer<AdminOrderRes>
        className="rounded-box mt-[20px] grid h-[calc(100vh-300px)] min-h-[70vh] w-full grid-cols-3 gap-[20px] bg-base-200"
        threshold={0.5}
        scrollData={ordersList}
        fetchNextPage={fetchNextOrderList}
        emptyContent={
          <div className="rounded-box mt-[20px] flex h-[60vh] w-full items-center justify-center gap-[20px] bg-base-300">
            {t('order_document:empty.content')}
          </div>
        }>
        {({ itemRes }) => {
          return <OrderDocumentCard order={itemRes} />
        }}
      </InfiniteContainer>
      <Modal modalProps={documentOrderCancelModalControls} showCloseBtn={false}>
        <DocumentOrderCancelModal modalProps={documentOrderCancelModalControls} />
      </Modal>
      {isLoadingAfterCancel && <LoadingOverlay />}
    </MainLayout>
  )
}
const PageOrderDocument = () => {
  const { hasDocumentPermission } = AuthContainer.useContainer()
  if (!hasDocumentPermission()) {
    return <Page404 />
  }
  return (
    <OrderDocumentContainer.Provider>
      <PageOrderDocumentContent />
    </OrderDocumentContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageOrderDocumentI18nNamespaces))
    }
  }
}

export default PageOrderDocument
