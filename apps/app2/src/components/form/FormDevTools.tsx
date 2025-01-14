import { useEffect, useState } from 'react'
import { DevTool } from '@hookform/devtools'
import { Control, FieldValues } from 'react-hook-form'

interface FormDevToolsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
}

const FormDevTools = <TFieldValues extends FieldValues>({ control }: FormDevToolsProps<TFieldValues>) => {
  const [isDevToolEnabled, setIsDevToolEnabled] = useState<boolean>(false)

  useEffect(() => {
    setIsDevToolEnabled(process.env.NODE_ENV !== 'production')
  }, [])

  if (!isDevToolEnabled) {
    return null
  }

  return <DevTool placement={'top-right'} control={control} />
}

export default FormDevTools
