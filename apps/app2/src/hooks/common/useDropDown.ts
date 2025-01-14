import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { AnimationControls, useAnimation } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'

export type DropDownPropsType = {
  handleOpen(): void
  handleClose(): void
  mount: boolean
  isOpen: boolean
  controls: AnimationControls
  selectedItem?: DropDownContentType
  setSelectedItem: Dispatch<SetStateAction<DropDownContentType | undefined>>
  optionList?: DropDownContentType[]
  setOptionList: Dispatch<SetStateAction<DropDownContentType[] | undefined>>
  searchText?: string
  setSearchText: Dispatch<SetStateAction<string | undefined>>
  searchFilterList?: DropDownContentType[]
  setChangeCallback(callback: (selectedItem?: DropDownContentType) => void): void
}

export type DropDownContentType = {
  id: string
  content: string
}

const useDropDown = (): DropDownPropsType => {
  const [mount, setMount] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const controls = useAnimation()
  const [selectedItem, setSelectedItem] = useState<DropDownContentType>()
  const [searchText, setSearchText] = useState<string>()
  const [optionList, setOptionList] = useState<DropDownContentType[]>()
  const handleChangeCallbackRef = useRef<(selectedItem?: DropDownContentType) => void>()
  const setChangeCallback = (callback: (selectedItem?: DropDownContentType) => void) => {
    handleChangeCallbackRef.current = callback
  }

  const handleOpen = () => {
    setMount(true)
    setTimeout(() => {
      setIsOpen(true)
      controls.start('visible')
    }, 0)
  }

  const handleClose = () => {
    controls.start('hidden')
    setIsOpen(false)

    setTimeout(() => {
      setMount(false)
    }, 300)
  }

  const getSearchFilterList = () => {
    if (isEmpty(searchText) || !searchText) {
      return optionList
    }
    return optionList?.filter((option) => option.content.toLowerCase().includes(searchText.toLowerCase()))
  }

  useEffect(() => {
    handleChangeCallbackRef.current?.(selectedItem)
  }, [selectedItem])

  return {
    handleOpen,
    handleClose,
    mount,
    isOpen,
    selectedItem,
    setSelectedItem,
    optionList,
    setOptionList,
    searchText,
    setSearchText,
    controls,
    setChangeCallback,
    searchFilterList: getSearchFilterList()
  }
}

export default useDropDown
