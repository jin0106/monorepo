import { isAndroid, isIOS, isSamsungBrowser } from 'react-device-detect'

const isMobile = () => isIOS || isAndroid || isSamsungBrowser
const isServer = () => typeof window === 'undefined'

const EnvUtils = {
  isMobile,
  isServer
}

export default EnvUtils
