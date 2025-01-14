import { useMemo } from 'react'
import { GetStaticProps, GetStaticPropsContext } from 'next'
import { TFunction, useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useForm } from 'react-hook-form'
import { createContainer } from 'unstated-next'
import {
  AppVersionsCreateMutationBody,
  AppVersionsPartialUpdateMutationBody,
  useAppVersionsCreate,
  useAppVersionsList,
  useAppVersionsPartialUpdate
} from '@/api/generated/hooks'
import { AppVersionRes, DeviceTypeEnum, UserTypeEnum } from '@/api/generated/types'
import Modal from '@/components/common/modal'
import Table from '@/components/common/tables'
import { TableColumnType, TableContentsType } from '@/components/common/tables/TableContent'
import MainLayout from '@/components/layouts/MainLayout'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import useModal, { ModalPropsType } from '@/hooks/common/useModal'
import Page404 from '@/pages/404'
import { ApiUtils } from '@/utils/apiUtils'

// todo QA 기간 임시대응, 추후 피그마 요구대로 재구현

const pageAppVersionI18nNamespace = [I18nNamespaceEnum.AppVersion, I18nNamespaceEnum.Common]

const AppVersionContainer = createContainer(() => {
  const { t } = useTranslation(pageAppVersionI18nNamespace)
  // list
  const { data: appVersionList, refetch: refetchAppVersionList } = useAppVersionsList()
  const appVersionListContent: TableContentsType[] = useMemo(
    () =>
      appVersionList?.map((appVersion) => ({
        row: [
          {
            key: 'id',
            content: appVersion?.id
          },
          {
            key: 'deviceType',
            content: appVersion?.deviceType
          },
          {
            key: 'name',
            content: appVersion?.name
          },
          {
            key: 'packageName',
            content: appVersion?.packageName
          },
          {
            key: 'latestVersion',
            content: appVersion?.latestVersion
          },
          {
            key: 'minimumVersion',
            content: appVersion?.minimumVersion
          },
          {
            key: 'update',
            content: (
              <button
                className="btn-info btn"
                onClick={async () => {
                  await appVersionUpdateModal.setModalData({ appVersion })
                  await appVersionUpdateModal.handleOpen()
                }}>
                {t('common:update')}
              </button>
            )
          }
        ]
      })) || [],
    [appVersionList]
  )

  // create
  const appVersionCreateModal = useModal()
  const { mutate: mutateAppVersionCreate } = useAppVersionsCreate({
    mutation: {
      onSuccess: () => {
        refetchAppVersionList()
        appVersionCreateModal.handleClose()
        createFormMethods.reset()
      },
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
        appVersionCreateModal.handleClose()
        createFormMethods.reset()
      }
    }
  })
  const createFormMethods = useForm<AppVersionsCreateMutationBody>()

  // update
  const appVersionUpdateModal = useModal()
  const { mutate: mutateAppVersionUpdate } = useAppVersionsPartialUpdate({
    mutation: {
      onSuccess: () => {
        refetchAppVersionList()
        appVersionUpdateModal.handleClose()
      },
      onError: (error) => {
        ApiUtils.onErrorAlert(error)
        appVersionUpdateModal.handleClose()
      }
    }
  })

  return {
    appVersionListContent,
    appVersionListCount: appVersionList?.length,

    appVersionCreateModal,
    mutateAppVersionCreate,
    createFormMethods,

    appVersionUpdateModal,
    mutateAppVersionUpdate
  }
})

const AppVersionListColumns: TableColumnType[] = [
  { title: '번호 ', key: 'id' },
  { title: '구분 ', key: 'deviceType' },
  { title: '이름 ', key: 'name' },
  { title: '패키지네임 ', key: 'packageName' },
  { title: '최신버전 ', key: 'latestVersion' },
  { title: '최소버전 ', key: 'minimumVersion' },
  { title: '수정', key: 'update' }
]

const getAppVersionListColumns = (t: TFunction): TableColumnType[] => {
  return [
    { title: t('app_version:id'), key: 'id' },
    { title: t('app_version:device_type'), key: 'deviceType' },
    { title: t('app_version:name'), key: 'name' },
    { title: t('app_version:package_name'), key: 'packageName' },
    { title: t('app_version:latest_version'), key: 'latestVersion' },
    { title: t('app_version:minimum_version'), key: 'minimumVersion' },
    { title: t('app_version:update'), key: 'update' }
  ]
}

const PageAppVersionContent = () => {
  const { t } = useTranslation(pageAppVersionI18nNamespace)
  const { appVersionCreateModal, appVersionListContent, appVersionUpdateModal } = AppVersionContainer.useContainer()
  return (
    <MainLayout>
      <Table>
        <Table.Header
          title={t('app_version:title')}
          rightSide={
            <button
              className="btn-info btn font-normal text-white"
              onClick={() => {
                appVersionCreateModal.handleOpen()
              }}>
              {t('app_version:add_app_version')}
            </button>
          }
        />
        <Table.Content
          columns={getAppVersionListColumns(t)}
          contents={appVersionListContent}
          emptyElement={t('app_version:empty_version')}
        />
      </Table>
      <AppVersionCreateModal modalControls={appVersionCreateModal} />
      <AppVersionUpdateModal modalControls={appVersionUpdateModal} />
    </MainLayout>
  )
}

const AppVersionCreateModal = ({ modalControls }: { modalControls: ModalPropsType }) => {
  const { t } = useTranslation(pageAppVersionI18nNamespace)
  const { mutateAppVersionCreate, createFormMethods } = AppVersionContainer.useContainer()
  const { register, handleSubmit } = createFormMethods
  const onSubmit = handleSubmit((data) => {
    const versionRegex = /^\d+(\.\d+){2}$/
    if (!versionRegex.test(data?.minimumVersion ?? '')) {
      alert(t('app_version:alert.minimum_version_error'))
      return
    }
    if (!versionRegex.test(data?.latestVersion ?? '')) {
      alert(t('app_version:alert.latest_version_error'))
      return
    }
    mutateAppVersionCreate({ data })
  })
  return (
    <Modal modalProps={modalControls}>
      <Modal.Header title={t('app_version:modal.create.title')} />
      <form onSubmit={onSubmit}>
        <div className="">
          <div className="mt-8">
            <select {...register('deviceType')} className="input-bordered select">
              <option value="ANDROID">{t('app_version:android')}</option>
              <option value="IOS">iOS</option>
            </select>
            <div className="mt-8">
              <label className="label flex">
                <span className="label-text">{t('app_version:modal.create.name')}</span>
                <input className="input border border-info" {...register('name')} />
              </label>
              <label className="label flex">
                <span className="label-text">{t('app_version:modal.create.package_name')}</span>
                <input className="input border border-info" {...register('packageName')} />
              </label>
              <label className="label flex">
                <span className="label-text">{`${t('app_version:modal.create.minimum_version')}(${t(
                  'app_version:modal.create.mandatory_update'
                )})`}</span>
                <input className="input border border-info" {...register('minimumVersion')} />
              </label>
              <label className="label flex">
                <span className="label-text">{`${t('app_version:modal.create.latest_version')}(${t(
                  'app_version:modal.create.optional_update'
                )})`}</span>
                <input className="input border border-info" {...register('latestVersion')} />
              </label>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button className="btn-info btn-wide btn">{t('app_version:modal.create.add')}</button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

const AppVersionUpdateModal = ({ modalControls }: { modalControls: ModalPropsType }) => {
  const { t } = useTranslation(pageAppVersionI18nNamespace)
  const appVersion = modalControls?.modalData?.appVersion as AppVersionRes
  const { mutateAppVersionUpdate } = AppVersionContainer.useContainer()
  const { register, handleSubmit } = useForm<AppVersionsPartialUpdateMutationBody>({
    values: {
      name: appVersion?.name,
      latestVersion: appVersion?.latestVersion,
      minimumVersion: appVersion?.minimumVersion
    }
  })
  const onSubmit = handleSubmit((data) => {
    const versionRegex = /^\d+(\.\d+){2}$/
    if (!versionRegex.test(data?.minimumVersion ?? '')) {
      alert(t('app_version:alert.minimum_version_error'))
      return
    }
    if (!versionRegex.test(data?.latestVersion ?? '')) {
      alert(t('app_version:alert.latest_version_error'))
      return
    }
    mutateAppVersionUpdate({ data, id: appVersion?.id })
  })
  return (
    <Modal modalProps={modalControls}>
      <Modal.Header title={t('app_version:modal.update.title')} />
      <form onSubmit={onSubmit}>
        <div className="">
          <div className="mt-8">
            <select disabled className="input-bordered select">
              <option value="ANDROID" selected={appVersion?.deviceType === DeviceTypeEnum.ANDROID}>
                {t('app_version:android')}
              </option>
              <option value="IOS" selected={appVersion?.deviceType === DeviceTypeEnum.IOS}>
                iOS
              </option>
            </select>
            <div className="mt-8">
              <label className="label flex">
                <span className="label-text">{t('app_version:modal.update.name')}</span>
                <input className="input border border-info" {...register('name')} />
              </label>
              <label className="label flex">
                <span className="label-text">{t('app_version:modal.update.package_name')}</span>
                <input className="input border border-info" disabled value={appVersion?.packageName} />
              </label>
              <label className="label flex">
                <span className="label-text">{`${t('app_version:modal.update.minimum_version')}(${t(
                  'app_version:modal.update.mandatory_update'
                )})`}</span>
                <input className="input border border-info" {...register('minimumVersion')} />
              </label>
              <label className="label flex">
                <span className="label-text">{`${t('app_version:modal.update.latest_version')}(${t(
                  'app_version:modal.update.optional_update'
                )})`}</span>
                <input className="input border border-info" {...register('latestVersion')} />
              </label>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button className="btn-info btn-wide btn">{t('app_version:modal.update.add')}</button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }: GetStaticPropsContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale as string, pageAppVersionI18nNamespace))
    }
  }
}

const PageAppVersion = () => {
  return (
    <AppVersionContainer.Provider>
      <Permission allowAdminTypes={[UserTypeEnum.ADMIN]} disallowElement={<Page404 />}>
        <PageAppVersionContent />
      </Permission>
    </AppVersionContainer.Provider>
  )
}

export default PageAppVersion
