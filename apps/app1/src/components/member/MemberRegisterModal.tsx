import React from 'react'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { AdminUserReqRequest, UserTypeEnum } from '@/api/generated/types'
import Modal from '@/components/common/modal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { getUserTypeEnumText } from '@/constants/orderStatusText'
import MemberContainer from '@/containers/member/MemberContainer'
import { ModalPropsType } from '@/hooks/common/useModal'

type MemberRegisterModalProps = {
  modalProps: ModalPropsType<AdminUserReqRequest>
}

const SelectSite = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Common])
  const {
    memberFormMethods: { setValue },
    siteList
  } = MemberContainer.useContainer()
  return (
    <select
      className="input-bordered select"
      onChange={(e) => {
        e?.target?.value && setValue('userSites', [parseInt(e.target.value)])
      }}>
      <option value="">{t('common:filter.select_site')}</option>
      {siteList.map((site) => (
        <option key={site?.id} value={site?.id}>
          {site?.name}
        </option>
      ))}
    </select>
  )
}

const SelectShop = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Common])
  const {
    memberFormMethods: { setValue },
    shopsList
  } = MemberContainer.useContainer()
  return (
    <>
      <SelectSite />
      <select
        className="input-bordered select"
        onChange={(e) => {
          e?.target?.value && setValue('userShops', [parseInt(e.target.value)])
        }}>
        <option value="">{t('common:filter.select_shop')}</option>
        {shopsList.map((shop) => (
          <option key={shop?.id} value={shop?.id}>
            {shop?.name}
          </option>
        ))}
      </select>
    </>
  )
}

const MemberRegisterModal = ({ modalProps }: MemberRegisterModalProps): JSX.Element => {
  const { t } = useTranslation([I18nNamespaceEnum.Member])
  const { memberFormMethods, memberCreate } = MemberContainer.useContainer()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = memberFormMethods

  const userType = watch('userType')

  const onSubmit = handleSubmit(async (data) => {
    await memberCreate({ data })
    modalProps?.handleClose()
  })

  return (
    <form className="flex w-[400px] flex-col gap-5" onSubmit={onSubmit}>
      <Modal.Header title={t('member:modal.create.title')} />
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content ">ID</span>
        </label>
        <label className="input-group">
          <input
            type="text"
            placeholder="example@neubility.co.kr"
            className={classNames('input-bordered input w-full', { 'border-error': errors.username })}
            {...register('username', { required: true })}
          />
        </label>
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content">Password</span>
        </label>
        <input
          type="password"
          placeholder={t('member:modal.create.password_placeholder')}
          className={classNames('input-bordered input w-full', { 'border-error': errors.password })}
          {...register('password', { required: true })}
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content">{t('member:modal.create.mobile_number')}</span>
        </label>
        <input
          type="text"
          placeholder={t('member:modal.create.mobile_number_placeholder')}
          className={classNames('input-bordered input w-full', { 'border-error': errors.mobileNumber })}
          {...register('mobileNumber', { required: true })}
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content">email</span>
        </label>
        <input
          type="text"
          placeholder={t('member:modal.create.email_placeholder')}
          className={classNames('input-bordered input w-full', { 'border-error': errors.email })}
          {...register('email', { required: true })}
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content">{t('member:modal.create.name')}</span>
        </label>
        <input
          type="text"
          placeholder={t('member:modal.create.name_placeholder')}
          className={classNames('input-bordered input w-full', { 'border-error': errors.name })}
          {...register('name', { required: true })}
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-base-content">{t('member:modal.create.user_type')}</span>
        </label>
        <select className="input-bordered select" {...register('userType', { required: true })}>
          <option value="">{t('member:modal.create.user_type_placeholder')}</option>
          {Object.keys(UserTypeEnum).map((userType) => (
            <option key={userType} value={userType}>
              {getUserTypeEnumText(t, userType as UserTypeEnum)}
            </option>
          ))}
        </select>
      </div>
      {userType === UserTypeEnum.SITE_ADMIN && <SelectSite />}
      {userType === UserTypeEnum.SHOP_ADMIN && <SelectShop />}
      <Modal.Footer>
        <button type="submit" className="btn-info btn-sm btn w-1/2 px-6 normal-case">
          {t('member:modal.create.cta')}
        </button>
      </Modal.Footer>
    </form>
  )
}

export default MemberRegisterModal
