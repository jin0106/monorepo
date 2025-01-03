import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { createContainer } from 'unstated-next'
import { useLoginCreate, useLogoutCreate, useUsersInfoRetrieve } from '@/api/generated/hooks'
import {
  AdminLoginReqRequest,
  AdminLoginRes,
  AdminTokenRefreshRes,
  DeliveryTypeEnum,
  UserTypeEnum
} from '@/api/generated/types'
import { AdminTokenRefreshUri, QueryStatusEnum } from '@/api/mutator/custom-instance'
import { LocalStorageKeyEnum } from '@/constants/localStorageKey.enum'
import { Routes } from '@/constants/routes'
import { isInApp } from '@/pages/_app'
import { LoginErrorType } from '@/types/LoginErrorType'
import { ApiUtils } from '@/utils/apiUtils'
import { encrypt } from '@/utils/localStorage'

const loginConfirmRequest = () => {
  // accessToken 발급은 쿠키에 저장된 refreshToken으로 하기에 별도 데이터가 없어도 됩니다.
  return axios.post<AdminTokenRefreshRes>(process.env.API_DOMAIN + AdminTokenRefreshUri, undefined, {
    withCredentials: true
  })
}

const useAuthHook = () => {
  const [isLogin, setIsLogin] = useState<boolean>()
  const { replace, pathname } = useRouter()
  const userLoginDataRef = useRef<AdminLoginReqRequest>()

  const { mutate: mutateLogin } = useLoginCreate({
    mutation: {
      onSuccess: (data: AdminLoginRes) => {
        setIsLogin(true)
        if (isInApp() && userLoginDataRef.current) {
          localStorage.setItem(LocalStorageKeyEnum.Username, encrypt(userLoginDataRef.current.username))
          localStorage.setItem(LocalStorageKeyEnum.Password, encrypt(userLoginDataRef.current.password))
        }
        localStorage.setItem(LocalStorageKeyEnum.UserAuth, 'true')
        localStorage.setItem(LocalStorageKeyEnum.AdminAccessToken, data?.accessToken)
        refetchAdminInfo().then((result) => {
          replace(Routes.Order.List)
        })
      },
      onError: (error: LoginErrorType) => {
        if (error.response?.status === 401) {
          if (isInApp()) {
            localStorage.removeItem(LocalStorageKeyEnum.Username)
            localStorage.removeItem(LocalStorageKeyEnum.Password)
          }
          ApiUtils.onErrorAlert(error, '아이디와 비밀번호를 확인해주세요.') // todo 이 부분은 i18n 처리 안하는지 확인
        } else {
          ApiUtils.onErrorAlert(error)
        }
      }
    }
  })
  const { mutate: mutateLogout } = useLogoutCreate({
    mutation: {
      onMutate: () => {
        setIsLogin(false)
        if (isInApp()) {
          localStorage.removeItem(LocalStorageKeyEnum.Username)
          localStorage.removeItem(LocalStorageKeyEnum.Password)
        }
        localStorage.removeItem(LocalStorageKeyEnum.UserAuth)
        localStorage.removeItem(LocalStorageKeyEnum.AdminAccessToken)
        replace(Routes.Login)
      }
    }
  })
  const { data: tokenRes, status: isLoginStatus } = useQuery({
    queryKey: [AdminTokenRefreshUri],
    queryFn: loginConfirmRequest,
    retry: 0,
    cacheTime: 0
  })

  useEffect(() => {
    if (isLoginStatus === QueryStatusEnum.Success) {
      localStorage.setItem(LocalStorageKeyEnum.AdminAccessToken, tokenRes.data.accessToken)
      setIsLogin(true)
      return
    }
    if (isLoginStatus === QueryStatusEnum.Loading) {
      setIsLogin(undefined)
      return
    }
    if (isLoginStatus === QueryStatusEnum.Error) {
      localStorage.removeItem(LocalStorageKeyEnum.AdminAccessToken)
      setIsLogin(false)
      return
    }
  }, [isLoginStatus, tokenRes])

  const login = (username: string, password: string) => {
    userLoginDataRef.current = { username, password }
    mutateLogin({ data: { username, password } })
  }
  const logout = (deviceNumber?: string) => {
    mutateLogout({ data: { deviceNumber } })
  }

  useEffect(() => {
    if (
      !localStorage.getItem(LocalStorageKeyEnum.UserAuth) &&
      pathname !== Routes.Login &&
      pathname !== Routes.Policy
    ) {
      replace(Routes.Login)
      return
    }
  }, [pathname])

  // 관리자 정보 조회
  const { data: adminInfo, refetch: refetchAdminInfo } = useUsersInfoRetrieve()

  // 권한이 없는 페이지 접근시 home으로 replace
  const rejectPagesByUserType = {
    [UserTypeEnum.SHOP_ADMIN]: [Routes.Shop.Register, Routes.Member, Routes.Order.Manual],
    [UserTypeEnum.SITE_ADMIN]: [Routes.Member],
    [UserTypeEnum.ADMIN]: undefined,
    [UserTypeEnum.USER]: undefined
  }
  useEffect(() => {
    if (!adminInfo?.userType) return
    const rejectPages = rejectPagesByUserType[adminInfo?.userType]
    if (rejectPages?.includes(pathname)) {
      replace(Routes.Home)
      return
    }
  }, [adminInfo, pathname])

  const hasDocumentPermission = () => {
    if (adminInfo?.userType !== UserTypeEnum.SITE_ADMIN && adminInfo?.userType !== UserTypeEnum.SHOP_ADMIN) {
      return true
    }
    return adminInfo?.userSites?.find((site) => {
      return site?.deliveryTypes?.find((type) => type === DeliveryTypeEnum.DOCUMENT)
    })
  }

  return {
    isLogin,
    login,
    logout,
    adminInfo,
    hasDocumentPermission
  }
}

const AuthContainer = createContainer(useAuthHook)

export default AuthContainer
