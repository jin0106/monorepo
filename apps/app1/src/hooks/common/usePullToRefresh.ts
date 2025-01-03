import { useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { isAndroid, isIOS } from 'react-device-detect'
import { isInApp } from '@/pages/_app'

export enum PullToRefreshStatusEnum {
  // 스와이프 제스처 진행 중
  Pulling = 'Pulling',
  // 스와이프 이동범위가 새로고침이 가능한 범위
  CanRelease = 'CanRelease',
  // 새로고침이 실행되어 진행중
  Refreshing = 'Refreshing',
  // 새로고침이 완료
  Complete = 'Complete'
}

/**
 * 상태 변경에 따라 refreshCallback가 재 정의될 필요가 있으면 useCallback으로 가변되는 상태값들에 따라
 * 함수 정의를 다시하고 이를 통해 usePullToRefresh의 이벤트 등록을 다시해야 합니다.
 */

const iOSScrollThreshHold = -57
const AndroidScrollThreshHold = -200

const usePullToRefresh = (refreshCallback: () => Promise<void>) => {
  const isEventTouchStartRef = useRef<boolean>(false)
  const isCanReleaseScopeScrollRef = useRef<boolean>(false)
  const touchStartPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const [pullToRefreshStatus, setPullToRefreshStatus] = useState<PullToRefreshStatusEnum>(
    PullToRefreshStatusEnum.Complete
  )

  const initPullToRefresh = () => {
    setPullToRefreshStatus(PullToRefreshStatusEnum.Complete)
    isEventTouchStartRef.current = false
    isCanReleaseScopeScrollRef.current = false
    touchStartPositionRef.current.x = 0
    touchStartPositionRef.current.y = 0
  }

  const onIOSTouchStart = () => {
    isEventTouchStartRef.current = true
    setPullToRefreshStatus(PullToRefreshStatusEnum.Pulling)
  }

  const onIOSScroll = debounce(() => {
    if (isEventTouchStartRef.current) {
      if (window.scrollY < iOSScrollThreshHold) {
        isCanReleaseScopeScrollRef.current = true
        setPullToRefreshStatus(PullToRefreshStatusEnum.CanRelease)
      } else {
        isCanReleaseScopeScrollRef.current = false
        setPullToRefreshStatus(PullToRefreshStatusEnum.Pulling)
      }
    }
  }, 50)

  const onIOSTouchEnd = async () => {
    if (isCanReleaseScopeScrollRef.current && isEventTouchStartRef.current) {
      setPullToRefreshStatus(PullToRefreshStatusEnum.Refreshing)
      await refreshCallback()
      initPullToRefresh()
    } else {
      initPullToRefresh()
    }
  }

  const onAndroidTouchStart = (e: TouchEvent) => {
    if (window.scrollY !== 0) return
    isEventTouchStartRef.current = true
    touchStartPositionRef.current.x = e.touches[0].clientX
    touchStartPositionRef.current.y = e.touches[0].clientY
  }

  const onAndroidTouchMove = throttle((e: TouchEvent) => {
    if (!isEventTouchStartRef.current) return
    if (!(touchStartPositionRef.current.x && touchStartPositionRef.current.y)) return
    const movingPositionX = e.touches[0].clientX
    const movingPositionY = e.touches[0].clientY

    const diffX = touchStartPositionRef.current.x - movingPositionX
    const diffY = touchStartPositionRef.current.y - movingPositionY

    // y 축 차이 값이 x 축 차이 값 보다 크고, y 축 차이 값이 -57 스크롤 이하인 경우 pull To Refresh 활성화
    if (Math.abs(diffY) > Math.abs(diffX)) {
      if (diffY < 0) {
        setPullToRefreshStatus(PullToRefreshStatusEnum.Pulling)
      }
      if (diffY < AndroidScrollThreshHold) {
        setPullToRefreshStatus(PullToRefreshStatusEnum.CanRelease)
        isCanReleaseScopeScrollRef.current = true
      }
    }
  }, 50)

  const onAndroidTouchEnd = async () => {
    if (window.scrollY !== 0) {
      initPullToRefresh()
      return
    }

    if (isCanReleaseScopeScrollRef.current && isEventTouchStartRef.current) {
      setPullToRefreshStatus(PullToRefreshStatusEnum.Refreshing)
      await refreshCallback()
      initPullToRefresh()
    } else {
      initPullToRefresh()
    }
  }

  useEffect(() => {
    if (isInApp()) {
      if (isIOS) {
        window.addEventListener('touchstart', onIOSTouchStart)
        window.addEventListener('scroll', onIOSScroll)
        window.addEventListener('touchend', onIOSTouchEnd)
      }
      if (isAndroid) {
        window.addEventListener('touchstart', onAndroidTouchStart)
        window.addEventListener('touchmove', onAndroidTouchMove)
        window.addEventListener('touchend', onAndroidTouchEnd)
      }
    }

    return () => {
      if (isInApp()) {
        if (isIOS) {
          window.removeEventListener('touchstart', onIOSTouchStart)
          window.removeEventListener('scroll', onIOSScroll)
          window.removeEventListener('touchend', onIOSTouchEnd)
        }
        if (isAndroid) {
          window.removeEventListener('touchstart', onAndroidTouchStart)
          window.removeEventListener('touchmove', onAndroidTouchMove)
          window.removeEventListener('touchend', onAndroidTouchEnd)
        }
      }
    }
  }, [refreshCallback])

  return {
    pullToRefreshStatus
  }
}

export default usePullToRefresh
