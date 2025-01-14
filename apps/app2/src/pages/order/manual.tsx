import { TFunction } from 'i18next'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Modal from '@/components/common/modal'
import Table from '@/components/common/tables'
import MainLayout from '@/components/layouts/MainLayout'
import OrderCancelNoteModal from '@/components/order/OrderCancelNoteModal'
import OrderManualRegisterModal from '@/components/order/OrderManualRegisterModal'
import OrderSearchFilter from '@/components/order/OrderSearchFilter'
import { I18nNamespaceEnum } from '@/constants/i18n'
import GeoMapContainer from '@/containers/GeoMapContainer'
import OrderManualContainer from '@/containers/order/OrderManualContainer'

const getOrderManualColumns: TFunction = (t: TFunction) => [
  {
    title: t('common:order_status.canceled'),
    key: 'orderCancel'
  },
  {
    title: t('order_manual:order_info'),
    key: 'orderInfo'
  },
  {
    title: t('order:order_status'),
    key: 'orderStatus'
  },
  {
    title: t('order:start_node'),
    key: 'startNode'
  },
  {
    title: t('order:end_node'),
    key: 'endNode'
  },
  {
    title: t('order:order_products'),
    key: 'orderProducts'
  },
  {
    title: t('order:order_price'),
    key: 'orderPrice'
  },
  {
    title: t('order:phone'),
    key: 'phone'
  }
]

const pageOrderManualI18nNamespaces = [I18nNamespaceEnum.OrderManual, I18nNamespaceEnum.Order, I18nNamespaceEnum.Common]

const PageOrderManualContent = () => {
  const {
    manualSites,
    ordersListContent,
    isOrderListLoading,
    itemCountPerPage,
    currentPage,
    ordersListCount,
    orderCancelNoteModalControls,
    handlePageChange,
    setSearchParam,
    updateOrderCancelNote,
    orderManualRegisterModalProps
  } = OrderManualContainer.useContainer()
  const { t } = useTranslation(pageOrderManualI18nNamespaces)

  return (
    <MainLayout title={t('common:menu.manual_order')}>
      <Table>
        <Table.Header
          leftSide={<OrderSearchFilter setSearchParam={setSearchParam} sites={manualSites} />}
          rightSide={
            <button className="btn-info btn font-normal text-white" onClick={orderManualRegisterModalProps.handleOpen}>
              {t('order_manual:create_order')}
            </button>
          }
        />
        {!isOrderListLoading && (
          <Table.Content
            columns={getOrderManualColumns(t)}
            contents={ordersListContent}
            emptyElement={t('order:empty_content')}
          />
        )}
        {ordersListCount !== undefined && (
          <Table.Pagenation
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pagePerCount={itemCountPerPage}
            totalCount={ordersListCount}
          />
        )}
      </Table>
      <Modal modalProps={orderCancelNoteModalControls}>
        <OrderCancelNoteModal
          modalControls={orderCancelNoteModalControls}
          updateOrderCancelNote={updateOrderCancelNote}
        />
      </Modal>
      <Modal modalProps={orderManualRegisterModalProps}>
        <OrderManualRegisterModal modalProps={orderManualRegisterModalProps} />
      </Modal>
    </MainLayout>
  )
}
const PageOrderManual = () => {
  return (
    <GeoMapContainer.Provider>
      <OrderManualContainer.Provider>
        <PageOrderManualContent />
      </OrderManualContainer.Provider>
    </GeoMapContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageOrderManualI18nNamespaces))
    }
  }
}

export default PageOrderManual
