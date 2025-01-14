import { useMemo, useState } from 'react'
import * as process from 'process'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { createContainer } from 'unstated-next'
import { useUsersCascadeDestroy, useUsersCreate, useUsersList } from '@/api/generated/hooks'
import { AdminUserReqRequest, PaginatedUserResList, UsersListParams, UserTypeEnum } from '@/api/generated/types'
import { TableContentsType } from '@/components/common/tables/TableContent'
import { DeployEnvironmentEnum } from '@/constants/deployEnvironment.enum'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { getUserTypeEnumText } from '@/constants/orderStatusText'
import useModal from '@/hooks/common/useModal'
import usePagination from '@/hooks/common/usePagination'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import useShopsListAll from '@/hooks/query/useShopsListAll'
import { DateUtils } from '@/utils/date'

const MemberContainer = createContainer(() => {
  const { t } = useTranslation([I18nNamespaceEnum.Common])

  const [searchParam, setSearchParam] = useState<UsersListParams>({})
  // 회원 리스트
  const {
    data: userList,
    refetch: refetchUserList,
    itemCountPerPage,
    currentPage,
    handlePageChange
  } = usePagination<PaginatedUserResList>(useUsersList, searchParam, 8, 1)

  const userListContent: TableContentsType[] = useMemo(
    () =>
      userList?.results?.map((user) => ({
        row: [
          {
            key: 'id',
            content: (
              <div>
                <p>{user?.id}</p>
              </div>
            )
          },
          {
            key: 'email',
            content: (
              <div>
                <p>{user?.email}</p>
              </div>
            )
          },
          {
            key: 'name',
            content: (
              <div>
                <p>{user?.name}</p>
              </div>
            )
          },
          {
            key: 'userType',
            content: (
              <div>
                <p>{user?.userType && getUserTypeEnumText(t, user.userType)}</p>
              </div>
            )
          },
          {
            key: 'createdAt',
            content: (
              <div>
                <p>{DateUtils.getDateString(user?.dateJoined)}</p>
              </div>
            )
          },
          {
            key: 'cascadeUser',
            content: user?.userType === UserTypeEnum.USER &&
              process.env.PLATFORM_ENV !== DeployEnvironmentEnum.Production && (
                <div
                  onClick={() => {
                    if (!user?.id) {
                      return
                    }
                    const confirm = window?.confirm('삭제하시겠습니까?')
                    if (!confirm) {
                      return
                    }
                    cascadeUser(user.id)
                  }}>
                  <button className="btn-error btn">삭제</button>
                </div>
              )
          }
        ]
      })) || [],
    [userList]
  )

  // 회원 생성
  const memberRegisterModalProps = useModal<AdminUserReqRequest>()
  const memberFormMethods = useForm<AdminUserReqRequest>({
    mode: 'onChange'
  })
  const { mutateAsync: memberCreate } = useUsersCreate()

  // 유저 권한 선택
  const selectedUserType = memberFormMethods?.watch('userType')

  // 사이트 선택
  const enabledSiteList = selectedUserType === UserTypeEnum.SITE_ADMIN || selectedUserType === UserTypeEnum.SHOP_ADMIN
  const { sitesList: siteList } = useAllSitesList({ enabled: enabledSiteList })
  const selectedSite = memberFormMethods?.watch('userSites')?.[0]

  // 매장 선택
  const { shopsList } = useShopsListAll({
    queryParams: { sites: [...(selectedSite ? [selectedSite] : [])] },
    enabled: !!selectedSite
  })

  const { mutate: mutateCascadeUser } = useUsersCascadeDestroy({
    mutation: {
      onSuccess: () => {
        refetchUserList()
      }
    }
  })
  const cascadeUser = (id: number) => {
    if (process.env.PLATFORM_ENV === DeployEnvironmentEnum.Production) {
      return
    }
    mutateCascadeUser({ id })
  }

  return {
    memberRegisterModalProps,
    memberFormMethods,
    memberCreate,
    siteList,
    selectedUserType,
    selectedSite,
    shopsList,
    userListContent,
    itemCountPerPage,
    currentPage,
    handlePageChange,
    userListCount: userList?.count,
    setSearchParam,
    cascadeUser
  }
})

export default MemberContainer
