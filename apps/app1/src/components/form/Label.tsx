import { ReactElement } from 'react'

export interface LabelProps {
  /**
   * 라벨의 타이틀
   */
  title: string | ReactElement
  /**
   * 필수 여부
   */
  isRequired?: boolean
  className?: string
}

const Label = ({ title, isRequired, className }: LabelProps) => {
  return (
    <div className={`flex ${className ?? 'min-w-[120px]'}`}>
      {typeof title === 'string' ? <span>{title}</span> : title}
      {isRequired ? <span className="text-pink-500">&nbsp;*</span> : null}
    </div>
  )
}

export default Label
