import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import isEmpty from 'lodash/isEmpty'
import Icon from '@/components/common/Icon'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import { DropDownPropsType } from '@/hooks/common/useDropDown'

export enum DropDownDirectionEnum {
  Up = 'Up',
  Down = 'Down'
}

type DropDownProps = {
  defaultItemText: string
  dropDownControls: DropDownPropsType
  direction?: DropDownDirectionEnum
  disabled?: boolean
  isResetSelection?: boolean
}

/**
 * 디자인 시스템을 따르는 DropDown 입니다.
 * @link: https://www.figma.com/file/bnWIiHfgHgV5QyiVP5ek8t/Design-System?node-id=125-1075&t=6kw3ARvFp25quxV3-0
 *
 * @param defaultItemText 기본 아이템 텍스트 입니다.
 * @param dropDownProps 드롭다운 props
 * @param direction 드롭다운의 방향입니다.
 * @param disabled 드롭다운 활성화 여부를 결정합니다
 * @param isResetSelection 아이템 선택하지 않을시, 미선택 상태로 되돌릴지 여부를 결정합니다
 * @param children
 */

const DaisyDropDown = ({
  defaultItemText,
  dropDownControls,
  direction = DropDownDirectionEnum.Up,
  disabled = false,
  isResetSelection = true,
  children
}: PropsWithChildren<DropDownProps>) => {
  const { mount, isOpen, controls, selectedItem, handleOpen, handleClose, setSelectedItem } = dropDownControls
  const isReverse = direction === DropDownDirectionEnum.Down
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleClickDefaultItem = () => {
    if (disabled) {
      return
    }
    if (isOpen) {
      if (isResetSelection) {
        setSelectedItem(undefined)
      }
      handleClose()
    } else {
      handleOpen()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="h-54 relative w-full cursor-pointer" ref={dropdownRef}>
      {mount && (
        <motion.div
          animate={controls}
          initial="hidden"
          transition={{
            damping: 40,
            stiffness: 600,
            type: 'spring'
          }}
          variants={{
            hidden: { opacity: 0, y: 0 },
            visible: { opacity: 1, y: direction === DropDownDirectionEnum.Up ? -54 : 54 }
          }}
          className={classNames(
            'absolute z-[100] flex w-full flex-col overflow-hidden border-[1px] border-base-content/30 bg-base-100',
            {
              'bottom-[0px] rounded-t-[8px] border-b-[0px]': !isReverse
            },
            {
              'top-[0px] rounded-b-[8px] border-t-[0px]': isReverse
            }
          )}>
          {children}
        </motion.div>
      )}
      <div
        className={classNames(
          `flex h-[54px] w-full items-center justify-between rounded-[8px]  ${
            disabled ? 'border-none' : ' border-[1px] border-base-content/30'
          } bg-base-100 px-[12px] py-[12px]`,
          {
            'border-t-content/30 rounded-t-[0px] border-base-content/30': isOpen && !isReverse
          },
          {
            'border-b-content/30 rounded-b-[0px] border-base-content/30': isOpen && isReverse
          }
        )}
        onClick={handleClickDefaultItem}>
        <span
          className={classNames(`text-[16px] ${disabled ? 'text-base-content/30' : ''}`, {
            'font-bold text-base-content': selectedItem && !isOpen
          })}>
          {selectedItem ? (isOpen ? defaultItemText : selectedItem.content) : defaultItemText}
        </span>
        <Icon
          name={isOpen ? IconNamesEnum.ChevronUp : IconNamesEnum.ChevronDown}
          className={`h-[24px] w-[24px] ${disabled ? 'text-base-content/30' : ''}`}
        />
      </div>
    </div>
  )
}

type DropDownSearchProps = {
  dropDownProps: DropDownPropsType
  searchPlaceHolder: string
}
const DropDownSearch = ({ dropDownProps, searchPlaceHolder }: DropDownSearchProps) => {
  const { searchText, setSearchText } = dropDownProps
  const [searchInput] = useState<string | undefined>(searchText)
  const inputTextRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      setSearchText(undefined)
    }
  }, [])

  return (
    <div className="flex w-full cursor-default items-center justify-between px-[12px] py-[12px]">
      <div
        className={classNames('flex w-full items-center justify-between rounded-[8px] bg-base-200 px-[12px] py-[8px]', {
          'text-base-content/30': !isEmpty(searchText)
        })}>
        <div className="flex gap-[4px]">
          <Icon name={IconNamesEnum.Search} className="h-[20px] w-[20px]" />
          <input
            type="text"
            className="w-[240px] bg-base-200 text-[16px] outline-none outline-0"
            inputMode="search"
            placeholder={searchPlaceHolder}
            defaultValue={searchInput}
            value={searchInput}
            ref={inputTextRef}
            onClick={(e) => {
              e.preventDefault()
              if (searchText === searchPlaceHolder) {
                setSearchText(undefined)
              }
            }}
            onChange={(e) => {
              e.preventDefault()
              setSearchText(e.target.value)
            }}
          />
        </div>
        {!isEmpty(searchText) && (
          <button
            className="flex h-full w-fit items-center"
            onClick={() => {
              setSearchText(undefined)
              if (!inputTextRef.current) {
                return
              }
              inputTextRef.current.focus({ preventScroll: true })
              inputTextRef.current.value = ''
            }}>
            <Icon name={IconNamesEnum.Delete} className="h-[20px] w-[20px] text-gray-300" />
          </button>
        )}
      </div>
    </div>
  )
}

type DropDownItemProps = {
  dropDownProps: DropDownPropsType
  itemContent: {
    id: string
    content: ReactNode
  }
}

const DropDownItem = ({ dropDownProps, itemContent }: DropDownItemProps) => {
  const { setSelectedItem, selectedItem, handleClose, optionList } = dropDownProps

  return (
    <div
      className={classNames(
        'flex w-full items-center justify-between px-[12px] py-[12px] text-[16px] text-gray-500 hover:bg-base-200 hover:font-bold hover:text-base-content',
        {
          'bg-base-300 font-bold text-base-content': selectedItem?.id === itemContent.id
        }
      )}
      onClick={() => {
        const targetItem = optionList?.find((option) => option.id === itemContent.id)
        if (targetItem) {
          setSelectedItem(targetItem)
        }
        handleClose()
      }}>
      {itemContent.content}
    </div>
  )
}

const DropDownList = ({ children }: PropsWithChildren) => {
  return <ul className="flex h-fit max-h-[220px] w-full flex-col overflow-y-scroll ">{children}</ul>
}

export const searchTextHighLight = (text: string, searchText?: string) => {
  if (!searchText) {
    return <span>{text}</span>
  }

  const textArr = text
    .replaceAll(searchText, '\n' + searchText + '\n')
    .split('\n')
    .filter((word) => !isEmpty(word))

  return (
    <div className="flex">
      {textArr.map((word, index) => {
        if (word === searchText) {
          return (
            <span key={index} className="text-primary">
              {word}
            </span>
          )
        } else {
          return <span key={index}>{word}</span>
        }
      })}
    </div>
  )
}

DaisyDropDown.Search = DropDownSearch
DaisyDropDown.Item = DropDownItem
DaisyDropDown.List = DropDownList
export default DaisyDropDown
