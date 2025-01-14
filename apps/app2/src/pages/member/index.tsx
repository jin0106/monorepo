import { TFunction } from 'i18next'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Modal from '@/components/common/modal'
import Table from '@/components/common/tables'
import { TableColumnType } from '@/components/common/tables/TableContent'
import MainLayout from '@/components/layouts/MainLayout'
import MemberFilter from '@/components/member/MemberFilter'
import MemberRegisterModal from '@/components/member/MemberRegisterModal'
import { I18nNamespaceEnum } from '@/constants/i18n'
import MemberContainer from '@/containers/member/MemberContainer'

const getUserListColumns = (t: TFunction): TableColumnType[] => {
  return [
    { title: t('member:id'), key: 'id' },
    { title: 'email', key: 'email' },
    { title: t('member:name'), key: 'name' },
    { title: t('member:user_type'), key: 'userType' },
    { title: t('member:created_at'), key: 'createdAt' },
    { title: '', key: 'cascadeUser' }
  ]
}

const pageMemberI18nNamespace = [I18nNamespaceEnum.Member, I18nNamespaceEnum.Common]

const PageMemberContent = () => {
  const { t } = useTranslation(pageMemberI18nNamespace)
  const { memberRegisterModalProps, userListContent, handlePageChange, currentPage, itemCountPerPage, userListCount } =
    MemberContainer.useContainer()
  return (
    <MainLayout>
      <Table>
        <Table.Header
          title={t('common:menu.member')}
          leftSide={<MemberFilter />}
          rightSide={
            <button
              className="btn-info btn font-normal text-white"
              onClick={() => {
                memberRegisterModalProps.handleOpen()
              }}>
              {t('member:cta_create_member')}
            </button>
          }
        />
        <Table.Content
          columns={getUserListColumns(t)}
          contents={userListContent}
          emptyElement={t('member:empty_member')}
        />
        {userListCount !== undefined && (
          <Table.Pagenation
            onPageChange={handlePageChange}
            currentPage={currentPage}
            pagePerCount={itemCountPerPage}
            totalCount={userListCount}
          />
        )}
      </Table>
      <Modal modalProps={memberRegisterModalProps}>
        <MemberRegisterModal modalProps={memberRegisterModalProps} />
      </Modal>
    </MainLayout>
  )
}

const PageMember = () => {
  return (
    <MemberContainer.Provider>
      <PageMemberContent />
    </MemberContainer.Provider>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageMemberI18nNamespace))
    }
  }
}

export default PageMember
