/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

export interface AdminOrderDrivingLogReqRequest {
  startDate: string
  endDate: string
  site: number
  /** 취소 주문건 포함 여부 */
  includeCancel?: boolean
}
