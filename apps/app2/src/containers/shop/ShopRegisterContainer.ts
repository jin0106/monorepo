import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { createContainer } from 'unstated-next'
import { getShopsListQueryKey, useNodesList, useShopsCreate } from '@/api/generated/hooks'
import { AdminShopCreateReqRequest } from '@/api/generated/types'
import { SelectOptionType } from '@/components/form/Select'
import { Routes } from '@/constants/routes'
import useForm from '@/hooks/form/useForm'
import useAllSitesList from '@/hooks/query/useAllSitesList'

const useShopRegisterHook = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>()

  // form
  const formControl = useForm<AdminShopCreateReqRequest>({
    mode: 'onChange',
    shouldFocusError: true,
    criteriaMode: 'firstError',
    defaultValues: {
      isOpen: true
    }
  })

  const { handleSubmit, watch } = formControl

  const onSubmit = handleSubmit(async (data) => {
    try {
      await shopRegisterMutateAsync({
        data
      })
      queryClient.invalidateQueries(getShopsListQueryKey())
      router.push(Routes.Shop.List)
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
  const siteSelectOptions: SelectOptionType<number>[] = !isSitesLoading
    ? sites.reduce((results, site) => {
        results.push({
          label: site.name,
          value: site.id
        })
        return results
      }, [] as SelectOptionType<number>[])
    : []

  const siteId = watch('site')
  const siteSlug = sites.find((site) => site.id === siteId)?.slug || ''

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
  const { mutateAsync: shopRegisterMutateAsync } = useShopsCreate()

  const handleCancelClick = () => {
    router.back()
  }

  return {
    formControl,
    siteSelectOptions,
    nodeSelectOptions,
    handleCancelClick,
    onSubmit,
    submitErrorMessage
  }
}

const ShopRegisterContainer = createContainer(useShopRegisterHook)

export default ShopRegisterContainer
