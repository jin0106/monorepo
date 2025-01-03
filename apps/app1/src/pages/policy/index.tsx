import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { AppProps } from 'next/app'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18nNamespaceEnum } from '@/constants/i18n'
import useLocale from '@/hooks/common/useLocale'

enum PolicyTypeEnum {
  ServiceTerms = 'serviceTerms',
  FinancialDealTerms = 'financialDealTerms',
  PrivacyPolicy = 'privacyPolicy'
}

const isHidingFinancialDealTerms = () => process.env.NEXT_PUBLIC_HIDE_FINACIAL_DEAL_TERMS === 'true'

type HTMLMarkupType = {
  __html: string
}

const pagePolicyI18nNamespace = [I18nNamespaceEnum.Common]

const PagePolicyContent = () => {
  const { t } = useTranslation(pagePolicyI18nNamespace)
  const { locale } = useLocale()
  const scrollBoxRef = useRef<HTMLDivElement>(null)
  const [policyType, setPolicyType] = useState<PolicyTypeEnum>(PolicyTypeEnum.ServiceTerms)
  const [policyMarkup, setPolicyMarkup] = useState<HTMLMarkupType>()

  useEffect(() => {
    const updatePolicyMarkup = async () => {
      const data = await axios.get(`/policy/${locale}/${policyType}.html`)
      const markupText = data.data
      setPolicyMarkup({ __html: markupText })
    }

    updatePolicyMarkup()
  }, [locale, policyType])

  return (
    <>
      <div className="flex flex-col">
        <div
          ref={scrollBoxRef}
          className="min-h-64 scrollbar-hide flex w-full flex-nowrap gap-8 overflow-y-hidden overflow-x-scroll scroll-smooth px-16 pb-16 pt-12">
          <button
            className={`body3 btn ${policyType === PolicyTypeEnum.ServiceTerms ? 'btn-primary' : 'btn-natural'}`}
            onClick={() => {
              setPolicyType(PolicyTypeEnum.ServiceTerms)
              scrollBoxRef.current?.scroll({ behavior: 'smooth', left: 0 })
            }}>
            {t('common:terms.service_terms_of_use')}
          </button>
          {!isHidingFinancialDealTerms() && (
            <button
              className={`body3 btn ${
                policyType === PolicyTypeEnum.FinancialDealTerms ? 'btn-primary' : 'btn-natural'
              }`}
              onClick={(e) => {
                setPolicyType(PolicyTypeEnum.FinancialDealTerms)
                e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center' })
              }}>
              {t('common:terms.eft_terms_and_conditions')}
            </button>
          )}
          <button
            className={`body3 btn ${policyType === PolicyTypeEnum.PrivacyPolicy ? 'btn-primary' : 'btn-natural'}`}
            onClick={() => {
              setPolicyType(PolicyTypeEnum.PrivacyPolicy)
              scrollBoxRef.current?.scroll({ behavior: 'smooth', left: 500 })
            }}>
            {t('common:terms.privacy_policy')}
          </button>
        </div>
        <div className="w-full overflow-y-scroll px-16">
          <div dangerouslySetInnerHTML={policyMarkup} />
        </div>
      </div>
    </>
  )
}

const PagePolicy = () => {
  return <PagePolicyContent />
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pagePolicyI18nNamespace))
    }
  }
}

// 기본 레이아웃을 쓰지 않는 경우 추가
PagePolicy.getLayout = (page: AppProps) => page

export default PagePolicy
