import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { isAndroid, isIOS } from 'react-device-detect'
import { createContainer } from 'unstated-next'
import { useDevicesPushTokenUpdate } from '@/api/generated/hooks'
import { DevicePushTokenReqRequest } from '@/api/generated/types'
import { SocialLoginTypeEnum } from '@/constants/socialLoginTypeEnum'
import AuthContainer from '@/containers/common/AuthContainer'
import { NativeEventPayloadType } from '@/utils/native-bridge'
import NativeBridgeAction from '@/utils/native-bridge/NativeBridgeAction'
import NativeBridgeCallbackEventManager from '@/utils/native-bridge/NativeBridgeCallbackEventManager'
import NativeBridgeEventManager, { NativeEventEnum } from '@/utils/native-bridge/NativeBridgeEventManager'

export enum PushTypeEnum {
  AdminOrderAccept = 'ADMIN_ORDER_ACCEPT',
  AdminOrderCanceled = 'ADMIN_ORDER_CANCELED',
  OrderDeliveryStart = 'ORDER_DELIVERY_START',
  DeliveryArrived = 'DELIVERY_ARRIVED',
  CoverStillOpen = 'COVER_STILL_OPEN',
  OrderCanceled = 'ORDER_CANCELED'
}

export type PushDataType = Record<string, unknown> & {
  url: string
  site: string
  pushType: PushTypeEnum
}

export type SocialLoginDataType = Record<string, unknown> & {
  /**
   * SocialLoginType
   */
  socialLoginType: Extract<SocialLoginTypeEnum, 'GOOGLE' | 'APPLE'>
  /**
   * Android: serverAuthCode
   * iOS: code
   */
  code: string
  email?: string
  id?: string
  username?: string
}

export enum RoutingTypeEnum {
  Push = 'Push',
  Replace = 'Replace'
}

export type RoutingDataType = {
  url: string
  routingType: RoutingTypeEnum
}

export const nativeBridgeSetup = () => {
  const nativeCallbackEventManager = NativeBridgeCallbackEventManager()
  window.handleNativeCallbackEvent = nativeCallbackEventManager.handleNativeCallbackEvent
  window.nativeCallbackEventManager = nativeCallbackEventManager

  window.backKeyManager = NativeBridgeEventManager(NativeEventEnum.BackKey)
  window.foregroundManager = NativeBridgeEventManager(NativeEventEnum.Foreground)
  window.pushTokenManager = NativeBridgeEventManager(NativeEventEnum.PushToken)
  window.pushNotificationManager = NativeBridgeEventManager(NativeEventEnum.PushNotification)
  window.pushClickManager = NativeBridgeEventManager(NativeEventEnum.PushClick)
  window.socialLoginManager = NativeBridgeEventManager(NativeEventEnum.SocialLogin)
  window.routingManager = NativeBridgeEventManager(NativeEventEnum.Routing)
}

const KEY_DEFAULT = 'key_default'

const useNativeBridge = () => {
  const { isLogin } = AuthContainer.useContainer()
  const [isInitialized, setIsInitialized] = useState(false)
  const { push, replace } = useRouter()
  const [pushData, setPushData] = useState<PushDataType>()
  const [pushToken, setPushToken] = useState<DevicePushTokenReqRequest>()

  const { mutateAsync: updatePushToken } = useDevicesPushTokenUpdate({
    mutation: {
      onSuccess: (data) => {
        console.log(data, 'create Token Success')
      },
      onError: (error) => console.log('ERR:: updatePushToken', error)
    }
  })

  /**
   * isLogin true, pushToken이 있으면 토큰을 보내주면
   * 1. 앱 시작시 로그인 되면 pushToken 갱신
   * 2. 로그아웃 상태 -> 로그인 후 pushToken 갱신
   * 3. 로그인 상태에서 앱에서 pushToken이 갱신이 되면 pushToken 갱신 상황이 이뤄집니다.
   */
  useEffect(() => {
    console.log(`useNativeBridge, isLogin`, isLogin, 'pushToken', pushToken)
    if (isLogin && pushToken) {
      updatePushToken({ data: pushToken })
    }
  }, [isLogin, pushToken])

  /**
   * Android, backKey 핸들링을 App에서 하지 않고, Web에서 처리 함
   */
  const addBackKeyHandler = (key: string, onBackKeyPress: () => boolean | undefined) => {
    if (!window.backKeyManager) {
      return false
    }

    const enableBackKeyHandlingByWeb = window.backKeyManager.getCallbackFnCount() === 0
    console.log(`addBackKeyHandler, key: ${key}, getCallbackFnCount: ${window.backKeyManager.getCallbackFnCount()}`)
    window.backKeyManager.add(key, onBackKeyPress)
    if (enableBackKeyHandlingByWeb) {
      NativeBridgeAction.changeBackKeyHandling({ enabled: false })
    }
  }

  /**
   * Android, backKey 핸들링을 App에서 처리 하도록 변경
   */
  const removeBackHandler = (key: string) => {
    if (!window.backKeyManager || !window.backKeyManager.has(key)) {
      return false
    }

    const enableBackKeyHandlingByApp = window.backKeyManager.getCallbackFnCount() === 1
    console.log(`removeBackHandler, key: ${key}, getCallbackFnCount: ${window.backKeyManager.getCallbackFnCount()}`)
    if (enableBackKeyHandlingByApp) {
      NativeBridgeAction.changeBackKeyHandling({ enabled: true })
    }
    window.backKeyManager.remove(key)
  }

  const addPushNotificationHandler = (
    key: string,
    onPushMessageReceive: (payload: NativeEventPayloadType<PushDataType>) => void
  ) => {
    window.pushNotificationManager?.add(key, onPushMessageReceive)
  }
  const removePushNotificationHandler = (key: string) => {
    window.pushNotificationManager?.remove(key)
  }

  const addRoutingHandler = (
    key: string,
    onPushMessageReceive: (payload: NativeEventPayloadType<RoutingDataType>) => void
  ) => {
    window.routingManager?.add(key, onPushMessageReceive)
  }
  const removeRoutingHandler = (key: string) => {
    window.routingManager?.remove(key)
  }

  useEffect(() => {
    if (isIOS || isAndroid) {
      window.pushTokenManager.add(KEY_DEFAULT, (payload: NativeEventPayloadType<DevicePushTokenReqRequest>) =>
        setPushToken(payload.data)
      )
      window.pushNotificationManager.add(KEY_DEFAULT, (payload: NativeEventPayloadType<PushDataType>) => {
        console.log(payload, 'pushNotificationManager')
        setPushData(payload.data)
      })
      window.pushClickManager.add(KEY_DEFAULT, (payload: NativeEventPayloadType<PushDataType>) => {
        console.log(payload, 'pushClickManager')
        payload.data.url && push(payload.data.url)
        setPushData(payload.data)
      })
      // not support
      // window.socialLoginManager.add(KEY_DEFAULT, (payload: NativeEventPayloadType<SocialLoginDataType>) => {
      //   const {
      //     data: { socialLoginType, code }
      //   } = payload
      //
      //   console.log('socialLoginManager, payload', payload)
      //
      //   if (socialLoginType === SocialLoginTypeEnum.APPLE) {
      //     loginSocialApple(code)
      //     return
      //   }
      //
      //   if (socialLoginType === SocialLoginTypeEnum.GOOGLE) {
      //     loginSocialGoogle(code)
      //     return
      //   }
      // })
      window.routingManager.add(KEY_DEFAULT, (payload: NativeEventPayloadType<RoutingDataType>) => {
        console.log('routingManager, payload', payload)
        const {
          data: { routingType, url }
        } = payload
        if (routingType === RoutingTypeEnum.Push) {
          push(url)
          return
        }

        if (routingType === RoutingTypeEnum.Replace) {
          replace(url)
          return
        }
      })
      /**
       * init을 보낸 다음에 pushTokenManager를 통해서 토큰을 보냅니다.
       */
      NativeBridgeAction.init().then(() => {
        setIsInitialized(true)
      })
    }

    return () => {
      if (isIOS || isAndroid) {
        NativeBridgeAction.deinit()
        setIsInitialized(false)

        window.pushTokenManager?.remove(KEY_DEFAULT)
        window.pushNotificationManager?.remove(KEY_DEFAULT)
        window.pushClickManager?.remove(KEY_DEFAULT)
      }
    }
  }, [])

  return {
    isInitialized,
    pushNotificationData: pushData,
    addBackKeyHandler,
    removeBackHandler,
    addPushNotificationHandler,
    removePushNotificationHandler,
    addRoutingHandler,
    removeRoutingHandler,
    pushToken
  }
}

const NativeBridgeContainer = createContainer(useNativeBridge)

export default NativeBridgeContainer
