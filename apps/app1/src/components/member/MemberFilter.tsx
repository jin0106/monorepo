import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { UserTypeEnum } from '@/api/generated/types'
import { I18nNamespaceEnum } from '@/constants/i18n'
import MemberContainer from '@/containers/member/MemberContainer'

type MemberFilterFormType = {
  userType: UserTypeEnum
  mobileNumber: string
}

const MemberFilter = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Member, I18nNamespaceEnum.Common])
  const { setSearchParam } = MemberContainer.useContainer()
  const { register, handleSubmit, resetField } = useForm<MemberFilterFormType>()
  const onSubmit = handleSubmit((data) => {
    setSearchParam(data)
  })

  return (
    <form className="my-3 flex flex-wrap gap-2" onSubmit={onSubmit}>
      <div>
        <label className="label">
          <span className="label-text text-base-content">{t('common:filter.select_member')}</span>
        </label>
        <select className="select-bordered select" {...register('userType')}>
          <option value="">{t('common:filter.all_member')}</option>
          <option value={UserTypeEnum.USER}>{t('common:user_type.user')}</option>
          <option value={UserTypeEnum.SHOP_ADMIN}>{t('common:user_type.shop_admin')}</option>
          <option value={UserTypeEnum.ADMIN}>{t('common:user_type.admin')}</option>
          <option value={UserTypeEnum.SITE_ADMIN}>{t('common:user_type.site_admin')}</option>
        </select>
      </div>
      <div>
        <label className="label">
          <span className="label-text text-base-content">{t('member:modal.create.mobile_number')}</span>
        </label>
        <input type="text" className="input-bordered input" {...register('mobileNumber')} />
      </div>
      <div className="flex items-end">
        <button type="submit" className=" btn-md btn">
          <MagnifyingGlassIcon className="h-[25px] w-[25px]" />
        </button>
      </div>
    </form>
  )
}

export default MemberFilter
