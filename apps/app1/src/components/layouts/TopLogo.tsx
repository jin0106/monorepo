import { useTranslation } from 'next-i18next'
import { I18nNamespaceEnum } from '@/constants/i18n'

const TopLogo = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Common])

  return (
    <li className="mb-2 text-xl font-semibold text-base-content">
      <div>
        <img className="mask mask-squircle w-10" src="/neubie-logo.png" alt="top-logo" />
        {t('common:logo_text')}
      </div>
    </li>
  )
}

export default TopLogo
