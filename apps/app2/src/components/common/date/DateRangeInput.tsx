import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'next-i18next'
import { DateRange, Range } from 'react-date-range'
import { I18nNamespaceEnum } from '@/constants/i18n'
import useLocale from '@/hooks/common/useLocale'
import { DateUtils } from '@/utils/date'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

export type DateProps = { startDate?: Date; endDate?: Date }

export type DateRangeInputProps = {
  date?: DateProps
  setDate?: (date: DateProps) => void
  rangeText?: string
  useResetDate?: boolean
}

const DateRangeInput = ({ date, setDate, rangeText, useResetDate = true }: DateRangeInputProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.Common])
  const { getLocaleOfDateFns } = useLocale()
  const [visible, setVisible] = useState(false)
  const [ranges, setRanges] = useState<Range[]>([
    { startDate: date?.startDate, endDate: date?.endDate, key: 'selection' }
  ])
  return (
    <div className="relative flex gap-2">
      <div
        className="input-bordered input flex w-[250px] items-center justify-between"
        onClick={() => setVisible(true)}>
        <span className="text-sm">
          {DateUtils.getRangeDateString(ranges?.[0]?.startDate, ranges?.[0]?.endDate) ??
            rangeText ??
            t('common:period')}
        </span>
        <CalendarIcon className="h-5 w-5" />
      </div>
      {useResetDate && (
        <button
          type="button"
          className="btn-md btn"
          onClick={() => {
            setRanges([{ startDate: undefined, endDate: undefined, key: 'selection' }])
            setDate?.({ startDate: undefined, endDate: undefined })
          }}>
          {t('common:filter.reset_date')}
        </button>
      )}
      {visible && (
        <>
          <DateRange
            dateDisplayFormat={'yyyy-MM-dd'}
            locale={getLocaleOfDateFns()}
            className="absolute left-0 top-[60px] z-50"
            ranges={ranges}
            onChange={(item) => {
              setRanges([item?.selection])
              setDate?.({ startDate: item?.selection?.startDate, endDate: item?.selection?.endDate })
            }}
          />
          <div className="fixed right-0 top-0 z-40 h-[100vh] w-[100vw]" onClick={() => setVisible(false)}></div>
        </>
      )}
    </div>
  )
}

export default DateRangeInput
