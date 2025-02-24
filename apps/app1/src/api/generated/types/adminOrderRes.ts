/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { AdminDeliveryRes } from './adminDeliveryRes'
import type { AdminOrderUserResSerializers } from './adminOrderUserResSerializers'
import type { DeliveryStatusC50Enum } from './deliveryStatusC50Enum'
import type { DeliveryTypeEnum } from './deliveryTypeEnum'
import type { OrderStatusEnum } from './orderStatusEnum'
import type { OrderTypeEnum } from './orderTypeEnum'

export interface AdminOrderRes {
  readonly id: number
  /** 총 지불 금액 */
  totalPrice: number
  /** 결제시 사용된 포인트 */
  usedPoint: number
  /** 상품 원가 총합 */
  originalTotalPrice: number
  /** 배송비 총합 */
  deliveryTotalPrice: number
  /** 쿠폰 할인 가격 총합 */
  couponDiscountTotalPrice: number
  /** 가게 정보 */
  readonly shopName: string | null
  /** 주문자 정보 */
  readonly user: AdminOrderUserResSerializers
  siteSlug: string | null
  /** 주문 접수 가능 여부 */
  readonly canAccept: boolean
  /** 뚜껑 개패 가능 여부 */
  readonly canOpenCover: boolean
  /** 배달 출발 가능 여부 */
  readonly canDeliveryStart: boolean
  /** 수동 주문 시 배차 성공 여부 */
  dispatchSuccess?: boolean
  /** 수동 주문 시 배차 메세지 */
  dispatchMessage: string | null
  /** 통화 코드 (KRW, USD, SAR, ...) */
  readonly currency: string
  readonly delivery: AdminDeliveryRes
  /** 보내는 사람 이름 */
  senderName: string | null
  /** 보내는 사람 휴대폰 번호 */
  readonly senderMobileNumber: string | null
  /** 받는 사람 이름 */
  recipientName: string | null
  /** 받는 사람 휴대폰 번호 */
  readonly recipientMobileNumber: string | null
  /** 핸드폰 번호 */
  readonly mobileNumber: string
  /** 간편 배송 여부 */
  readonly isUseSimpleDelivery: boolean
  /** 생성일시 */
  readonly createdAt: string | null
  /** 수정일시 */
  readonly updatedAt: string | null
  /** 주문 타입: BASIC(자동 주문), MANUAL(수동 주문)

* `BASIC` - 자동 주문
* `MANUAL` - 수동 주문 */
  orderType?: OrderTypeEnum
  /** 배달 타입: FOOD(음식), DOCUMENT(문서)

* `DOCUMENT` - 문서
* `FOOD` - 음식 */
  deliveryType?: DeliveryTypeEnum
  /** 주문 고유 번호 */
  orderNumber?: string | null
  /** 관리비로 부과된 주문 금액 */
  maintenanceFeePrice?: number
  /** 시작 노드 고유 번호 */
  startNodeNumber?: string | null
  /** 시작 노드 이름 */
  startNodeName?: string | null
  /** 시작 노드 위도 */
  startLatitude?: number | null
  /** 시작 노드 경도 */
  startLongitude?: number | null
  /** 배송 노드 고유 번호 */
  destinationNodeNumber?: string | null
  /** 배송 노드 이름 */
  destinationNodeName?: string | null
  /** 배송 노드 위도 */
  latitude?: number | null
  /** 배송 노드 경도 */
  longitude?: number | null
  /** 주문 요청 사항 */
  userNote?: string | null
  /** 주문 취소 사유 */
  cancelReason?: string | null
  /** 주문 취소 기록 */
  cancelNote?: string | null
  /** 일회용품 포함 여부 */
  includeDisposable?: boolean
  /** 주문 상품 이름 */
  name?: string | null
  /** 상품 주문 상태: READY(주문 대기), CHECKING(주문 확인 중), PREPARING(메뉴 준비 중), REQUEST_CANCEL(주문 취소 요청), CANCELED(주문 취소), DELIVERING(배달 중), DELIVERED(배달 완료), ERROR(오류)

* `CANCELED` - 주문 취소
* `CHECKING` - 주문 확인 중
* `DELIVERED` - 배달 완료
* `DELIVERING` - 배달 중
* `ERROR` - 오류
* `PREPARING` - 메뉴 준비 중
* `READY` - 주문 대기
* `REQUEST_CANCEL` - 주문 취소 요청 */
  orderStatus?: OrderStatusEnum
  /** 배달 상태: MOVING(뉴비 이동 중), ARRIVED(뉴비 도착), DELIVERING(만나러 가는 중), DONE(전달했어요), CANCELED(취소)

* `ARRIVED` - 뉴비 도착
* `CANCELED` - 배달 취소
* `DELIVERING` - 배달중
* `DONE` - 배달완료
* `MOVING` - 뉴비 이동중 */
  deliveryStatus?: DeliveryStatusC50Enum
  /** 주문 승인 시각 - 점주가 주문 승인 */
  checkedAt?: string | null
  /** 슬랙 스레드 ID */
  slackThread?: string | null
  /** 날짜별 상점 주문 순번 */
  dailySeriesOfShop?: number
  /** 삭제 여부 */
  isDelete?: boolean
  /** 주문 상품 정보 */
  orderItemsSummary?: string | null
  /** 주문 상품 수량 */
  orderItemCount?: number | null
  /** 리뷰 푸시 발송 여부 */
  isReviewPushSent?: boolean
  /** 주문이 이뤄진 사이트 */
  site?: number | null
  /** 사용한 쿠폰 */
  userCoupon?: number | null
}
