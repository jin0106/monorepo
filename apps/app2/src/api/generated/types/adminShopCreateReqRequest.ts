/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { AdminShopCreateReqRequestAddress } from './adminShopCreateReqRequestAddress'

export interface AdminShopCreateReqRequest {
  /** 사이트 PK */
  site: number
  /** 이름 */
  name: string
  /** 전화 번호 */
  telephoneNumber: string
  /** 대표자 이름 */
  representativeName?: string | null
  /** 사업자 등록 번호 */
  businessRegistrationNumber: string
  /** 주소 */
  address: AdminShopCreateReqRequestAddress
  /** 뉴비고 노드 고유 번호 */
  neubieGoNodeNumber: string
  /** 개점 시간 */
  openAt?: string | null
  /** 마지막 주문 시간 */
  lastOrderAt?: string | null
  /** 휴식 시작 시간 */
  breakStartAt?: string | null
  /** 휴식 종료 시간 */
  breakEndAt?: string | null
  /** 최소 주문 금액 */
  minOrderPrice: number
  /** 플랫폼 수수료 */
  platformFee: number
  /** 배달비 */
  deliveryUnitPrice: number
  /** 상점 공지 사항 */
  announce?: string | null
  /** 정산 관리자 이름 */
  accountManagerName: string
  /** 정산 관리자 핸드폰 번호 */
  accountManagerMobileNumber: string
  /** 메인 이미지 */
  mainImage?: Blob
  /** 개점 여부 */
  isOpen?: boolean
  /** 원산지 표시 */
  originLabel?: string | null
}