import { CurrencyEnum, CurrencyStrMap, LocaleCurrencyMap, LocaleEnum } from '@/constants/i18n'
import { NumberUtils } from '@/utils/design-system/numberUtils'

const toNumber = (value?: string | number) => {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'string') {
    return Number(value)
  }
  return value
}

const toUnitPriceByCurrency = (price = 0, currency: CurrencyEnum) => {
  const currencyStr = CurrencyStrMap.get(currency) || ''
  return `${NumberUtils.numberWithCommas(price)} ${currencyStr}`
}

const toUnitPrice = (price = 0, locale: LocaleEnum) => {
  if (!LocaleCurrencyMap.has(locale)) return
  return `${NumberUtils.numberWithCommas(price)} ${LocaleCurrencyMap.get(locale)}`
}

const toUnitPoint = (point = 0) => {
  return `${NumberUtils.numberWithCommas(point)} P`
}

export const PriceUtils = {
  toUnitPrice,
  toNumber,
  toUnitPriceByCurrency,
  toUnitPoint
}
