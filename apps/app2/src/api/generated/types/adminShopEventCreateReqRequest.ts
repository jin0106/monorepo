/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

export interface AdminShopEventCreateReqRequest {
  /** 샵 PK */
  shop: number
  /** 시작일시 */
  startedAt?: string | null
  /** 종료일시 */
  endedAt?: string | null
  /** 이벤트 이름 */
  name: string
  /** 이벤트 비고 */
  description?: string | null
  /** 메인 이미지 */
  mainImage?: Blob | null
}