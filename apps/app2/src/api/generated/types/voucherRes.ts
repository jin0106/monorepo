/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { CountryRes } from './countryRes'

export interface VoucherRes {
  readonly id: number
  country: CountryRes
  /** 바우처로 교환할 수 있는 액수 */
  value: number
  /** 생성일시 */
  readonly createdAt: string | null
  /** 수정일시 */
  readonly updatedAt: string | null
  /** 바우처 코드 */
  voucherCode: string
  /** 바우처를 사용해 포인트로 교환했는지 여부 */
  isUsed?: boolean
  /** 사용 시각 */
  usedAt?: string | null
  /** 상점 주인에 의해 활성화 되었는지 여부 */
  isActivated?: boolean
  /** 상점 주인에 의해 바우처가 활성화된 시각 */
  activatedAt?: string | null
  /** 만료 시각 */
  expiresAt?: string | null
  /** 바우처가 활성화된 상점 */
  shop?: number | null
}
