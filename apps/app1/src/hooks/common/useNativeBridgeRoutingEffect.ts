import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NativeBridgeContainer, { PushDataType, RoutingDataType } from '@/containers/common/NativeBridgeContainer'
import { NativeEventPayloadType } from '@/utils/native-bridge'

const getUrlWithoutTrailingSlash = (pathname: string): string => {
  const lastChar = pathname.charAt(pathname.length - 1)
  return lastChar === '/' || lastChar === '\\' ? pathname.substring(0, pathname.length - 1) : pathname
}

const isPathnameEquals = (pathname: string, url: string): boolean => {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://neubility.co.kr${url}`)
    const pathname1 = getUrlWithoutTrailingSlash(pathname)
    const pathname2 = getUrlWithoutTrailingSlash(u.pathname)
    return pathname1 === pathname2
  } catch (e) {
    console.error('ERROR::isPathnameEquals', e)
  }
  return false
}

interface UseNativeBridgeRoutingEffectProps {
  key: string
  onRefreshData: () => void
}

const useNativeBridgeRoutingEffect = ({ key, onRefreshData }: UseNativeBridgeRoutingEffectProps) => {
  const pathname = usePathname() || ''
  const {
    isInitialized,
    addPushNotificationHandler,
    removePushNotificationHandler,
    addRoutingHandler,
    removeRoutingHandler
  } = NativeBridgeContainer.useContainer()

  useEffect(() => {
    if (isInitialized) {
      addPushNotificationHandler(key, (payload: NativeEventPayloadType<PushDataType>) => {
        if (isPathnameEquals(pathname, payload.data.url) || payload.data.url.startsWith(pathname)) {
          onRefreshData()
          return true
        }
      })
      addRoutingHandler(key, (payload: NativeEventPayloadType<RoutingDataType>) => {
        if (isPathnameEquals(pathname, payload.data.url)) {
          onRefreshData()
          return true
        }
      })
    }

    return () => {
      removePushNotificationHandler(key)
      removeRoutingHandler(key)
    }
  }, [isInitialized, pathname])
}

export default useNativeBridgeRoutingEffect
