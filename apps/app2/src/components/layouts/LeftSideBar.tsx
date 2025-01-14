import { QueueListIcon } from '@heroicons/react/20/solid'
import {
  BuildingStorefrontIcon,
  CircleStackIcon,
  DocumentTextIcon,
  LockClosedIcon,
  UserGroupIcon,
  WrenchIcon
} from '@heroicons/react/24/outline'
import { useTranslation } from 'next-i18next'
import { UserTypeEnum } from '@/api/generated/types'
import SideMultiMenu from '@/components/layouts/SideMultiMenu'
import SideSingleMenu from '@/components/layouts/SideSingleMenu'
import TopLogo from '@/components/layouts/TopLogo'
import Permission from '@/components/permission/Permission'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { getUserTypeEnumText } from '@/constants/orderStatusText'
import { Routes } from '@/constants/routes'
import AuthContainer from '@/containers/common/AuthContainer'
import NativeBridgeContainer from '@/containers/common/NativeBridgeContainer'

const LeftSideBar = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Common])
  const { logout, adminInfo, hasDocumentPermission } = AuthContainer.useContainer()
  const { pushToken } = NativeBridgeContainer.useContainer()

  return (
    <div className="drawer-side flex flex-col">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay" />
      <ul className="menu w-60 bg-base-100">
        <TopLogo />
        <div className="w-full pb-4 pl-6">
          <p style={{ overflowWrap: 'anywhere' }}>
            {adminInfo?.name || ''} {adminInfo?.email && `(${adminInfo?.email})`}
          </p>
          {adminInfo?.userType && <p>{getUserTypeEnumText(t, adminInfo?.userType)}</p>}
        </div>
        <Permission allowAdminTypes={[UserTypeEnum.ADMIN]}>
          <SideSingleMenu
            icon={<UserGroupIcon className="h-5 w-5" />}
            title={t('common:menu.member')}
            link={Routes.Member}
          />
        </Permission>
        <SideSingleMenu
          icon={<BuildingStorefrontIcon className="h-5 w-5" />}
          title={t('common:menu.shop')}
          link={Routes.Shop.List}
        />
        <SideSingleMenu icon={<QueueListIcon className="h-5 w-5" />} title={t('common:menu.menu')} link={Routes.Menu} />
        <SideMultiMenu
          icon={<DocumentTextIcon className="h-5 w-5" />}
          title={t('common:menu.order')}
          subMenu={[
            { title: t('common:menu.neubie_order'), link: Routes.Order.List },
            ...(adminInfo?.userType === UserTypeEnum.ADMIN
              ? [{ title: t('common:menu.manual_order'), link: Routes.Order.Manual }]
              : []),
            ...(hasDocumentPermission()
              ? [{ title: t('common:menu.document_order'), link: Routes.Order.Document }]
              : [])
          ]}
        />
        <Permission allowAdminTypes={[UserTypeEnum.ADMIN]}>
          <SideSingleMenu
            icon={<WrenchIcon className="h-5 w-5" />}
            title={t('common:menu.app_version')}
            link={Routes.AppVersion}
          />
        </Permission>
        <Permission allowAdminTypes={[UserTypeEnum.ADMIN]}>
          <SideSingleMenu
            icon={<CircleStackIcon className="h-5 w-5" />}
            title={t('common:menu.settlement')}
            link={Routes.Settlement}
          />
        </Permission>
        <div className="h-12"></div>
        <li>
          <span
            className="font-normal"
            onClick={(e) => {
              e.preventDefault()
              logout(pushToken?.deviceNumber)
            }}>
            <LockClosedIcon className="h-5 w-5" />
            {t('common:logout')}
          </span>
        </li>
      </ul>
    </div>
  )
}

export default LeftSideBar
