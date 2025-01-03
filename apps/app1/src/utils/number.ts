export const numberWithCommas = (num = 0): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const isNumber = (value: number | null | undefined) => {
  return !(value === null || value === undefined)
}

export const NumberUtils = {
  isNumber,
  numberWithCommas
}
