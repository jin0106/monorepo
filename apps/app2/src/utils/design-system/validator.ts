import DataUtils from '@/utils/design-system/dataUtils'
import { NumberUtils } from '@/utils/design-system/numberUtils'

const PASSWORD_POLICY_ALLOWED_SPECIAL_CHARACTERS = [
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  '[',
  '₩',
  ']',
  '^',
  '_',
  '`',
  '{',
  '|',
  '}',
  '~'
]

const specialCharacters = PASSWORD_POLICY_ALLOWED_SPECIAL_CHARACTERS.map((char) => `\\${char}`).join('')
const passwordRegex = new RegExp(
  `^(?=.{8,})(?:(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)|(?=.*[a-z])(?=.*[A-Z])(?=.*[${specialCharacters}])|(?=.*[a-z])(?=.*\\d)(?=.*[${specialCharacters}])|(?=.*[A-Z])(?=.*\\d)(?=.*[${specialCharacters}])).*$`
)

export const Regex = {
  email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  mobileNumber: /^01([016789])-?(\d{3,4})-?(\d{4})$/,
  password: passwordRegex,
  coordinate: /^(-)?(\d{0,3})(.\d{1, 8})?/,
  fileName: /[<>:*"/\\?|]/,
  emoji: new RegExp(
    '[' +
      '\u{1F1E0}-\u{1F1FF}' + // flags (iOS)
      '\u{1F300}-\u{1F5FF}' + // symbols & pictographs
      '\u{1F600}-\u{1F64F}' + // emoticons
      '\u{1F680}-\u{1F6FF}' + // transport & map symbols
      '\u{1F700}-\u{1F77F}' + // alchemical symbols
      '\u{1F780}-\u{1F7FF}' + // Geometric Shapes Extended
      '\u{1F800}-\u{1F8FF}' + // Supplemental Arrows-C
      '\u{1F900}-\u{1F9FF}' + // Supplemental Symbols and Pictographs
      '\u{1FA00}-\u{1FA6F}' + // Chess Symbols
      '\u{1FA70}-\u{1FAFF}' + // Symbols and Pictographs Extended-A
      '\u{2702}-\u{27B0}' + // Dingbats
      ']+',
    'u'
  )
} as const

const validateEmail = (value: string, errorText: string) => {
  return Regex.email.test(value) ? true : errorText
}

const validateMobileNumber = (value: string, errorText: string) => {
  return Regex.mobileNumber.test(value) ? true : errorText
}

const validateIsEmpty = (value: any, errorText: string | false = false) => {
  return DataUtils.isEmpty(value) ? errorText : true
}

const validateMaxLength = (value: string, maxLength: number, errorText: string | false = false) => {
  return value.length > maxLength ? errorText : true
}

const validateFileName = (value: string, errorText: string | false = false) => {
  return Regex.fileName.test(value) || Regex.emoji.test(value) ? errorText : true
}

const validatePassword = (value: string, errorText: string | false = false) => {
  return Regex.password.test(value) ? true : errorText
}

const validateCoordinate = (
  value: number | undefined | null,
  integerPartMin: number,
  integerPartMax: number,
  decimalPartLengthMin: number,
  decimalPartLengthMax: number,
  errorText: string | false = false
) => {
  const valueStr = String(value)
  if (value === undefined || value === null || !Regex.coordinate.test(valueStr)) {
    return errorText
  }
  const integerPart = Math.trunc(value)
  if (!NumberUtils.isNumber(integerPart) || integerPart < integerPartMin || integerPart > integerPartMax) {
    return errorText
  }
  const indexOfDot = valueStr.indexOf('.')
  if (indexOfDot > 0) {
    const decimalPart = valueStr.slice(indexOfDot + 1)
    if (
      !NumberUtils.isNumber(Number(decimalPart)) ||
      decimalPart.length < decimalPartLengthMin ||
      decimalPart.length > decimalPartLengthMax
    ) {
      return errorText
    }
  }
  return true
}

const validateLatitude = (value: number | undefined | null, errorText: string | false = false) => {
  return validateCoordinate(value, -90, 90, 0, 8, errorText)
}

const validateLongitude = (value: number | undefined | null, errorText: string | false = false) => {
  return validateCoordinate(value, -180, 180, 0, 8, errorText)
}

const validateRange = (value: number, min: number, max: number, errorText: string | false = false) => {
  return min <= value && value <= max ? true : errorText
}

const validateNumber = (value: string | number | undefined | null, errorText: string | false = false) => {
  const isNumeric = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return errorText
    if (typeof value === 'string') return errorText
    return !isNaN(value)
  }
  // 숫자로 변환될수 없는 값이면 false
  if (!isNumeric(value)) return errorText
  return Number(value) !== 0
}

const validateUnitCount = (value: number | undefined | null | string): value is number | string => {
  const newValue = Number(value)
  if (newValue === 0) return true
  if (!validateNumber(newValue)) return false
  if (newValue !== 0 && newValue < 1) return false
  return true
}

const validateImageWidthHeight = (
  file: Blob,
  maxWidth: number,
  maxHeight: number,
  errorText: string | false = false
) => {
  return new Promise<boolean | string>((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve(errorText)
      } else {
        resolve(true)
      }
    }
  })
}

const validateFileSize = (file: File | Blob, size: number, errorText: string | false = false) => {
  return file.size <= size ? true : errorText
}

const validateFileType = (file: File | Blob | undefined, accepts: string, errorText: string | false = false) => {
  return !!file && accepts.replaceAll(' ', '').split(',').includes(file.type) ? true : errorText
}

export const Validator = {
  validateFileName,
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validateIsEmpty,
  validateMaxLength,
  validateLatitude,
  validateLongitude,
  validateRange,
  validateNumber,
  validateUnitCount,
  validateImageWidthHeight,
  validateFileType,
  validateFileSize
}
