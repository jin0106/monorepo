import dayjs, { extend as dayjsExtend } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { TFunction } from 'next-i18next'
import { LocaleDateFormatMap, LocaleEnum } from '@/constants/i18n'
import { DateFormat } from '@/utils/design-system/dateUtils'

dayjsExtend(customParseFormat)

/**
 * 입력 받은 초를 분:초로 변경
 */
const formatMinSec = (seconds: number, locale: LocaleEnum) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (locale === LocaleEnum.Korean) {
    return `${minutes}분 ${remainingSeconds.toString().padStart(2, '0')}초`
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const removeSeconds = (timeString?: string | null) => {
  if (!timeString) {
    return ''
  }
  return timeString?.substring(0, 5)
}

// getBusinessHours
const getStartEndHoursString = (
  openedAt: string | undefined | null,
  closedAt: string | undefined | null,
  t: TFunction
): string | undefined => {
  if (!openedAt || !closedAt) {
    return undefined
  }
  const openedAtDayjs = dayjs(openedAt, 'HH:mm:ss')
  const closedAtDayjs = dayjs(closedAt, 'HH:mm:ss')
  // 익일 영업 여부
  const isOpenToNextDay = openedAtDayjs.isAfter(closedAtDayjs)

  if (!openedAtDayjs.isValid() || !closedAtDayjs.isValid()) {
    return undefined
  }

  return `${openedAtDayjs.format('HH:mm')}~${
    (isOpenToNextDay ? t('shop:next-day') + ' ' : '') + closedAtDayjs.format('HH:mm')
  }`
}

const getNowIsAble = (openedAt: string | undefined | null, closedAt: string | undefined | null) => {
  if (!openedAt || !closedAt) {
    return false
  }
  const currentTime = new Date()
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()

  const [openHour, openMinute] = openedAt.split(':').map(Number)
  const [closeHour, closeMinute] = closedAt.split(':').map(Number)

  const open = openHour * 60 + openMinute
  const close = closeHour * 60 + closeMinute
  const now = currentHour * 60 + currentMinute

  return open <= now && now <= close
}

const getNowIsAbleWithEmpty = (openedAt: string | undefined | null, closedAt: string | undefined | null) => {
  if (!openedAt || !closedAt) {
    return true
  }
  const currentTime = new Date()
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()

  const [openHour, openMinute] = openedAt.split(':').map(Number)
  const [closeHour, closeMinute] = closedAt.split(':').map(Number)

  const open = openHour * 60 + openMinute
  const close = closeHour * 60 + closeMinute
  const now = currentHour * 60 + currentMinute

  return open <= now && now <= close
}

const formatDate = (date: string, format: string, locale: LocaleEnum) => {
  const dayjsLocale = locale === LocaleEnum.Arabic_SaudiArabia ? 'en' : 'ko'
  return dayjs(date).locale(dayjsLocale).format(format)
}

/**
 * 입력받은 timeString을 형식에 맞춰서 변경
 * @param timeStr 00:00 과 같은 형식으로 입력
 * @param locale
 */
const formatHourMin = (timeStr: string, locale: LocaleEnum): string => {
  const timeParts = timeStr.split(':')
  const hoursTmp = parseInt(timeParts[0])
  const isAm = hoursTmp < 12
  const hours = (isAm ? hoursTmp : hoursTmp - 12).toString().padStart(2, '0')
  const minutes = parseInt(timeParts[1]).toString().padStart(2, '0')

  if (locale === LocaleEnum.Arabic_SaudiArabia) {
    return `${isAm ? 'AM' : 'PM'} ${hours}:${minutes}`
  }

  return `${isAm ? '오전' : '오후'} ${hours}시 ${minutes}분`
}

const getDateString = (date?: Date | string, format = 'YYYY-MM-DD') => {
  if (!date) return
  return `${dayjs(date).format(format)}`
}

const getRangeDateString = (start?: Date | string, end?: Date, format = 'YYYY-MM-DD') => {
  if (!start || !end) return
  return `${getDateString(start, format)} ~ ${getDateString(end, format)}`
}

/**
 * 입력 받은 month의 이름을 출력하는 함수
 * @param month 1 base로 입력. 1월 = 1, 2월 = 2, 3월 = 3과 같음
 * @param locale @link LocaleEnum
 * @param isFullName .
 */
const toMonthName = (month: number, locale: LocaleEnum, isFullName = true) => {
  const formatter = new Intl.DateTimeFormat(LocaleDateFormatMap.get(locale), { month: isFullName ? 'long' : 'short' })
  return formatter.format(new Date().setMonth(month - 1))
}

const convertToDayjs = (data: string | undefined | null, format: DateFormat = DateFormat.TIME) => {
  return dayjs(data, format)
}

const isSameDateTime = (
  firstDate: string | dayjs.Dayjs | null | undefined,
  secondDate: string | dayjs.Dayjs | null | undefined,
  format: DateFormat
) => {
  return dayjs(firstDate, format).isSame(dayjs(secondDate, format))
}

export const DateUtils = {
  formatMinSec,
  removeSeconds,
  getStartEndHoursString,
  getNowIsAble,
  getNowIsAbleWithEmpty,
  formatDate,
  formatHourMin,
  getDateString,
  getRangeDateString,
  toMonthName,
  convertToDayjs,
  isSameDateTime
}
