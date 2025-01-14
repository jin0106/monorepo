import { PropsWithChildren, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
type PortalProps = {
  id: string
}

const Portal = ({ id, children }: PropsWithChildren<PortalProps>) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) {
    return <></>
  }

  return ReactDOM.createPortal(children, document.getElementById(id) as HTMLElement)
}

export default Portal
