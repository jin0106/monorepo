import { Regex } from '@/constants/regex'

const extractNumbers = (phoneNumberString: string) => {
  return phoneNumberString.replace(Regex.ArabicNumberOnly, '')
}
const regulateFormat = (phoneNumberString: string) => {
  const numberOnly = extractNumbers(phoneNumberString)
  if (numberOnly.length <= 11) {
    return numberOnly.replace(Regex.PhoneNumber, '$1-$2-$3').replace(/(-{1,2})$/g, '')
  } else {
    return numberOnly.replace(Regex.VirtualPhoneNumber, '$1-$2-$3').replace(/(-{1,2})$/g, '')
  }
}

export const PhoneNumberUtils = {
  extractNumbers,
  regulateFormat
}
