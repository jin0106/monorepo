/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { DeviceTypeEnum } from './deviceTypeEnum'

export interface DevicePushTokenReqRequest {
  /** 기기 종류, IOS(iOS), ANDROID(안드로이드)

* `IOS` - iOS
* `ANDROID` - ANDROID */
  deviceType?: DeviceTypeEnum
  /** 기기 고유 번호 */
  deviceNumber: string
  /** 푸쉬 토큰 */
  pushToken: string
  /** 앱 버전 */
  appVersion?: string | null
}