import Router from 'next/router'
import { LocaleEnum } from '@/constants/i18n'

const isKorean = () => Router.locale === LocaleEnum.Korean

const LocaleUtils = {
  isKorean
}

export default LocaleUtils
