/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */

/**
 * * `BASIC` - 자동 주문 사이트
 * `MANUAL` - 수동 주문 사이트
 */
export type SiteTypeEnum = (typeof SiteTypeEnum)[keyof typeof SiteTypeEnum]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SiteTypeEnum = {
  BASIC: 'BASIC',
  MANUAL: 'MANUAL'
} as const
