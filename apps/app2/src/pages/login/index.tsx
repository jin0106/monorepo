import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { AppProps } from 'next/app'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import Modal from '@/components/common/modal'
import PasswordResetModalContent from '@/components/login/PasswordResetModalContent'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { LocalStorageKeyEnum } from '@/constants/localStorageKey.enum'
import AuthContainer from '@/containers/common/AuthContainer'
import useModal from '@/hooks/common/useModal'
import { isInApp } from '@/pages/_app'
import { decrypt } from '@/utils/localStorage'

type LoginFormType = {
  id: string
  password: string
}

const pageLoginI18nNamespaces = [I18nNamespaceEnum.Login]

const PageLoginContent = () => {
  const { t } = useTranslation(pageLoginI18nNamespaces)
  const { login } = AuthContainer.useContainer()
  const passwordResetModalControls = useModal()
  const formRef = useRef<HTMLFormElement | null>(null)
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue
  } = useForm<LoginFormType>()

  const onSubmit = handleSubmit((data) => {
    login(data.id, data.password)
  })

  useEffect(() => {
    if (isInApp()) {
      // TODO: 토큰이 알수 없는 이유로 제거되서, 로그인이 풀리는 이슈를 해결 후에 username등을 저장하는 관련 로직들을 제거해야 함
      const usernameCt = localStorage.getItem(LocalStorageKeyEnum.Username)
      const passwordCt = localStorage.getItem(LocalStorageKeyEnum.Password)
      if (usernameCt && passwordCt) {
        const username = decrypt(usernameCt)
        const password = decrypt(passwordCt)
        setValue('id', username)
        setValue('password', password)
        formRef.current?.requestSubmit()
      }
    }
  }, [])

  const handlePasswordResetButtonClick = () => {
    passwordResetModalControls.handleOpen()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200">
      <section className="card w-full max-w-2xl rounded-xl bg-base-100 p-20 shadow-xl">
        <h1 className="mb-2 text-center text-2xl font-semibold">{t('login:title')}</h1>
        <div>app2 delete</div>
        <form ref={formRef} className="form-control flex  gap-2" onSubmit={onSubmit}>
          <div>
            <label className="label">
              <span className="label-text text-base-content">ID</span>
            </label>
            <input
              type="email"
              placeholder="example@neubility.co.kr"
              autoComplete="on"
              className={classNames(
                {
                  'input-bordered input w-full': true
                },
                {
                  'border-error': errors.id
                }
              )}
              {...register('id', {
                required: true
              })}
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text text-base-content">Password</span>
            </label>
            <input
              type="password"
              placeholder={t('login:password-placeholder')}
              autoComplete="on"
              className={classNames(
                {
                  'input-bordered input w-full': true
                },
                {
                  'border-error': errors.password
                }
              )}
              {...register('password', {
                required: true
              })}
            />
          </div>
          <button type="button" className="self-end" onClick={handlePasswordResetButtonClick}>
            {t('login:password-reset.text')}
          </button>
          <button type="submit" className="btn-info btn-lg btn mt-5 w-full">
            {t('login:login')}
          </button>
        </form>
      </section>
      <Modal
        className="w-[668px]"
        modalProps={passwordResetModalControls}
        showCloseBtn={false}
        onDimClick={() => passwordResetModalControls.handleClose()}>
        <PasswordResetModalContent modalControls={passwordResetModalControls} />
      </Modal>
    </div>
  )
}

const PageLogin = () => {
  return <PageLoginContent />
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageLoginI18nNamespaces))
    }
  }
}

// 기본 레이아웃을 쓰지 않는 경우 추가
PageLogin.getLayout = (page: AppProps) => page

export default PageLogin
