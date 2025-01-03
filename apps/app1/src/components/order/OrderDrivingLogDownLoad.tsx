import { DocumentTextIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'next-i18next'
import { I18nNamespaceEnum } from '@/constants/i18n'
import OrderContainer from '@/containers/order/OrderContainer'

const OrderDrivingLogDownLoad = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Order])
  const { orderDrivingLogModalControls } = OrderContainer.useContainer()
  return (
    <div className="rounded-box flex h-[70px] w-full items-center justify-between bg-base-100 px-[20px] py-[23px]">
      <div className="flex w-full gap-5">
        <span className="text-16 text-base-content">{t('order:order_driving_log.title')}</span>
        <span className="text-12 text-base-content/50">{t('order:order_driving_log.content')}</span>
      </div>
      <button className="btn-success btn text-white" onClick={() => orderDrivingLogModalControls.handleOpen()}>
        <DocumentTextIcon className="mr-[5px] h-5 w-5" />
        {t('order:modal.order_driving_log.title')}
      </button>
    </div>
  )
}

export default OrderDrivingLogDownLoad
