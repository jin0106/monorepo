import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { I18nNamespaceEnum } from '@/constants/i18n'
import MenuContainer from '@/containers/menu/MenuContainer'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import useShopsListAll from '@/hooks/query/useShopsListAll'

type MenuFilterFormType = {
  site: string
  shop: string
}

const MenuFilter = () => {
  const { t } = useTranslation([I18nNamespaceEnum.Menu, I18nNamespaceEnum.Common])
  // sites
  const { sitesList: sites } = useAllSitesList()
  const [selectedSite, setSelectedSite] = useState<number>()

  // shops
  const { shopsList: shops } = useShopsListAll({
    queryParams: { sites: [...(selectedSite ? [selectedSite] : [])] },
    enabled: !!selectedSite
  })

  const { setSelectedShop, setSelectedCategory } = MenuContainer.useContainer()
  const { register, handleSubmit, resetField, getValues } = useForm<MenuFilterFormType>()
  const onSubmit = handleSubmit((data) => {
    const shopId = parseInt(data?.shop)
    setSelectedShop(shopId ? shopId : undefined)
    setSelectedCategory(undefined)
  })

  return (
    <form className="my-3 flex flex-wrap gap-2" onSubmit={onSubmit}>
      <div>
        <label className="label">
          <span className="label-text text-base-content">{t('common:filter.select_site')}</span>
        </label>
        <select
          className="select-bordered select"
          {...register('site', {
            onChange: (e) => {
              e?.target?.value && setSelectedSite(e.target.value)
              resetField('shop')
            }
          })}>
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
      <div>
        <label className="label">
          <span className="label-text text-base-content">{t('common:filter.select_shop')}</span>
        </label>
        <select className="select-bordered select" {...register('shop')}>
          <option value="">{t('common:filter.all_shop')}</option>
          {shops.map((option) => {
            return (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            )
          })}
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" className=" btn-md btn">
          <MagnifyingGlassIcon className="h-[25px] w-[25px]" />
        </button>
      </div>
    </form>
  )
}

export default MenuFilter
