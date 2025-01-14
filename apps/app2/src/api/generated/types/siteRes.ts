/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * Neubie Order
 * Neubie Order API Server
 * OpenAPI spec version: V1
 */
import type { BottomSheetImageRes } from './bottomSheetImageRes'
import type { DeliveryTypesEnum } from './deliveryTypesEnum'
import type { SiteAvailableStatusEnum } from './siteAvailableStatusEnum'
import type { SiteTypeEnum } from './siteTypeEnum'

export interface SiteRes {
  readonly id: number
  breakBottomSheetImage: BottomSheetImageRes
  /** 사이트 주문 가능 상태 */
  readonly siteAvailableStatus: SiteAvailableStatusEnum
  /** 배달 타입 */
  readonly deliveryTypes: DeliveryTypesEnum[]
  /** 사이트 이름 */
  name: string
  /** 슬러그 */
  slug?: string | null
  /** 중심 위도 */
  centerLatitude?: number | null
  /** 중심 경도 */
  centerLongitude?: number | null
  /** 대기 장소 위도 */
  baseLatitude?: number | null
  /** 대기 장소 경도 */
  baseLongitude?: number | null
  /** 뉴비 고 사이트 고유 번호 */
  neubieGoSiteNumber?: string | null
  /** 기상 악화 휴식으로 로봇 가용 여부 */
  isAvailable?: boolean
  /** 고객센터 전화번호 */
  csTelephoneNumber?: string | null
  /** 운행 임시 중단 시작 시간 */
  breakStartAt?: string | null
  /** 운행 임시 중단 중료 시간 */
  breakEndAt?: string | null
  /** 운행 시작 시간 */
  openAt?: string | null
  /** 마지막 주문 시간 */
  lastOrderAt?: string | null
  /** 예상 대기 시간 */
  waitingTime?: string | null
  /** 사이트별 알림톡 발신 프로필의 발신키 */
  alimtalkSenderKey?: string | null
  /** 사이트 타입: BASIC(자동 주문 사이트), MANUAL(수동 주문 사이트)

* `BASIC` - 자동 주문 사이트
* `MANUAL` - 수동 주문 사이트 */
  siteType?: SiteTypeEnum
  /** 알림 나갈 슬랙 채널 */
  slackChannel?: string | null
  /** 시간대 */
  timezone?: string
  /** 주문결제 시 포인트 사용 여부 */
  isUsePoint?: boolean
  /** 간편 배송 사용 여부. 해당 값이 참일 시, 가게 또는 배달지에 도착하면 적재함 버튼을 누르지 않아도 열리게 됨. */
  isUseSimpleDelivery?: boolean
  /** 국가 */
  country?: number | null
}
