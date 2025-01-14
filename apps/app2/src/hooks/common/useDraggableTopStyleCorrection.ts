import { useEffect, useRef } from 'react'

const useDraggableTopStyleCorrection = () => {
  const documentBodyHeightRef = useRef<number>()
  const draggableStyleTopCorrectionValue = documentBodyHeightRef.current
    ? (documentBodyHeightRef.current * 12) / 25 - 295
    : 0
  useEffect(() => {
    documentBodyHeightRef.current = document.body.getBoundingClientRect().height
  }, [])

  return {
    draggableStyleTopCorrectionValue
  }
}

export default useDraggableTopStyleCorrection
