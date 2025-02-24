/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { UserTypeEnum } from './userTypeEnum'

export interface UserRes {
  readonly id: number
  /** 로그인 이름 */
  readonly username: string
  email?: string
  /** 유저 타입

* `ADMIN` - 어드민
* `SHOP_ADMIN` - 상점 어드민
* `SITE_ADMIN` - 사이트 어드민
* `USER` - 일반 유저 */
  userType?: UserTypeEnum
  /** 사용자 이름 */
  name?: string | null
  dateJoined?: string
  readonly userShops: number[]
  userSites: number[]
  readonly userCompanies: number[]
}
