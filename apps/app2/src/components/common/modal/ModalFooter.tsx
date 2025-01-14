import React, { PropsWithChildren } from 'react'

const ModalFooter = ({ children }: PropsWithChildren) => {
  return <footer className="mt-4 flex w-full justify-center">{children ?? null}</footer>
}

export default ModalFooter
