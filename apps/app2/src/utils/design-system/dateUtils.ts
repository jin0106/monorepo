import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import { LocaleDateFormatMap, LocaleEnum } from '@/constants/i18n'
import { TypeUtils } from '@/utils/design-system/typeUtils'

export enum DateTypeEnum {
  DATE = 'DATE',
  TIME = 'TIME',
  DATETIME = 'DATETIME',
  DATETIME_UTC_OFFSET = 'DATETIME_UTC_OFFSET'
}

dayjs.extend(customParseFormat)
dayjs.extend(utc)

const dateRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
const dateTimeRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}[T,\s][0-9]{2}:[0-9]{2}$/
const dateTimeSecondRegex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}[T,\s][0-9]{2}:[0-9]{2}:[0-9]{2}$/
const timeRegex = /^[0-9]{2}:[0-9]{2}$/
const timeSecondRegex = /^[0-9]{2}:[0-9]{2}:[0-9]{2}$/
const dateDotTimeRegex = /^[0-9]{4}.[0-9]{2}.[0-9]{2} [0-9]{2}:[0-9]{2}$/

export const defaultUtcOffsetMinute = 0 // UTC

export enum DateFormat {
  DATE = 'YYYY-MM-DD',
  TIME = 'HH:mm',
  TIME_SECOND = 'HH:mm:ss',
  DATETIME = 'YYYY-MM-DDTHH:mm',
  DATETIME_SECOND = 'YYYY-MM-DDTHH:mm:ss',
  DATETIME_DOT = 'YYYY.MM.DD HH:mm'
}

export enum DateFormatForDisplay {
  DATE = 'YYYY. MM. DD',
  TIME = 'HH:mm',
  DATETIME = 'YYYY. MM. DD HH:mm',
  DATETIME_SECOND = 'YYYY. MM. DD HH:mm:ss'
}

/**
 * 입력받지 않은 시/분/초를 채우는 타입
 */
export enum DatePaddingTypeEnum {
  /**
   * 시작일, 최소값으로 채움.
   * @example
   * 2024-01-01 00:00:00
   */
  START = 'START',
  /**
   * 종료일, 최대값으로 채움
   * @example
   * 2024-01-01 23:59:59
   */
  END = 'END'
}

export type DateStrType = string | number | dayjs.Dayjs | Date | null | undefined

/**
 * 입력 문자열을 YYYY-MM-DDTHH:mm:ss 형태로 변환
 */
const toDatetimeSecondStr = (dateStr: string, datePaddingType: DatePaddingTypeEnum = DatePaddingTypeEnum.START) => {
  if (!dateStr) {
    return ''
  }

  if (dateRegex.test(dateStr)) {
    const padding = datePaddingType === DatePaddingTypeEnum.START ? '00:00:00' : '23:59:59'
    return `${dateStr}T${padding}`
  }

  if (dateTimeRegex.test(dateStr) || timeRegex.test(dateStr)) {
    const padding = datePaddingType === DatePaddingTypeEnum.START ? ':00' : ':59'
    return `${dateStr}${padding}`
  }

  return dateStr
}

const toDatetimeSecondUtcOffsetStr = (
  dateStr: string,
  datePaddingType: DatePaddingTypeEnum = DatePaddingTypeEnum.START,
  utcOffset = defaultUtcOffsetMinute
) => {
  const datetimeStr = toDatetimeSecondStr(dateStr, datePaddingType)
  return `${datetimeStr}${toUtcOffsetString(utcOffset)}`
}

/**
 * 입력 문자열을 YYYY-MM-DDTHH:mm 형태로 변환
 */
const toDatetimeStr = (dateStr: string, datePaddingType: DatePaddingTypeEnum = DatePaddingTypeEnum.START) => {
  if (!dateStr) {
    return ''
  }

  if (dateRegex.test(dateStr)) {
    const padding = datePaddingType === DatePaddingTypeEnum.START ? '00:00' : '23:59'
    return `${dateStr}T${padding}`
  }

  return dateStr
}

/**
 * 입력 문자열을 YYYY-MM-DD 형태로 변환
 * @param dateStr 입력 문자열
 */
const toDateStr = (dateStr: string, utcOffsetMinute = defaultUtcOffsetMinute) => {
  if (!dateStr) {
    return ''
  }

  return dayjs(dateStr).utcOffset(utcOffsetMinute).format(DateFormat.DATE)
}

/**
 * 입력 문자열을 HH:mm 형태로 변환
 * @param timeSecondStr 입력 문자열
 */
const toTimeStr = (timeSecondStr: string) => {
  if (!timeSecondStr) {
    return ''
  }
  if (timeSecondRegex.test(timeSecondStr)) {
    return timeSecondStr.slice(0, 5)
  }
}

/**
 * 입력 문자열을 YYYY.MM.DD HH:mm 형태로 변환
 * @param dateStr 입력 문자열
 */
const toDateDotTimeStr = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }

  return dayjs(dateStr).format(DateFormat.DATETIME_DOT)
}

const toDateStrForDisplay = (
  dateType: DateTypeEnum,
  dateStr: string | undefined | null,
  utcOffsetMinute = defaultUtcOffsetMinute
) => {
  if (dateStr === undefined || dateStr === null || dateStr === '') {
    return ''
  }
  switch (dateType) {
    case DateTypeEnum.DATETIME:
      return dayjs(dateStr).isValid() ? dayjs(dateStr).utcOffset(utcOffsetMinute).format(DateFormat.DATETIME) : ''
    case DateTypeEnum.DATE:
      return toDateStr(dateStr, utcOffsetMinute)
    case DateTypeEnum.TIME:
      return toTimeStr(dateStr)
  }
}

const getDatetimeAfter = (dateStr: DateStrType, afterDay: number | undefined, format: DateFormat) => {
  if (TypeUtils.isUndefinedOrNull(dateStr) || TypeUtils.isUndefinedOrNull(afterDay)) {
    return undefined
  }
  const day = dayjs(dateStr)
  if (!day.isValid()) {
    return undefined
  }
  return day.add(afterDay, 'day').format(format)
}

const getDatetimeBefore = (dateStr: DateStrType, beforeDay: number | undefined, format: DateFormat) => {
  return getDatetimeAfter(dateStr, beforeDay ? beforeDay * -1 : undefined, format)
}

const getDatetimeSecondAfter = (dateStr: DateStrType, afterDay: number | undefined) => {
  return getDatetimeAfter(dateStr, afterDay, DateFormat.DATETIME_SECOND)
}

const getDatetimeSecondBefore = (dateStr: DateStrType, beforeDay: number | undefined) => {
  return getDatetimeBefore(dateStr, beforeDay, DateFormat.DATETIME_SECOND)
}

const getDatetimeSecondAfterForDisplay = (
  dateType: DateTypeEnum,
  dateStr: string | undefined,
  afterDay: number | undefined
) => {
  return toDateStrForDisplay(dateType, getDatetimeSecondAfter(dateStr, afterDay))
}

const getDatetimeSecondBeforeForDisplay = (
  dateType: DateTypeEnum,
  dateStr: string | undefined,
  afterDay: number | undefined
) => {
  return toDateStrForDisplay(dateType, getDatetimeSecondBefore(dateStr, afterDay))
}

/**
 * 입력 받은 초를 분:초로 변경
 */
const formatMinSec = (seconds: number, locale: LocaleEnum) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const remainingSecondsStr = remainingSeconds.toString().padStart(2, '0')

  if (locale === LocaleEnum.Korean) {
    return `${minutes}분 ${remainingSecondsStr}초`
  }

  if (locale === LocaleEnum.Arabic_SaudiArabia) {
    return `${minutes}m ${remainingSecondsStr}s`
  }

  return `${minutes}:${remainingSecondsStr}`
}

const removeSeconds = (timeString?: string | null) => {
  if (!timeString) {
    return ''
  }
  return timeString?.substring(0, 5)
}

const formatDate = (date: DateStrType, format: string, locale: LocaleEnum = LocaleEnum.Korean) => {
  const dayjsLocale = locale === LocaleEnum.Arabic_SaudiArabia ? 'ar-SA' : 'ko'
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

  if (locale === LocaleEnum.Korean) {
    return `${isAm ? '오전' : '오후'} ${hours}시 ${minutes}분`
  }

  return `${isAm ? 'AM' : 'PM'} ${hours}:${minutes}`
}

const getDateString = (
  date?: Date | string | number | null,
  format: string | DateFormatForDisplay = DateFormatForDisplay.DATE
) => {
  if (!date) return
  return `${dayjs(date).format(format)}`
}

const getRangeDateString = (
  start?: Date | string,
  end?: Date,
  format: string | DateFormatForDisplay = DateFormatForDisplay.DATE
) => {
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

const now = (
  format: DateFormat = DateFormat.DATETIME_SECOND,
  utcOffsetMinute = defaultUtcOffsetMinute,
  keepLocalTime = true
) => {
  return dayjs().utc(keepLocalTime).utcOffset(utcOffsetMinute).format(format)
}

const currentTimestampMs = () => {
  return dayjs().valueOf()
}

/**
 * UTC Offset 문자열을 분으로 변경
 * @param utcOffsetString '+HH:mm' or '-HH:mm'
 * @return 분으로 변경된 offset 값
 */
const toUtcOffsetMinute = (utcOffsetString?: string) => {
  if (!utcOffsetString) {
    return 0
  }
  const sign = utcOffsetString[0] === '-' ? -1 : 1
  const [hour, minute] = utcOffsetString.slice(1).split(':')
  return sign * (Math.abs(parseInt(hour)) * 60 + parseInt(minute))
}

/**
 * UTC Offset 분(minute) 값을 문자열로 변경
 * @param utcOffsetMinute UTC Offset 분(minute) 값
 * @returns '+HH:mm' or '-HH:mm'
 */
const toUtcOffsetString = (utcOffsetMinute?: number) => {
  if (!utcOffsetMinute) {
    return '+00:00'
  }
  const sign = utcOffsetMinute < 0 ? '-' : '+'
  const hour = Math.abs(Math.floor(utcOffsetMinute / 60))
  const minute = Math.abs(utcOffsetMinute % 60)
  return `${sign}${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

/**
 * UTC 시간을 기준으로 날짜 문자열을 반환
 * @param date 날짜
 * @param utcOffset UTC Offset
 * @param format 날짜 포맷
 * @returns 날짜 문자열
 */
const getUtcDateString = (
  date?: DateStrType,
  utcOffset = 0,
  format: string | DateFormatForDisplay = DateFormatForDisplay.DATE
) => {
  if (!date) return
  return `${dayjs(date).utcOffset(utcOffset).format(format)}`
}

/**
 * 현재 시간과 입력받은 시간의 차이를 초로 반환
 * @param targetDate
 * @param utcOffsetMinute
 */
const getTimeDiffMsFromNow = (targetDate: Date | dayjs.Dayjs | string, utcOffsetMinute = 0): number => {
  const now = dayjs().utcOffset(utcOffsetMinute)
  const targetDateTime = dayjs(targetDate).utcOffset(utcOffsetMinute)
  return now.diff(targetDateTime, 'millisecond')
}

/**
 * date 문자열의 마지막에 UTC Offset 문자열을 추가
 * @param dateStr
 * @param utcOffset UTC Offset 분(minute) 값
 * @returns UTC offset 이 포함된 날짜 문자열 or undefined
 * @example
 * ```typescript
 * appendUtcOffset('2024-01-01', 540) // '2024-01-01+09:00'
 * ```
 */
const appendUtcOffset = (dateStr: string | undefined, utcOffset?: number) => {
  if (!dateStr || utcOffset === undefined) {
    return dateStr
  }
  return `${dateStr}${toUtcOffsetString(utcOffset)}`
}

const getSpecificTime = (hour: number, minute: number, second: number, format = DateFormat.TIME_SECOND) => {
  return dayjs().hour(hour).minute(minute).second(second).format(format)
}

export const DateUtils = {
  appendUtcOffset,
  currentTimestampMs,
  formatDate,
  formatHourMin,
  formatMinSec,
  getDateString,
  getDatetimeAfter,
  getDatetimeBefore,
  getDatetimeSecondAfter,
  getDatetimeSecondAfterForDisplay,
  getDatetimeSecondBefore,
  getDatetimeSecondBeforeForDisplay,
  getRangeDateString,
  getTimeDiffMsFromNow,
  getUtcDateString,
  now,
  removeSeconds,
  toDateDotTimeStr,
  toDateStr,
  toDateStrForDisplay,
  toDatetimeSecondStr,
  toDatetimeStr,
  toUtcOffsetMinute,
  toUtcOffsetString,
  toDatetimeSecondUtcOffsetStr,
  getSpecificTime
}
