import Spinner from '@/components/layouts/Spinner'
import { PullToRefreshStatusEnum } from '@/hooks/common/usePullToRefresh'

type PullToRefreshSpinnerProps = {
  pullToRefreshStatus?: PullToRefreshStatusEnum
}
const PullToRefreshSpinner = ({ pullToRefreshStatus }: PullToRefreshSpinnerProps) => {
  if (!pullToRefreshStatus || pullToRefreshStatus === PullToRefreshStatusEnum.Complete) {
    return null
  }

  return (
    <div className="h-57 flex items-center justify-center">
      <Spinner
        className={
          [PullToRefreshStatusEnum.CanRelease, PullToRefreshStatusEnum.Refreshing].includes(pullToRefreshStatus)
            ? 'text-primary'
            : 'text-gray-300'
        }
      />
    </div>
  )
}

export default PullToRefreshSpinner
