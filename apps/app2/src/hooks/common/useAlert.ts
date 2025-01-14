import { Dispatch, SetStateAction, useEffect, useId, useRef, useState } from 'react'
import { isAndroid } from 'react-device-detect'
import NativeBridgeContainer from '@/containers/common/NativeBridgeContainer'

export type AlertPropsType<T = any> = {
  isOpen: boolean
  handleOpen(): void
  mount: boolean
  alertData: T
  setAlertData: Dispatch<SetStateAction<T>>
  initAlert(): void
}

const useAlert = <T = unknown>(): AlertPropsType<T> => {
  const keyId = useId()
  const backKeyHandlingKeyRef = useRef(`alert-${keyId}`)
  const { addBackKeyHandler, removeBackHandler } = NativeBridgeContainer.useContainer()
  const [isOpen, setIsOpen] = useState(false)
  const [mount, setMount] = useState(false)
  const [alertData, setAlertData] = useState(<T>{})
  const closeAnimationTimeId = useRef<NodeJS.Timeout>()
  const unmountTimeId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (isOpen) {
        removeBackHandler(backKeyHandlingKeyRef.current)
      }
    }
  }, [isOpen])

  const setIsOpenWrapper = (isOpenNew: boolean) => {
    if (isAndroid) {
      if (isOpenNew) {
        addBackKeyHandler(backKeyHandlingKeyRef.current, () => {
          setIsOpen(false)
          return true
        })
      } else {
        removeBackHandler(backKeyHandlingKeyRef.current)
      }
    }

    setIsOpen(isOpenNew)
  }

  const initAlert = () => {
    setMount(false)
    setIsOpenWrapper(false)
    setAlertData(<T>{})
    clearTimeout(closeAnimationTimeId.current)
    clearTimeout(unmountTimeId.current)
    closeAnimationTimeId.current = undefined
    unmountTimeId.current = undefined
  }

  const handleOpen = () => {
    if (closeAnimationTimeId.current && unmountTimeId.current) {
      clearTimeout(closeAnimationTimeId.current)
      clearTimeout(unmountTimeId.current)
      closeAnimationTimeId.current = undefined
      unmountTimeId.current = undefined
    }
    // mount
    setMount(true)
    // open animation
    setIsOpenWrapper(true)

    // close animation
    closeAnimationTimeId.current = setTimeout(() => {
      setIsOpenWrapper(false)
    }, 6000)

    // unmount
    unmountTimeId.current = setTimeout(() => {
      setMount(false)
    }, 6300)
  }

  return { isOpen, handleOpen, mount, alertData, setAlertData, initAlert }
}

export default useAlert
