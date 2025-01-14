import { useTranslation } from 'next-i18next'
import Icon from '@/components/common/Icon'
import { I18nNamespaceEnum } from '@/constants/i18n'
import { IconNamesEnum } from '@/constants/iconNames.enum'

const MENU_EXCEL_FORM_S3_URL =
  'https://neubie-common.s3.ap-northeast-2.amazonaws.com/file/menu/%E1%84%86%E1%85%A6%E1%84%82%E1%85%B2+%E1%84%8E%E1%85%AE%E1%84%80%E1%85%A1+%E1%84%8B%E1%85%A3%E1%86%BC%E1%84%89%E1%85%B5%E1%86%A8.xlsx'
const MenuExcelDownLoad = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Menu])
  const handleClick = () => {
    window.open(MENU_EXCEL_FORM_S3_URL)
  }

  return (
    <div className="flex h-[68px] w-full items-center justify-between rounded-[8px] bg-[#2B303B] px-[16px]">
      <div className="flex items-center gap-[12px]">
        <span className="text-[16px] font-medium text-white">{t('menu:excel-upload.title')}</span>
        <span className="text-[12px] text-white/30">{t('menu:excel-upload.sub-title')}</span>
      </div>
      <button className="btn-md btn ml-4 flex h-5 gap-[4px] bg-[#00B45A] text-white" onClick={handleClick}>
        <Icon name={IconNamesEnum.FileList} className="h-[16px] w-[16px]" />
        {t('menu:excel-upload.button')}
      </button>
    </div>
  )
}

export default MenuExcelDownLoad
