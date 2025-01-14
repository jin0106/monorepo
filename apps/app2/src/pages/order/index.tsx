import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AdminOrderRes, UserTypeEnum } from '@/api/generated/types'
import LoadingOverlay from '@/components/common/LoadingOverlay'
import InfiniteContainer from '@/components/common/infinite/InfiniteContainer'
import Modal from '@/components/common/modal'
import MainLayout from '@/components/layouts/MainLayout'
import OrderCancelModal from '@/components/order/OrderCancelModal'
import OrderDrivingLogDownLoad from '@/components/order/OrderDrivingLogDownLoad'
import OrderDrivingLogModal from '@/components/order/OrderExcellModal'
import OrderFoodCard from '@/components/order/OrderFoodCard'
import OrderSearchFilter from '@/components/order/OrderSearchFilter'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import OrderContainer from '@/containers/order/OrderContainer'

export const pageOrderI18nNamespaces = [I18nNamespaceEnum.Order, I18nNamespaceEnum.Common]

const PageOrderContent = () => {
  const {
    sites,
    setSearchParam,
    ordersList,
    fetchNextOrderList,
    orderCancelModalNoteControls,
    orderDrivingLogModalControls,
    isLoadingAfterCancel,
    pullToRefreshStatus
  } = OrderContainer.useContainer()

  const { t } = useTranslation(pageOrderI18nNamespaces)

  return (
    <MainLayout title={t('common:menu.neubie_order')} pullToRefreshStatus={pullToRefreshStatus}>
      {/* todo neom은 기존 admin만 허용하는데 확인 */}
      <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SITE_ADMIN]}>
        <OrderDrivingLogDownLoad />
      </Permission>
      <div className="mt-[20px]">
        <OrderSearchFilter sites={sites} setSearchParam={setSearchParam} />
      </div>
      <InfiniteContainer<AdminOrderRes>
        className="rounded-box mt-[20px] grid h-[calc(100vh-300px)] w-full grid-cols-3 gap-[20px] bg-base-200"
        threshold={0.5}
        scrollData={ordersList}
        fetchNextPage={fetchNextOrderList}
        emptyContent={
          <div className="rounded-box mt-[20px] flex h-[60vh] w-full items-center justify-center gap-[20px] bg-base-300">
            {t('order:empty.content')}
          </div>
        }>
        {({ itemRes }) => {
          return <OrderFoodCard order={itemRes} />
        }}
      </InfiniteContainer>
      <Modal modalProps={orderCancelModalNoteControls}>
        <OrderCancelModal modalProps={orderCancelModalNoteControls} />
      </Modal>
      <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SITE_ADMIN]}>
        <Modal modalProps={orderDrivingLogModalControls}>
          <OrderDrivingLogModal modalProps={orderDrivingLogModalControls} />
        </Modal>
      </Permission>
      {isLoadingAfterCancel && <LoadingOverlay />}
    </MainLayout>
  )
}
const PageOrder = () => {
  return (
    <OrderContainer.Provider>
      <PageOrderContent />
    </OrderContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageOrderI18nNamespaces))
    }
  }
}

export default PageOrder
