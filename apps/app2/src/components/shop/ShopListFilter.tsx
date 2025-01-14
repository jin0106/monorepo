import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { I18nNamespaceEnum } from '@/constants/i18n'
import ShopContainer from '@/containers/shop/ShopContainer'

type ShopListFilterFormType = {
  site: number
}

const ShopListFilter = () => {
  const { t } = useTranslation(I18nNamespaceEnum.Common)
  const { sites, isSitesLoading, setSearchParams } = ShopContainer.useContainer()
  const { register, handleSubmit } = useForm<ShopListFilterFormType>()
  const onSubmit = handleSubmit((data) => {
    setSearchParams({ sites: [data.site] })
  })

  if (isSitesLoading) {
    return null
  }

  return (
    <form className="my-3 flex flex-wrap gap-2" onChange={onSubmit}>
      <div>
        <label className="label">
          <span className="label-text text-base-content">{t('common:filter.select_site')}</span>
        </label>
        <select className="select-bordered select" {...register('site')}>
          <option value="">{t('common:filter.all_sites')}</option>
          {sites.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            )
          })}
        </select>
      </div>
    </form>
  )
}

export default ShopListFilter
