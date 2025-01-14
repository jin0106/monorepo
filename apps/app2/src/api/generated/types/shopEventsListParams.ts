/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { ShopEventsListOrderByItem } from './shopEventsListOrderByItem'

export type ShopEventsListParams = {
  createdAtAfter?: string
  createdAtBefore?: string
  endedAtAfter?: string
  endedAtBefore?: string
  /**
   * Number of results to return per page.
   */
  limit?: number
  /**
   * 이름
   */
  name?: string
  /**
   * The initial index from which to return the results.
   */
  offset?: number
  /**
 * 순서

* `id` - Id
* `-id` - Id (descending)
* `name` - Name
* `-name` - Name (descending)
* `created_at` - Created at
* `-created_at` - Created at (descending)
* `started_at` - Started at
* `-started_at` - Started at (descending)
* `ended_at` - Ended at
* `-ended_at` - Ended at (descending)
 */
  orderBy?: ShopEventsListOrderByItem[]
  /**
   * 샵 PK 리스트, 콤마 사용
   */
  shops?: number[]
  startedAtAfter?: string
  startedAtBefore?: string
}
