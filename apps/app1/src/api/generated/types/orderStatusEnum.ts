/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

/**
 * * `CANCELED` - 주문 취소
 * `CHECKING` - 주문 확인 중
 * `DELIVERED` - 배달 완료
 * `DELIVERING` - 배달 중
 * `ERROR` - 오류
 * `PREPARING` - 메뉴 준비 중
 * `READY` - 주문 대기
 * `REQUEST_CANCEL` - 주문 취소 요청
 */
export type OrderStatusEnum = (typeof OrderStatusEnum)[keyof typeof OrderStatusEnum]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const OrderStatusEnum = {
  CANCELED: 'CANCELED',
  CHECKING: 'CHECKING',
  DELIVERED: 'DELIVERED',
  DELIVERING: 'DELIVERING',
  ERROR: 'ERROR',
  PREPARING: 'PREPARING',
  READY: 'READY',
  REQUEST_CANCEL: 'REQUEST_CANCEL'
} as const