import { AxiosError } from 'axios'

type LoginErrorDataType = {
  detail: string
}

export type LoginErrorType = AxiosError<LoginErrorDataType>
