/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

export interface AdminAddressRes {
  readonly id: number
  /** 우편번호 */
  postNumber?: string | null
  /** 기본 주소 */
  basicAddress?: string | null
  /** 상세 주소 */
  detailAddress?: string | null
}
