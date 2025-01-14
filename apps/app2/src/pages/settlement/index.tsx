import { GetStaticProps, GetStaticPropsContext } from 'next'
import { TFunction, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { UserTypeEnum } from '@/api/generated/types'
import Table from '@/components/common/tables'
import { TableColumnType } from '@/components/common/tables/TableContent'
import MainLayout from '@/components/layouts/MainLayout'
import Permission from '@/components/permission/Permission'
import SettlementListFilter from '@/components/settlement/SettlementListFilter'
import { I18nNamespaceEnum } from '@/constants/i18n'
import SettlementContainer from '@/containers/settlement/SettlementContainter'
import Page404 from '@/pages/404'

const getColumns = (t: TFunction): TableColumnType[] => {
  return [
    {
      title: t('common:month'),
      key: 'month'
    },
    {
      title: t('common:shop'),
      key: 'shopName'
    },
    {
      title: t('settlement:num_orders'),
      key: 'orderCount'
    },
    {
      title: t('settlement:settlement_price'),
      key: 'settlementAmount'
    },
    {
      title: t('settlement:detail'),
      key: 'detailHistory'
    }
  ]
}

const pageSettlementI18nNamespace = [I18nNamespaceEnum.Settlement, I18nNamespaceEnum.Common]

const PageSettlementContent = () => {
  const { t } = useTranslation(pageSettlementI18nNamespace)
  const { settlementListContent, setSearchParam, pullToRefreshStatus } = SettlementContainer.useContainer()
  return (
    <MainLayout title={t('common:menu.settlement')} pullToRefreshStatus={pullToRefreshStatus}>
      <Table>
        <Table.Header leftSide={<SettlementListFilter setSearchParam={setSearchParam} />} />
        <Table.Content
          columns={getColumns(t)}
          contents={settlementListContent}
          emptyElement={t('settlement:empty_content')}
        />
      </Table>
    </MainLayout>
  )
}

const PageSettlement = () => {
  return (
    <SettlementContainer.Provider>
      <Permission allowAdminTypes={[UserTypeEnum.ADMIN]} disallowElement={<Page404 />}>
        <PageSettlementContent />
      </Permission>
    </SettlementContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageSettlementI18nNamespace))
    }
  }
}

export default PageSettlement
