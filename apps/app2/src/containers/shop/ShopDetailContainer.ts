import { useCallback, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { createContainer } from 'unstated-next'
import {
  getShopsListQueryKey,
  getShopsRetrieveQueryKey,
  useNodesList,
  useShopsRetrieve,
  useShopsUpdate
} from '@/api/generated/hooks'
import { getNodesListQueryKey, getSitesListQueryKey } from '@/api/generated/hooks-extension'
import { AdminShopCreateReqRequest, AdminShopUpdateReqRequest } from '@/api/generated/types'
import { SelectOptionType } from '@/components/form/Select'
import { RouteKeys, Routes } from '@/constants/routes'
import usePullToRefresh from '@/hooks/common/usePullToRefresh'
import useForm from '@/hooks/form/useForm'

import useAllSitesList from '@/hooks/query/useAllSitesList'
import { ApiUtils } from '@/utils/apiUtils'

const useShopRegisterHook = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const shopId = Number(router.query[RouteKeys.ShopId])
  const disabledNames: Set<keyof AdminShopCreateReqRequest> = new Set<keyof AdminShopCreateReqRequest>(['site'])
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>()

  const { data: shop, isLoading: isShopLoading } = useShopsRetrieve(shopId)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    site,
    mainImage,
    telephoneNumber,
    businessRegistrationNumber,
    accountManagerName,
    address,
    neubieGoNodeNumber,
    accountManagerMobileNumber,
    ...shopOther
  } = shop ?? {}
  // form
  const formControl = useForm<AdminShopCreateReqRequest>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {
      site: site?.id,
      address: address
        ? {
            postNumber: address.postNumber ?? undefined,
            basicAddress: address.basicAddress ?? undefined,
            detailAddress: address.detailAddress ?? undefined
          }
        : undefined,
      accountManagerMobileNumber: accountManagerMobileNumber ?? undefined,
      accountManagerName: accountManagerName ?? undefined,
      neubieGoNodeNumber: neubieGoNodeNumber ?? undefined,
      businessRegistrationNumber: businessRegistrationNumber ?? undefined,
      telephoneNumber: telephoneNumber ?? undefined,
      mainImage: mainImage?.shopMain || undefined,
      ...shopOther
    }
  })

  const { setValue, handleSubmit, watch } = formControl

  useEffect(() => {
    if (shop) {
      Object.entries(shop).forEach(([name, value]) => {
        if (name === 'site') {
          if (value) {
            const { id } = value
            setValue('site', id)
          }
        } else {
          setValue(name as keyof AdminShopUpdateReqRequest, value)
        }
      })
    }
  }, [setValue, shop])

  const onSubmit = handleSubmit(async (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { site, mainImage, ...req } = data
    try {
      await shopUpdateMutateAsync({
        id: shopId,
        data: { mainImage: mainImage instanceof Blob ? mainImage : undefined, ...req }
      })
      queryClient.invalidateQueries(getShopsListQueryKey())
      router.push(Routes.Shop.List)
      setSubmitErrorMessage(undefined)
    } catch (e) {
      if (e instanceof AxiosError) {
        const message = e.response?.data?.join('\n') || '오류가 발생했습니다'
        const statusCode = e.response?.status || 999
        setSubmitErrorMessage(`${message}(${statusCode})`)
      } else {
        setSubmitErrorMessage('오류가 발생했습니다')
      }
    }
  })

  // Sites
  const { sitesList: sites, isLoading: isSitesLoading } = useAllSitesList()
  const siteSelectOptions: SelectOptionType<number>[] =
    !isSitesLoading && sites
      ? sites.reduce((results, site) => {
          results.push({
            label: site.name,
            value: site.id
          })
          return results
        }, [] as SelectOptionType<number>[])
      : []

  const siteId = watch('site')
  const siteSlug = sites?.find((site) => site.id === siteId)?.slug || ''

  // Nodes
  const { data: nodes, isLoading: isNodesLoading } = useNodesList({ siteSlug }, { query: { enabled: !!siteSlug } })
  const nodeSelectOptions: SelectOptionType<string>[] =
    (!isNodesLoading &&
      nodes?.reduce((results, node) => {
        results.push({
          label: node.name,
          value: node.nodeNumber
        })
        return results
      }, [] as SelectOptionType<string>[])) ||
    []

  // Shop, register
  const { mutateAsync: shopUpdateMutateAsync } = useShopsUpdate()

  const handleCancelClick = () => {
    router.back()
  }

  const pullToRefreshCallback = useCallback(async () => {
    await ApiUtils.refreshByQueryKey({
      queryClient: queryClient,
      refetchQueryKeys: [
        [...getShopsRetrieveQueryKey(shopId)],
        [...getSitesListQueryKey()],
        [...getNodesListQueryKey()]
      ]
    })
  }, [shopId])

  const { pullToRefreshStatus } = usePullToRefresh(pullToRefreshCallback)

  return {
    formControl,
    isShopLoading,
    disabledNames,
    siteSelectOptions,
    nodeSelectOptions,
    handleCancelClick,
    onSubmit,
    submitErrorMessage,
    pullToRefreshStatus
  }
}

const ShopRegisterContainer = createContainer(useShopRegisterHook)

export default ShopRegisterContainer
