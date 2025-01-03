import { useForm } from 'react-hook-form'
import { useUsersCreate } from '@/api/generated/hooks'
import { AdminUserReqRequest } from '@/api/generated/types'

const useMemberRegister = () => {
  const memberFormMethods = useForm<AdminUserReqRequest>({
    mode: 'onChange'
  })
  const { mutateAsync: memberCreate } = useUsersCreate()
  return {
    memberFormMethods,
    memberCreate
  }
}

export default useMemberRegister
