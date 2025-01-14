/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

export interface AdminShopEventRes {
  readonly id: number
  /** 생성일시 */
  readonly createdAt: string | null
  /** 수정일시 */
  readonly updatedAt: string | null
  /** 시작일시 */
  startedAt?: string | null
  /** 종료일시 */
  endedAt?: string | null
  /** 이벤트 이름 */
  name: string
  /** 이벤트 비고 */
  description?: string | null
  /** 메인 이미지 */
  mainImage?: string | null
  /** 상점 */
  shop?: number | null
}