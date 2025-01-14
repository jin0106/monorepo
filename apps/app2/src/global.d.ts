declare global {
  interface Window {
    AWS: any
    KVSWebRTC: any
    kakao: any
    onLoadGeoMap: () => void

    webkit: {
      messageHandlers: {
        jsToNative: {
          postMessage: ({ action: string, version: string, message: string, callbackFnName: string }) => void
        }
      }
    }
    bridgeHandler: {
      requestMessage: (action: string, version: string, message: string, callbackFnName: string) => void
    }
    // NativeBridgeEventManager
    foregroundManager: {
      add: EventManagerAddType
      remove: (key: string) => void
      has: (key: string) => boolean
      getCallbackFnCount: () => number
    }
    // NativeBridgeEventManager
    pushTokenManager: {
      add: EventManagerAddType
      remove: (key: string) => void
      has: (key: string) => boolean
      getCallbackFnCount: () => number
    }
    // NativeBridgeEventManager
    backKeyManager: {
      add: EventManagerAddType
      remove: (key: string) => void
      has: (key: string) => boolean
      getCallbackFnCount: () => number
    }
    // NativeBridgeEventManager
    pushNotificationManager: {
      add: EventManagerAddType
      remove: (key: string) => void
      has: (key: string) => boolean
      getCallbackFnCount: () => number
    }
    // NativeBridgeEventManager
    pushClickManager: {
      add: EventManagerAddType
      remove: (key: string) => void
      has: (key: string) => boolean
      getCallbackFnCount: () => number
    }
    // NativeBridgeEventManager
    socialLoginManager: {
      add: EventManagerAddType
      remove: (key: string) => void
    }
    // NativeBridgeEventManager
    routingManager: {
      add: EventManagerAddType
      remove: (key: string) => void
    }

    // handleNativeCallbackEvent
    nativeCallbackEventManager: {
      add: CallbackEventManagerAddType
      remove: (key: string) => void
    }

    handleNativeCallbackEvent(key: string, responseJSON: string): void
  }
}

export {}
