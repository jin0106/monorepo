import { isAndroid, isIOS } from 'react-device-detect'
import { SocialLoginTypeEnum } from '@/constants/socialLoginTypeEnum'
import { isServer } from '@/pages/_app'
import { AppVersion, NativeEventPayloadType } from '@/utils/native-bridge/index'

/**
 * Web -> App
 */
export enum NativeActionEnum {
  /**
   * 초기화 완료
   * 지원 OS: Android, iOS
   */
  Init = 'init',
  /**
   * 지원 OS: Android, iOS
   */
  Deinit = 'deinit',
  /**
   * 이미지를 앨범에 저장 요청
   * 지원 OS: iOS
   */
  SavePhotoAlbum = 'savePhotoAlbum',
  /**
   * 카카오 채널로 이동을 요청
   * 지원 OS: iOS
   */
  GoToKakaoChannel = 'goToKakaoChannel',
  /**
   * 앱 종료 요청
   * 지원 OS: Android, iOS
   */
  FinishApplication = 'finishApplication',
  /**
   * 뒤로가기 버튼의 제어권을 설정
   * 지원 OS: Android
   */
  ChangeBackKeyHandling = 'changeBackKeyHandling',
  /**
   * 앱의 SDK를 이용한 소셜 로그인 요청
   * 지원 OS: Android
   */
  SocialLogin = 'socialLogin',
  /**
   * 현재 위치 요청
   * 지원 OS: Android, iOS
   */
  Location = 'location'
}

const genCallbackName = (action: string) => {
  return `${action}-${new Date().getTime()}`
}

export const webToNative = (action: string, message: string, callbackFnName: string) => {
  try {
    const appVersion = AppVersion
    if (!appVersion) {
      return console.error('ERR:: 앱 버전이 없습니다.')
    }

    if (isIOS) {
      if (!window?.webkit?.messageHandlers?.jsToNative) {
        return console.error('ERR:: iOS, messageHandlers가 없습니다.')
      }

      return window.webkit.messageHandlers.jsToNative.postMessage({
        action,
        version: appVersion,
        message,
        callbackFnName
      })
    }

    if (isAndroid) {
      if (!window?.bridgeHandler) {
        return console.error('ERR:: Android, bridgeHandler가 없습니다.')
      }
      return window.bridgeHandler.requestMessage(action, appVersion, message, callbackFnName)
    }

    return console.error('ERR:: IOS, Andriod Native 환경이 아닙니다.')
  } catch (e) {
    console.error('ERR:: IOS, Andriod, 알수 없는 오류가 발생했습니다.', e)
  }
}

export type ImageExtensionType = 'apng' | 'avif' | 'gif' | 'jpeg' | 'png' | 'svg+xml' | 'webp'
export type Base64ImageType<T extends ImageExtensionType = ImageExtensionType> =
  | `data:image/${T};base64${string}`
  | string

type SavePhotoAlbumType = {
  base64Image: Base64ImageType
}

type KakaoChannelType = {
  channelName: string
}
type BackKeyHandlingType = {
  enabled: boolean
}
type SocialLoginType = {
  socialLoginType: SocialLoginTypeEnum
}
type LocationResultType = {
  /**
   * 위도
   */
  latitude: number
  /**
   * 경도
   */
  longitude: number
  /**
   * 위치정보 수신 시각
   * 형식: Unix Timestamp
   */
  time: number
}

const requestMessage = async <TResponseData extends Record<string, any> = Record<string, unknown>>(
  action: NativeActionEnum,
  data?: object
): Promise<undefined | NativeEventPayloadType<TResponseData>> => {
  if (isServer) return

  try {
    const jsonMessage = JSON.stringify(data ?? {})
    const callbackFnName = genCallbackName(action)
    console.log('jsonMessage', jsonMessage, 'callbackFnName', callbackFnName)
    const promise: Promise<NativeEventPayloadType<TResponseData>> | undefined =
      window.nativeCallbackEventManager.add<TResponseData>(callbackFnName)
    if (!promise) {
      console.error('ERR:: [requestMessage] 이미 등록된 callbackFnName 입니다. callbackFnName', callbackFnName)
      return
    }
    webToNative(action, jsonMessage, callbackFnName)
    return promise
  } catch (e) {
    console.error('ERR:: [requestMessage] 오류가 발생했습니다', e)
  }
  return
}

const NativeBridgeAction = {
  init: async (): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.Init)
  },

  deinit: async (): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.Deinit)
  },

  savePhotoAlbum: async (request: SavePhotoAlbumType): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.SavePhotoAlbum, request)
  },

  goToKakaoChannel: async (request: KakaoChannelType): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.GoToKakaoChannel, request)
  },

  finishApplication: async (): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.FinishApplication)
  },
  changeBackKeyHandling: async (request: BackKeyHandlingType): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.ChangeBackKeyHandling, request)
  },
  socialLogin: async (request: SocialLoginType): Promise<undefined | NativeEventPayloadType> => {
    return requestMessage(NativeActionEnum.SocialLogin, request)
  },
  location: async (): Promise<undefined | NativeEventPayloadType<LocationResultType>> => {
    return requestMessage<LocationResultType>(NativeActionEnum.Location)
  }
}

export default NativeBridgeAction
