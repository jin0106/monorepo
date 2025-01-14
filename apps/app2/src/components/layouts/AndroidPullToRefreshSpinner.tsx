import { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import Portal from '@/components/layouts/Portal'
import Spinner from '@/components/layouts/Spinner'
import { PullToRefreshStatusEnum } from '@/hooks/common/usePullToRefresh'

type PullToRefreshSpinnerProps = {
  pullToRefreshStatus?: PullToRefreshStatusEnum
}
const AndroidPullToRefreshSpinner = ({ pullToRefreshStatus }: PullToRefreshSpinnerProps) => {
  const controls = useAnimation()

  useEffect(() => {
    if (pullToRefreshStatus === PullToRefreshStatusEnum.Pulling) {
      controls.start('visible')
    }
    if (pullToRefreshStatus === PullToRefreshStatusEnum.Complete) {
      controls.start('hidden')
    }
  }, [pullToRefreshStatus])

  if (!pullToRefreshStatus) {
    return null
  }

  return (
    <Portal id="pullToRefresh">
      <motion.div
        animate={controls}
        initial="hidden"
        role="dialog"
        transition={{
          damping: 40,
          stiffness: 400,
          type: 'spring',
          duration: 1
        }}
        variants={{
          hidden: { y: -200 },
          visible: { y: 0 }
        }}
        className={
          'fixed left-[45%] top-[100px] z-[110] flex items-center justify-center rounded-[50%] bg-base-200 p-[20px]'
        }>
        <Spinner
          className={
            [PullToRefreshStatusEnum.CanRelease, PullToRefreshStatusEnum.Refreshing].includes(pullToRefreshStatus)
              ? 'text-primary'
              : 'text-gray-300'
          }
        />
      </motion.div>
    </Portal>
  )
}

export default AndroidPullToRefreshSpinner
