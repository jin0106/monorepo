import { useCallback } from 'react'
import { enUS, ko } from 'date-fns/locale'
import { useRouter } from 'next/router'
import { CurrencyEnum, LocaleDateFormatMap, LocaleEnum } from '@/constants/i18n'
import { DateUtils } from '@/utils/date'
import { PriceUtils } from '@/utils/price'

export const localeDefault = process.env.NEXT_PUBLIC_LOCALE_DEFAULT || LocaleEnum.Korean

export const toDateFnsLocale = (locale: LocaleEnum) => {
  switch (locale) {
    case LocaleEnum.Arabic_SaudiArabia:
      // arSA
      return enUS
    case LocaleEnum.Korean:
      return ko
  }
}

const useLocale = () => {
  const { locale, replace, pathname, query } = useRouter()
  const localeCurrent = (locale || localeDefault) as LocaleEnum
  const setLocale = useCallback(
    async (localeEnum: LocaleEnum) => {
      return replace({ pathname, query }, undefined, { locale: localeEnum })
    },
    [replace]
  )

  /**
   * @link PriceUtils.toUnitPrice
   */
  const toUnitPrice = (price = 0) => {
    return PriceUtils.toUnitPrice(price, localeCurrent)
  }

  /**
   * @link PriceUtils.toUnitPriceByCurrency
   */
  const toUnitPriceByCurrency = (price = 0, currency: CurrencyEnum | string = CurrencyEnum.KRW) => {
    return PriceUtils.toUnitPriceByCurrency(price, currency as CurrencyEnum)
  }

  /**
   * @link DateUtils.formatMinSec
   * @param seconds
   */
  const formatMinSec = (seconds: number) => {
    return DateUtils.formatMinSec(seconds, localeCurrent)
  }

  /**
   * @link DateUtils.formatDate
   */
  const formatDate = (date: string, format: string) => {
    return DateUtils.formatDate(date, format, localeCurrent)
  }

  /**
   * @link DateUtils.formatHourMin
   */
  const formatHourMin = (timeStr: string) => {
    return DateUtils.formatHourMin(timeStr, localeCurrent)
  }

  const getLocaleOfDateFns = () => {
    return toDateFnsLocale(localeCurrent)
  }

  const toMonthName = (month: number) => {
    const formatter = new Intl.DateTimeFormat(LocaleDateFormatMap.get(localeCurrent), { month: 'long' })
    return formatter.format(new Date().setMonth(month - 1))
  }

  return {
    locale: localeCurrent,
    setLocale,
    toUnitPrice,
    toUnitPriceByCurrency,
    formatMinSec,
    formatDate,
    formatHourMin,
    getLocaleOfDateFns,
    toMonthName
  }
}

export default useLocale
