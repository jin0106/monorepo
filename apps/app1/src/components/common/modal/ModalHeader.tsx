import React, { PropsWithChildren } from 'react'

type ModalHeaderType = {
  title?: string
}

const ModalHeader = ({ children, title }: PropsWithChildren<ModalHeaderType>) => {
  return (
    <header className="flex items-center justify-start gap-2 pb-6">
      {title && <h3 className="text-center text-2xl font-semibold">{title}</h3>}
      {children}
    </header>
  )
}

export default ModalHeader
