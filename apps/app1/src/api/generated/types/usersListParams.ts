/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { UsersListOrderByItem } from './usersListOrderByItem'
import type { UsersListUserType } from './usersListUserType'

export type UsersListParams = {
  /**
   * Number of results to return per page.
   */
  limit?: number
  /**
   * 휴대폰 번호
   */
  mobileNumber?: string
  /**
   * The initial index from which to return the results.
   */
  offset?: number
  /**
 * 순서

* `id` - Id
* `-id` - Id (descending)
 */
  orderBy?: UsersListOrderByItem[]
  /**
 * 유저 유형

* `ADMIN` - 어드민
* `SHOP_ADMIN` - 상점 어드민
* `SITE_ADMIN` - 사이트 어드민
* `USER` - 일반 유저
 */
  userType?: UsersListUserType
}
