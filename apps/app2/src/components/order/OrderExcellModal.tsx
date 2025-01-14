import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useOrdersDrivingLogCreate } from '@/api/generated/hooks'
import DateRangeInput, { DateProps } from '@/components/common/date/DateRangeInput'
import Modal from '@/components/common/modal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { ModalPropsType } from '@/hooks/common/useModal'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import { ApiUtils } from '@/utils/apiUtils'
import { DateUtils } from '@/utils/date'

const OrderDrivingLogModal = ({ modalProps }: { modalProps: ModalPropsType }) => {
  const { t } = useTranslation([I18nNamespaceEnum.Order, I18nNamespaceEnum.Common])
  const { sitesList: siteList } = useAllSitesList()
  const [date, setDate] = useState<DateProps>()
  const [selectedSite, setSelectedSite] = useState<number>()
  const { mutate: requestExcelMutation } = useOrdersDrivingLogCreate({
    mutation: {
      onSuccess: (data) => {
        data?.excel && window?.open(data.excel)
      },
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
      }
    }
  })

  const onSubmit = async () => {
    const startDate = DateUtils.getDateString(date?.startDate)
    const endDate = DateUtils.getDateString(date?.endDate)
    if (!selectedSite || !startDate || !endDate) return
    requestExcelMutation({ data: { site: selectedSite, startDate, endDate } })
  }
  return (
    <div className="relative flex min-h-[500px] min-w-[500px] max-w-[500px] flex-col">
      <Modal.Header>
        <span className="text-[24px] font-bold">{t('order:modal.order_driving_log.title')}</span>
      </Modal.Header>
      <div className="flex flex-col gap-[12px] py-[16px]">
        <DateRangeInput
          date={date}
          useResetDate={false}
          setDate={(date) => {
            setDate(date)
          }}
        />
        <select
          onChange={(e) => {
            e?.target?.value && setSelectedSite(parseInt(e.target.value))
          }}
          className="select-bordered select">
          <option value="">{t('order:modal.order_driving_log.select_site')}</option>
          {siteList.map((site) => (
            <option key={site?.id} value={site?.id}>
              {site?.name}
            </option>
          ))}
        </select>
      </div>
      <div className="absolute bottom-0 mt-6 flex min-w-full max-w-full gap-2 gap-2">
        <button className="btn-outline btn relative w-full flex-shrink" onClick={modalProps?.handleClose}>
          {t('common:cancel')}
        </button>
        <button className="btn-info btn w-full flex-shrink text-white" onClick={onSubmit}>
          {t('order:modal.order_driving_log.cta')}
        </button>
      </div>
    </div>
  )
}

export default OrderDrivingLogModal
