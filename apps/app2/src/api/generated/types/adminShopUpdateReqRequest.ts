/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { AdminShopUpdateReqRequestAddress } from './adminShopUpdateReqRequestAddress'

export interface AdminShopUpdateReqRequest {
  /** 이름 */
  name?: string | null
  /** 전화번호 */
  telephoneNumber?: string | null
  /** 대표자 이름 */
  representativeName?: string | null
  /** 사업자 등록 번호 */
  businessRegistrationNumber?: string | null
  /** 주소 */
  address?: AdminShopUpdateReqRequestAddress
  /** 뉴비 고 노드 고유 번호 */
  neubieGoNodeNumber?: string | null
  /** 개점 시간 */
  openAt?: string | null
  /** 마지막 주문 시간 */
  lastOrderAt?: string | null
  /** 휴식 시작 시간 */
  breakStartAt?: string | null
  /** 휴식 종료 시간 */
  breakEndAt?: string | null
  /** 최소 주문 금액 */
  minOrderPrice?: number
  /** 플랫폼 수수료 비율 */
  platformFee?: number
  /** 배달비 */
  deliveryUnitPrice?: number
  /** 상점 공지 사항 */
  announce?: string | null
  /** 정산 담당자 이름 */
  accountManagerName?: string | null
  /** 정산 담당자 핸드폰 번호 */
  accountManagerMobileNumber?: string | null
  /** 메인 이미지 */
  mainImage?: Blob
  /** 개점 여부 */
  isOpen?: boolean
  /** 원산지 표시 */
  originLabel?: string | null
}
