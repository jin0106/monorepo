import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import FormDevTools from '@/components/form/FormDevTools'
import MainLayout from '@/components/layouts/MainLayout'
import ShopDetailForm from '@/components/shop/ShopDetailForm'
import { I18nNamespaceEnum } from '@/constants/i18n'
import ShopDetailContainer from '@/containers/shop/ShopDetailContainer'

const pageShopDetailI18nNameSpaces = [I18nNamespaceEnum.Shop, I18nNamespaceEnum.Common]
const PageShopDetailContent = () => {
  const { t } = useTranslation(pageShopDetailI18nNameSpaces)
  const {
    formControl,
    isShopLoading,
    disabledNames,
    siteSelectOptions,
    nodeSelectOptions,
    onSubmit,
    submitErrorMessage,
    pullToRefreshStatus
  } = ShopDetailContainer.useContainer()

  const { control } = formControl

  if (isShopLoading) {
    return null
  }

  return (
    <MainLayout title="가게 상세" pullToRefreshStatus={pullToRefreshStatus}>
      <ShopDetailForm
        formControl={formControl}
        disabledNames={disabledNames}
        nodeSelectOptions={nodeSelectOptions}
        siteSelectOptions={siteSelectOptions}
        onSubmit={onSubmit}>
        <div className="col-span-6 flex w-full flex-col gap-6">
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
          <button className="btn-primary btn flex-1" type="submit" /* disabled={!isValid} */>
            {t('shop:update_shop')}
          </button>
        </div>
      </ShopDetailForm>
      <FormDevTools control={control} />
    </MainLayout>
  )
}

const PageShopDetail = () => {
  return (
    <ShopDetailContainer.Provider>
      <PageShopDetailContent />
    </ShopDetailContainer.Provider>
  )
}

export const getStaticPaths = () => {
  return { paths: [], fallback: true }
}
export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageShopDetailI18nNameSpaces))
    }
  }
}

export default PageShopDetail
