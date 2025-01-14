export const Regex = {
  // todo 국내 해외 확인 필요
  PhoneNumber: /^(\d{0,3})(\d{0,4})(\d{0,4})$/g,
  // PhoneNumber: /^01[016789]-\d{4}-\d{4}$/,
  VirtualPhoneNumber: /^(\d{0,4})(\d{0,4})(\d{0,4})$/g,
  ArabicNumberOnly: /[^0-9]/g,
  SeparateThousand: /\B(?=(\d{3})+(?!\d))/g,
  Number: /^\d+$/,
  NumberHyphen: /^[0-9-]+$/
}
