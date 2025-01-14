import { useEffect } from 'react'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { Routes } from '@/constants/routes'

const pageHomeI18nNamespaces = [I18nNamespaceEnum.Common]

const Home = () => {
  const { replace } = useRouter()

  useEffect(() => {
    replace(Routes.Order.List)
  }, [])

  return <></>
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageHomeI18nNamespaces))
    }
  }
}

export default Home
