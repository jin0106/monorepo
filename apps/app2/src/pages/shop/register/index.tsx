import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import FormDevTools from '@/components/form/FormDevTools'
import MainLayout from '@/components/layouts/MainLayout'
import ShopDetailForm from '@/components/shop/ShopDetailForm'
import { I18nNamespaceEnum } from '@/constants/i18n'
import ShopRegisterContainer from '@/containers/shop/ShopRegisterContainer'

const pageShopRegisterI18nNameSpaces = [I18nNamespaceEnum.Shop, I18nNamespaceEnum.Common]

const PageShopRegisterContent = () => {
  const { t } = useTranslation(pageShopRegisterI18nNameSpaces)
  const { formControl, siteSelectOptions, nodeSelectOptions, handleCancelClick, onSubmit, submitErrorMessage } =
    ShopRegisterContainer.useContainer()
  const { control } = formControl

  return (
    <MainLayout title={t('shop:create_shop')}>
      <ShopDetailForm
        formControl={formControl}
        nodeSelectOptions={nodeSelectOptions}
        siteSelectOptions={siteSelectOptions}
        onSubmit={onSubmit}>
        <div className="col-span-6 flex w-full flex-col gap-[24px]">
          {submitErrorMessage && (
            <div className="alert alert-error justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{submitErrorMessage}</span>
            </div>
          )}
          <div className="mb-[16px] flex w-full gap-[16px]">
            <button className="btn w-full flex-shrink normal-case" onClick={handleCancelClick}>
              {t('common:cancel')}
            </button>
            <button className="btn-info btn w-full flex-shrink normal-case" type="submit" /* disabled={!isValid} */>
              {t('shop:create_shop')}
            </button>
          </div>
        </div>
      </ShopDetailForm>
      <FormDevTools control={control} />
    </MainLayout>
  )
}

const PageShopRegister = () => {
  return (
    <ShopRegisterContainer.Provider>
      <PageShopRegisterContent />
    </ShopRegisterContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageShopRegisterI18nNameSpaces))
    }
  }
}

export default PageShopRegister
