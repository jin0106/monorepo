import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { TFunction, useTranslation } from 'next-i18next'
import { createContainer } from 'unstated-next'
import {
  getShopsListQueryKey,
  getSitesListQueryKey,
  useShopsList,
  useShopsMainImageUpdate,
  useShopsOpenUpdate
} from '@/api/generated/hooks'
import {
  AdminProductUpdateImageReqRequest,
  AdminShopRes,
  PaginatedAdminShopResList,
  ShopsListParams,
  UserTypeEnum
} from '@/api/generated/types'
import { ImageUploadModalBaseData } from '@/components/common/modal/ImageUploadModal'
import { TableContentsType } from '@/components/common/tables/TableContent'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { RouteKeys, Routes } from '@/constants/routes'
import useModal from '@/hooks/common/useModal'
import usePagination from '@/hooks/common/usePagination'
import usePullToRefresh from '@/hooks/common/usePullToRefresh'
import useForm from '@/hooks/form/useForm'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import { ApiUtils } from '@/utils/apiUtils'
import { formatCoordinates } from '@/utils/coordinate'
import { DateUtils } from '@/utils/date'

export interface MainImageUploadModalData extends ImageUploadModalBaseData {
  shopId?: number
}

/**
 * 휴게 시간
 * @param openedAt 가게 오픈 시간
 * @param breakStart 휴게 시작시간
 * @param breakEnd 휴게 종료
 * @param t
 */
const getBreakTimeStartEndHoursString = (
  openedAt: string | undefined | null,
  breakStart: string | undefined | null,
  breakEnd: string | undefined | null,
  t: TFunction
): string | undefined => {
  if (!openedAt || !breakStart || !breakEnd) {
    return undefined
  }
  const openedAtDayjs = dayjs(openedAt, 'HH:mm:ss')
  const breakStartDayjs = dayjs(breakStart, 'HH:mm:ss')
  const breakEndDayjs = dayjs(breakEnd, 'HH:mm:ss')
  // 휴게시간 시작 익일 여부
  const isStartNextDay = openedAtDayjs.isAfter(breakStartDayjs)
  // 휴게시간 종료 익일 여부
  const isEndNextDay = openedAtDayjs.isAfter(breakEndDayjs)

  if (!breakStartDayjs.isValid() || !breakEndDayjs.isValid()) {
    return undefined
  }

  return `${(isStartNextDay ? t('shop:next-day') + ' ' : '') + breakStartDayjs.format('HH:mm')}~${
    (!isStartNextDay && isEndNextDay ? t('shop:next-day') + ' ' : '') + breakEndDayjs.format('HH:mm')
  }`
}

const useShopHook = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Shop, I18nNamespaceEnum.Common])
  const queryClient = useQueryClient()
  const router = useRouter()
  const [searchParams, setSearchParams] = useState<ShopsListParams>()
  const {
    data: shopsList,
    isLoading: isShopListLoading,
    itemCountPerPage,
    currentPage,
    handlePageChange,
    refetch: refetchShopsList
  } = usePagination<PaginatedAdminShopResList>(useShopsList, searchParams, 10, 1)

  // Image Upload
  const imageUploadModalFormControl = useForm<AdminProductUpdateImageReqRequest>()
  const imageUploadModalProps = useModal<MainImageUploadModalData>()
  const { modalData: imageUploadModalData } = imageUploadModalProps
  const [imageUploadModalDescription, setImageUploadModalDescription] = useState<ReactElement>()
  const { handleSubmit: handleImageUploadSubmitWrapper, reset } = imageUploadModalFormControl
  const { mutate: updateShopsMainImage } = useShopsMainImageUpdate()
  const { mutate: updateShopsOpen } = useShopsOpenUpdate()

  const handleImageUploadClick = (shop: AdminShopRes) => {
    setImageUploadModalDescription(
      <div className="flex">
        <span className="body3 text-warning">{shop.name}</span>
        <span className="body3 text-gray-300">{t('shop:modal.add_image.main_image_summary')}</span>
      </div>
    )
    imageUploadModalProps.setModalData({ imageUrl: shop.mainImage?.fullSize || undefined, shopId: shop.id })
    reset()
    imageUploadModalProps.handleOpen()
  }

  const fileObjectUrlRef = useRef<string>()
  useEffect(() => {
    return () => {
      if (fileObjectUrlRef.current) {
        URL.revokeObjectURL(fileObjectUrlRef.current)
      }
    }
  }, [])

  const handleImageUploadFileChange = (file: string | File) => {
    const imageUrl = typeof file === 'string' ? file : URL.createObjectURL(file)
    if (typeof file === 'string') {
      if (fileObjectUrlRef.current) {
        URL.revokeObjectURL(fileObjectUrlRef.current)
      }
      fileObjectUrlRef.current = imageUrl
    }
    imageUploadModalProps.setModalData({
      ...imageUploadModalData,
      imageUrl
    })
  }

  const handleImageUploadSubmit = handleImageUploadSubmitWrapper(async (data) => {
    const { shopId } = imageUploadModalData
    if (!shopId) {
      return
    }
    // TODO: 로딩 필요함
    updateShopsMainImage(
      { id: shopId, data },
      {
        onSuccess: async () => {
          console.info('메인 이미지 업로드 성공')
          await refetchShopsList()
          imageUploadModalProps.handleClose()
        },
        onError: () => {
          console.error('메인 이미지 업로드 실패')
        }
      }
    )
  })

  const handleIsOpenClick = (shop: AdminShopRes) => {
    updateShopsOpen(
      { id: shop.id, data: { isOpen: !shop.isOpen } },
      {
        onSuccess: async () => {
          console.info('영업중 변경 성공')
          await refetchShopsList()
        },
        onError: () => {
          console.error('영업중 변경 실패')
        }
      }
    )
  }

  // todo: url로부터 이미지 파일명 파싱이 불가능할 경우 보여져야 할 문구를 기획해야 합니다(현재는 단순히 "Image" 텍스트로만 보여짐)
  const extractUploadedImageFileName = (url: string | null) => {
    if (!url) {
      return 'Image'
    }
    const urlWithoutQueryString = decodeURI(url.split('?')[0])
    const pathSegments = urlWithoutQueryString.split('/')
    const lastPathComponent = pathSegments.filter((segment) => segment !== '').pop()

    // 만약 마지막 요소가 없으면 문자열 "Image" 반환
    return lastPathComponent || 'Image'
  }

  const handleGoToUpdateClick = (shop: AdminShopRes) => {
    router.push({ pathname: Routes.Shop.Detail, query: { [RouteKeys.ShopId]: shop.id } })
  }

  const shopsListContent: TableContentsType[] =
    shopsList?.results?.reduce((results, shop) => {
      const content = {
        row: [
          {
            key: 'name',
            content: shop.name
          },
          {
            key: 'shopCoordinate',
            content: formatCoordinates(shop.latitude, shop.longitude)
          },
          {
            key: 'mainImage',
            content: (
              <Permission
                allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN]}
                disallowElement={
                  <a target="_blank" className="underline" href={shop?.mainImage?.fullSize ?? undefined}>
                    image
                  </a>
                }>
                {shop.mainImage.fullSize ? (
                  <button className="underline" onClick={() => handleImageUploadClick(shop)}>
                    {extractUploadedImageFileName(shop.mainImage.fullSize)}
                  </button>
                ) : (
                  <button className="btn gap-2 normal-case" onClick={() => handleImageUploadClick(shop)}>
                    <ArrowUpOnSquareIcon className="h-4 w-4" />
                    {`${t('common:image')} ${t('common:upload')}`}
                  </button>
                )}
              </Permission>
            )
          },
          {
            key: 'businessHours',
            content: DateUtils.getStartEndHoursString(shop.openAt, shop.lastOrderAt, t)
          },
          {
            key: 'breakTime',
            content: getBreakTimeStartEndHoursString(shop.openAt, shop.breakStartAt, shop.breakEndAt, t)
          },
          {
            key: 'accountManager',
            content: `${shop.accountManagerName ?? ''} ${shop.accountManagerMobileNumber ?? ''}`.trim()
          },
          {
            key: 'isOpen',
            content: (
              <Permission
                allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN, UserTypeEnum.SITE_ADMIN]}
                disallowElement={shop?.isOpen ? t('common:shop_open') : t('common:shop_close')}>
                <input
                  type="checkbox"
                  className="toggle-info toggle"
                  checked={shop.isOpen}
                  readOnly
                  onClick={() => handleIsOpenClick(shop)}
                />
              </Permission>
            )
          },
          {
            key: 'goToUpdate',
            content: (
              <Permission allowAdminTypes={[UserTypeEnum.ADMIN, UserTypeEnum.SHOP_ADMIN]}>
                <button onClick={() => handleGoToUpdateClick(shop)}>{t('common:update')}</button>
              </Permission>
            )
          }
        ]
      }
      results.push(content)
      return results
    }, [] as TableContentsType[]) || []

  const { sitesList: sites, isLoading: isSitesLoading } = useAllSitesList()

  const pullToRefreshCallback = useCallback(async () => {
    await ApiUtils.refreshByQueryKey({
      queryClient: queryClient,
      refetchQueryKeys: [[...getSitesListQueryKey()], [...getShopsListQueryKey()]]
    })
  }, [searchParams])

  const { pullToRefreshStatus } = usePullToRefresh(pullToRefreshCallback)

  return {
    shopsListContent,
    isShopListLoading,
    itemCountPerPage,
    currentPage,
    handlePageChange,
    shopsListCount: shopsList?.count,
    refetchShopsList,
    sites,
    isSitesLoading,
    searchParams,
    setSearchParams,
    imageUploadModalFormControl,
    imageUploadModalProps,
    imageUploadModalDescription,
    handleImageUploadSubmit,
    handleImageUploadFileChange,
    pullToRefreshStatus
  }
}

const ShopContainer = createContainer(useShopHook)

export default ShopContainer
