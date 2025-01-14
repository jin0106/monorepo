import classNames from 'classnames'
type StatusPointType = {
  active: boolean
}
const StatusPoint = ({ active }: StatusPointType) => {
  return (
    <div
      className={classNames('h-2 w-2 rounded-full', {
        'bg-green-600': active,
        'bg-base-content opacity-10': !active
      })}
    />
  )
}

export default StatusPoint
