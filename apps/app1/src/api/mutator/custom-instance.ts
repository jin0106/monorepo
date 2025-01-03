import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import Router from 'next/router'
import { CamelCase } from 'type-fest'
import { LocalStorageKeyEnum } from '@/constants/localStorageKey.enum'
import { Routes } from '@/constants/routes'
import { isServer } from '@/pages/_app'

export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.API_DOMAIN }) // use your own URL here or environment variable

export enum QueryStatusEnum {
  Error = 'error',
  Loading = 'loading',
  Success = 'success'
}

export const AdminTokenRefreshUri = '/admin/token/refresh/'
const refreshToken = async () => {
  const response = await fetch(process.env.API_DOMAIN + AdminTokenRefreshUri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })

  const data = await response.json()
  if (data?.accessToken) {
    localStorage.setItem(LocalStorageKeyEnum.AdminAccessToken, data.accessToken)
  }
  return response.ok
}

export const getAccessToken = () => {
  if (isServer) {
    return
  }
  return localStorage.getItem(LocalStorageKeyEnum.AdminAccessToken)
}

// Todo:: muti form-part contentType으로 전송하는 경우 body에 배열값이 있다면 serialization이 되지 않습니다. custom-form-data를 수정해야합니다.
export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const accessToken = getAccessToken()
  const source = Axios.CancelToken.source()

  const promise = AXIOS_INSTANCE({
    ...options,
    ...config,
    cancelToken: source.token,
    withCredentials: true,
    formSerializer: {
      dots: true
    },
    headers: {
      ...config?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    },
    paramsSerializer: (params) => {
      const searchParams = new URLSearchParams()
      for (const key of Object.keys(params)) {
        const param = params[key]
        if (Array.isArray(param)) {
          searchParams.append(key, param.join(','))
        } else {
          searchParams.append(key, param)
        }
      }
      return searchParams.toString()
    }
  }).then(({ data }) => data)

  return promise
}

AXIOS_INSTANCE.interceptors.response.use(
  function (response) {
    return response
  },
  async (error) => {
    if (error.response.status === 403) {
      // 200 번대 가 아니면 에러 catch refresh token 유효하지 않으면 로그인 유도
      try {
        const res = await refreshToken()
        if (!res) {
          Router.replace({
            pathname: Routes.Login
          })
        }
      } catch (error) {
        Router.replace({
          pathname: Routes.Login
        })
      }
    }
    return Promise.reject(error)
  }
)

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>
// In case you want to wrap the body type (optional)
// (if the custom instance is processing data before sending it, like changing the case for example)
export type BodyType<BodyData> = CamelCase<BodyData>
