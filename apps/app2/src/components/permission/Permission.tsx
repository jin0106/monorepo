import { PropsWithChildren, ReactNode } from 'react'
import { UserTypeEnum } from '@/api/generated/types'
import AuthContainer from '@/containers/common/AuthContainer'

type AllowAdminTypes = {
  allowAdminTypes?: UserTypeEnum[]
  disallowAdminTypes?: UserTypeEnum[]
  disallowElement?: ReactNode | string
}

const Permission = ({
  allowAdminTypes,
  disallowAdminTypes,
  children,
  disallowElement
}: PropsWithChildren<AllowAdminTypes>) => {
  const { adminInfo } = AuthContainer.useContainer()

  if (!adminInfo?.userType) {
    return null
  }

  if (
    disallowAdminTypes?.includes(adminInfo.userType) ||
    (allowAdminTypes && !allowAdminTypes?.includes(adminInfo.userType))
  ) {
    return disallowElement ? <>{disallowElement}</> : null
  }

  return <>{children}</>
}

export default Permission
