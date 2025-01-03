import React, { PropsWithChildren } from 'react'
import { ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import classNames from 'classnames'
import { AlertPropsType } from '@/hooks/common/useAlert'

export enum AlertTypeEnum {
  Info = 'Info',
  Warning = 'Warning',
  Error = 'Error'
}

export const AlertIcon: { [index: string]: JSX.Element } = {
  [AlertTypeEnum.Info]: <InformationCircleIcon className="h-10 w-10 text-blue-700 " />,
  [AlertTypeEnum.Warning]: <ExclamationTriangleIcon className="h-10 w-10 text-error" />,
  [AlertTypeEnum.Error]: <XCircleIcon className="h-10 w-10 text-error" />
}

type AlertProps = {
  alertProps: AlertPropsType
}

const Alert = ({ alertProps, children }: PropsWithChildren<AlertProps>) => {
  const { mount, isOpen } = alertProps

  if (!mount) {
    return null
  }

  return (
    <div className="fixed top-0 z-[100] flex w-[calc(50vw)] translate-x-1/2 justify-center">
      <div
        className={classNames(
          'w-full shadow-lg',
          {
            'animate-alert-in': isOpen
          },
          {
            'animate-alert-out': !isOpen
          }
        )}>
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

export default Alert
