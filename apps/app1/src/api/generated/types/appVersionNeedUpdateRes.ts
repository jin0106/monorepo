/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

export interface AppVersionNeedUpdateRes {
  /** 최신 버전 */
  latestVersion?: string
  /** 업데이트 필요 여부 */
  needUpdate: boolean
  /** 강제 업데이트 필요 여부 */
  needForceUpdate: boolean
}
