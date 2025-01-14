import Spinner from '@/components/layouts/Spinner'

const LoadingOverlay = () => {
  return (
    <div className="fixed top-0 z-50 flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export default LoadingOverlay
