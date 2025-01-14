import React from 'react'
import { ComponentUtils } from '@/utils/design-system/componentUtils'

interface UnderLineTextButtonProps {
  text: string
  onClick: () => void
  className?: string
  disabled?: boolean
}
const UnderLineTextButton = ({ text, onClick, className, disabled = false }: UnderLineTextButtonProps) => {
  return (
    <button
      type="button"
      className={ComponentUtils.cn(
        'whitespace-nowrap text-[14px] text-white underline underline-offset-1',
        disabled && 'cursor-not-allowed text-white/20',
        className
      )}
      onClick={onClick}
      disabled={disabled}>
      {text}
    </button>
  )
}

export default UnderLineTextButton
