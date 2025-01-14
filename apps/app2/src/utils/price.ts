import { CurrencyEnum, CurrencyStrMap, LocaleCurrencyMap, LocaleEnum } from '@/constants/i18n'
import { numberWithCommas } from '@/utils/number'

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
  return `${numberWithCommas(price)} ${currencyStr}`
}

// Todo:: 언어와 화폐단위는 1대1이 아니므로 site마다 원화 단위를 입력받을 수 있어야 한다.
const toUnitPrice = (price = 0, locale: LocaleEnum) => {
  if (LocaleCurrencyMap.has(locale))
    switch (locale) {
      case LocaleEnum.Arabic_SaudiArabia:
        return `${numberWithCommas(price)} ${LocaleCurrencyMap.get(locale)}`
      case LocaleEnum.Korean:
        return `${numberWithCommas(price)} ${LocaleCurrencyMap.get(locale)}`
    }
}

export const PriceUtils = {
  toUnitPrice,
  toNumber,
  toUnitPriceByCurrency
}
