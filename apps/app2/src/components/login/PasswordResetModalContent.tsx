import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { useUsersResetPasswordPartialUpdate, useUsersVerifyRetrieve } from '@/api/generated/hooks'
import { UsersVerifyRetrieveParams } from '@/api/generated/types'
import Modal from '@/components/common/modal'
import { LocaleEnum } from '@/constants/i18n'
import useLocale from '@/hooks/common/useLocale'
import { ModalPropsType } from '@/hooks/common/useModal'
import { ApiUtils } from '@/utils/apiUtils'
import { Validator } from '@/utils/design-system/validator'

const AUTH_MAX_COUNT = 5
const CS_NUMBER = '010-4754-9659'
const CS_NUMBER_GLOBAL = '(+82) 10-4754-9659'

interface PasswordResetModalContentProps {
  modalControls: ModalPropsType
}

const PasswordResetModalContent = ({ modalControls }: PasswordResetModalContentProps) => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const [authFailedCount, setAuthFailedCount] = useState(0)
  const [usersVerifyParams, setUsersVerifyParams] = useState<UsersVerifyRetrieveParams>()
  const {
    data: usersVerifyRes,
    isFetching: isUsersVerifyFetching,
    refetch
  } = useUsersVerifyRetrieve(
    { username: usersVerifyParams?.username || '', mobileNumber: usersVerifyParams?.mobileNumber || '' },
    { query: { enabled: false } }
  )
  const { mutateAsync: updateUserPassword, isLoading: isUpdateUserPasswordLoading } =
    useUsersResetPasswordPartialUpdate()

  const [username, setUsername] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const mobileNumberReplaced = mobileNumber.trim().replaceAll('-', '')
  const [passwordNew, setPasswordNew] = useState('')
  const [passwordNewConfirm, setPasswordNewConfirm] = useState('')

  const isAuthenticated = !!usersVerifyRes?.userId

  useEffect(() => {
    const verifyUser = async () => {
      const res = await refetch()
      if (!res.isSuccess) {
        setAuthFailedCount((prev) => prev + 1)
      }
    }
    if (usersVerifyParams) {
      verifyUser()
    }
  }, [usersVerifyParams])

  const handleAuthenticationButtonClick = async () => {
    setUsersVerifyParams({ username, mobileNumber: mobileNumberReplaced })
  }

  const handlePasswordResetButtonClick = async () => {
    const { userId } = usersVerifyRes || {}
    if (!userId) {
      return
    }
    try {
      await updateUserPassword({
        id: userId,
        data: { username, mobileNumber: mobileNumberReplaced, password: passwordNew }
      })
      modalControls.handleClose()
    } catch (e) {
      if (e instanceof AxiosError) {
        ApiUtils.onErrorAlert(e)
      }
    }
  }

  const getAuthenticationErrorMessage = () => {
    if (authFailedCount === 0) {
      return undefined
    }

    if (authFailedCount >= AUTH_MAX_COUNT) {
      return t('login:password-reset.modal.validation.auth-failed', {
        maxCount: AUTH_MAX_COUNT,
        csNumber: locale === LocaleEnum.Korean ? CS_NUMBER : CS_NUMBER_GLOBAL
      })
    }
    return t('login:password-reset.modal.validation.id-mobile-number-not-equals', {
      count: authFailedCount,
      maxCount: AUTH_MAX_COUNT
    })
  }

  const authErrorMessage = getAuthenticationErrorMessage()
  const isAuthButtonDisabled =
    isUsersVerifyFetching ||
    !username?.trim().length ||
    !mobileNumber?.trim().replaceAll('-', '').length ||
    authFailedCount >= AUTH_MAX_COUNT

  const getPasswordResetErrorMessage = () => {
    if (passwordNew && !Validator.validatePassword(passwordNew)) {
      return t('login:password-reset.modal.validation.password-format-invalid')
    }

    if (passwordNewConfirm && passwordNew !== passwordNewConfirm) {
      return t('login:password-reset.modal.validation.password-confirm-failed')
    }

    return undefined
  }
  const passwordResetErrorMessage = !!getPasswordResetErrorMessage()
  const isPasswordResetButtonDisabled =
    isUpdateUserPasswordLoading || !passwordNew || !passwordNewConfirm || passwordResetErrorMessage

  return (
    <div className="">
      <Modal.Header>
        <span className="text-[24px] font-bold text-[#E9E9E9]">
          {isAuthenticated
            ? t('login:password-reset.modal.title.password-reset')
            : t('login:password-reset.modal.title.authentication')}
        </span>
      </Modal.Header>
      <div className="flex flex-col gap-[12px] pb-[32px]">
        {isAuthenticated ? (
          <>
            <input
              className={classNames('input-bordered input w-full bg-[#393F4E]')}
              type="password"
              value={passwordNew}
              maxLength={200}
              placeholder={t('login:password-reset.modal.password-new.placeholder')}
              onChange={(e) => setPasswordNew(e.target.value)}
            />
            <input
              className={classNames('input-bordered input w-full bg-[#393F4E]')}
              type="password"
              value={passwordNewConfirm}
              maxLength={200}
              placeholder={t('login:password-reset.modal.password-new-confirm.placeholder')}
              onChange={(e) => setPasswordNewConfirm(e.target.value)}
            />
            {passwordResetErrorMessage ? (
              <span className="whitespace-pre-wrap text-[14px] text-[#FF8980]">{passwordResetErrorMessage}</span>
            ) : (
              <span className="whitespace-pre-wrap text-[14px] text-[#8E95A8]">
                {t('login:password-reset.modal.password-helper-text')}
              </span>
            )}
          </>
        ) : (
          <>
            <input
              className={classNames('input-bordered input w-full bg-[#393F4E]')}
              inputMode="email"
              value={username}
              maxLength={200}
              placeholder={t('login:password-reset.modal.id.placeholder')}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className={classNames('input-bordered input w-full bg-[#393F4E]')}
              inputMode="tel"
              value={mobileNumber}
              maxLength={200}
              placeholder={t('login:password-reset.modal.mobile-number.placeholder')}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            {authErrorMessage && (
              <span className="whitespace-pre-wrap text-[14px] text-[#FF8980]">{authErrorMessage}</span>
            )}
          </>
        )}
      </div>
      {isAuthenticated ? (
        <button
          className="btn-info btn-lg btn w-full normal-case"
          disabled={isPasswordResetButtonDisabled}
          onClick={handlePasswordResetButtonClick}>
          {t('login:password-reset.modal.button.password-reset')}
        </button>
      ) : (
        <button
          className="btn-info btn-lg btn w-full normal-case"
          disabled={isAuthButtonDisabled}
          onClick={handleAuthenticationButtonClick}>
          {t('login:password-reset.modal.button.authentication')}
        </button>
      )}
    </div>
  )
}

export default PasswordResetModalContent
