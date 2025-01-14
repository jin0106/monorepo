/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

/**
 * * `APPROVED` - 승인
 * `DELETED` - 삭제
 * `REJECTED` - 반려
 * `REQUEST` - 요청
 * `SUSPENDED` - 중지
 */
export type ShopStatusEnum = (typeof ShopStatusEnum)[keyof typeof ShopStatusEnum]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ShopStatusEnum = {
  APPROVED: 'APPROVED',
  DELETED: 'DELETED',
  REJECTED: 'REJECTED',
  REQUEST: 'REQUEST',
  SUSPENDED: 'SUSPENDED'
} as const