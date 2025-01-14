/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { DeviceTypeEnum } from './deviceTypeEnum'

export interface AppVersionReqRequest {
  /** 이름 */
  name: string
  /** 기기 종류, IOS(iOS), ANDROID(안드로이드)

* `IOS` - iOS
* `ANDROID` - ANDROID */
  deviceType?: DeviceTypeEnum
  /** 팩키지명 */
  packageName: string
  /** 최신 버전 */
  latestVersion?: string
  /** 최소 버전 */
  minimumVersion?: string
}
