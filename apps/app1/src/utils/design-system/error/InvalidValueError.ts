class InvalidValueError extends Error {
  constructor(value: any) {
    super(`Invalid value. value: ${value}`)
  }
}

export default InvalidValueError
