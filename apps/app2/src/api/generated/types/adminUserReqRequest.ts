/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { UserTypeEnum } from './userTypeEnum'

export interface AdminUserReqRequest {
  /** 로그인 이름 */
  username: string
  password: string
  /** 핸드폰 번호 */
  mobileNumber?: string | null
  email?: string
  /** 사용자 이름 */
  name?: string | null
  /** 유저 타입

* `ADMIN` - 어드민
* `SHOP_ADMIN` - 상점 어드민
* `SITE_ADMIN` - 사이트 어드민
* `USER` - 일반 유저 */
  userType?: UserTypeEnum
  /** 회사 PK */
  userCompanies?: (number | null)[]
  /** 사이트 PK */
  userSites?: (number | null)[]
  /** 샵 PK */
  userShops?: (number | null)[]
}
