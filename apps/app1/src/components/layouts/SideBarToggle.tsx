import { useCallback, useEffect, useRef } from 'react'
import { Bars3Icon } from '@heroicons/react/20/solid'

const SideBarToggle = () => {
  const toggleBtnRef = useRef<HTMLLabelElement>(null)
  const handleClick = useCallback(() => {
    toggleBtnRef.current?.click()
  }, [])

  useEffect(() => {
    if (toggleBtnRef.current) {
      toggleBtnRef.current.addEventListener('mouseover', handleClick)
    }
    return () => {
      toggleBtnRef.current?.removeEventListener('mouseover', handleClick)
    }
  }, [])

  return (
    <label
      ref={toggleBtnRef}
      htmlFor="left-sidebar-drawer"
      className="btn-ghost btn-circle btn"
      data-testid="toggle-sidebar">
      <Bars3Icon className="inline-block h-5 w-5 fill-current" />
    </label>
  )
}

export default SideBarToggle
