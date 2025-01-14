import Link from 'next/link'
import { Routes } from '@/constants/routes'

const Page404 = () => {
  return (
    <div className="flex w-full justify-center pt-[120px]">
      <img src="/404.png" className="h-[600px] w-[500px]" />
      <div className="mt-[120px] flex flex-col items-center text-center">
        <p className="max-h-[100px] text-[80px] font-[500] text-white">404</p>
        <p className="text-[20px] font-[500] text-white">Page Not Found</p>
        <p className="mt-4 text-[18px] font-[500] text-white">페이지를 찾을수 없습니다</p>
        <Link href={Routes.Order.List}>
          <button className="btn-info btn mt-4 max-w-[130px] text-white">홈으로 가기</button>
        </Link>
      </div>
    </div>
  )
}

export default Page404
