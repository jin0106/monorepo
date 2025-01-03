import { PropsWithChildren } from 'react'

const Subtitle = ({ styleClass, children }: PropsWithChildren<{ styleClass: string }>) => {
  return <div className={`text-xl font-semibold ${styleClass}`}>{children}</div>
}

export default Subtitle
