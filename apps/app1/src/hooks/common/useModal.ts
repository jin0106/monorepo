import { Dispatch, SetStateAction, useEffect, useId, useRef, useState } from 'react'
import { isAndroid } from 'react-device-detect'
import NativeBridgeContainer from '@/containers/common/NativeBridgeContainer'

export type ModalPropsType<T = any> = {
  isOpen: boolean
  handleOpen(): void
  handleClose(): void
  mount: boolean
  modalData: T
  setModalData: Dispatch<SetStateAction<T>>
  setBeforeMountCallback(callback: ModalCallbackType): void
  setBeforeUnmountCallback(callback: ModalCallbackType): void
}

type ModalCallbackType = () => void

const useModal = <T = unknown>(): ModalPropsType<T> => {
  const keyId = useId()
  const backKeyHandlingKeyRef = useRef(`modal-${keyId}`)
  const { addBackKeyHandler, removeBackHandler } = NativeBridgeContainer.useContainer()
  const [isOpen, setIsOpen] = useState(false)
  const [mount, setMount] = useState(false)
  const [modalData, setModalData] = useState<T>(<T>{})
  const beforeMountCallback = useRef<ModalCallbackType>()
  const beforeUnmountCallback = useRef<ModalCallbackType>()

  useEffect(() => {
    return () => {
      if (mount) {
        removeBackHandler(backKeyHandlingKeyRef.current)
      }
    }
  }, [mount])

  const setBeforeMountCallback = (callback: ModalCallbackType) => {
    beforeMountCallback.current = callback
  }
  const setBeforeUnmountCallback = (callback: ModalCallbackType) => {
    beforeUnmountCallback.current = callback
  }

  const handleOpen = () => {
    beforeMountCallback.current?.()
    setMount(true)
    if (isAndroid) {
      addBackKeyHandler(backKeyHandlingKeyRef.current, () => {
        handleClose()
        return true
      })
    }

    setTimeout(() => {
      setIsOpen(true)
    }, 100)
  }

  const handleClose = () => {
    beforeUnmountCallback.current?.()
    setIsOpen(false)
    if (isAndroid) {
      removeBackHandler(backKeyHandlingKeyRef.current)
    }

    setTimeout(() => {
      setModalData(<T>{})
      setMount(false)
    }, 100)
  }

  return {
    isOpen,
    handleOpen,
    handleClose,
    mount,
    modalData,
    setModalData,
    setBeforeMountCallback,
    setBeforeUnmountCallback
  }
}

export default useModal
