import { Dispatch, SetStateAction, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { SettlementsSummaryListParams } from '@/api/generated/types'
import { I18nNamespaceEnum } from '@/constants/i18n'
import SettlementContainer from '@/containers/settlement/SettlementContainter'
import useAllSitesList from '@/hooks/query/useAllSitesList'
import useShopsListAll from '@/hooks/query/useShopsListAll'

type SettlementListFilterProps = {
  setSearchParam: Dispatch<SetStateAction<SettlementsSummaryListParams | undefined>>
}

type SettlementListFilterFormType = {
  shop: string
  year: string
}

const SettlementListFilter = ({ setSearchParam }: SettlementListFilterProps) => {
  const { t } = useTranslation([I18nNamespaceEnum.Settlement, I18nNamespaceEnum.Common])
  const { sitesList: siteList } = useAllSitesList()
  const [selectedSite, setSelectedSite] = useState<number>()

  const { shopsList } = useShopsListAll({
    queryParams: { sites: [...(selectedSite ? [selectedSite] : [])] },
    enabled: !!selectedSite
  })

  const { setShopName } = SettlementContainer.useContainer()

  const { register, handleSubmit, resetField } = useForm<SettlementListFilterFormType>()
  const onSubmit = handleSubmit((data) => {
    if (!data?.shop || !data?.year) return
    setSearchParam?.({ shop: parseInt(data.shop), year: parseInt(data.year) })
  })

  return (
    <form className="my-3 flex flex-wrap gap-2" onSubmit={onSubmit}>
      <div>
        <label className="label">
          <span className="label-text text-base-content">{t('common:filter.select_site')}</span>
        </label>
        <select
          className="select-bordered select"
          onChange={(e) => {
            e?.target?.value && setSelectedSite(parseInt(e.target.value))
            resetField('shop')
          }}>
          <option value="">{t('common:filter.all_sites')}</option>
          {siteList.map((option) => {
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
        <select
          className="select-bordered select"
          {...register('shop', {
            onChange: (e) => {
              setShopName(e.target.options[e.target.selectedIndex].text)
            }
          })}>
          <option value="">{t('common:filter.all_shop')}</option>
          {shopsList.map((option) => {
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
          <span className="label-text text-base-content">{t('common:filter.year')}</span>
        </label>
        <select className="select-bordered select" {...register('year')}>
          <option value="">{t('common:filter.select_year')}</option>
          {Array(10)
            .fill(undefined)
            .map((_, i) => {
              const year = dayjs().year() - i
              return (
                <option key={i} value={year}>
                  {year}
                </option>
              )
            })}
        </select>
      </div>
      <div className="flex items-end">
        <button type="submit" className="btn-md btn">
          <MagnifyingGlassIcon className="h-[25px] w-[25px]" />
        </button>
      </div>
    </form>
  )
}

export default SettlementListFilter
