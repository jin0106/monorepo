import Icon from '@/components/common/Icon'
import { IconNamesEnum } from '@/constants/iconNames.enum'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

interface IconButtonProps {
  iconName: IconNamesEnum
  text: string
  onClick: () => void
  disabled?: boolean
}

const IconButton = ({ iconName, text, onClick, disabled = false }: IconButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      className={ComponentUtils.cn(
        'flex cursor-pointer items-center gap-[4px] text-white',
        disabled ? 'cursor-not-allowed text-white/20' : 'cursor-pointer'
      )}
      onClick={onClick}>
      <Icon name={iconName} className="h-[16px] w-[16px]" />
      <span className="text-[14px] font-medium">{text}</span>
    </button>
  )
}

export default IconButton
