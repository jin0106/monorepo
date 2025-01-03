// 마지막 아이템에 ref를 걸어서 해당 아이템이 10% 만 보여도 다음 리스트를 요청하고
// 한번 요청했다면 그만 요청하기

import { ReactNode, useCallback, useEffect, useRef } from 'react'

import { InfiniteData } from '@tanstack/query-core'
import isEmpty from 'lodash/isEmpty'
import { PaginatedGenericResList } from '@/hooks/common/useInfinityScroll'

type InfiniteItemType<TResItem> = {
  itemRes: TResItem
}

type InfiniteContainerProps<TResItem> = {
  threshold: number
  scrollData: InfiniteData<PaginatedGenericResList<TResItem>> | undefined
  fetchNextPage(): void
  children: (props: InfiniteItemType<TResItem>) => ReactNode
  className?: string
  listClassName?: string
  emptyContent?: ReactNode
}

const InfiniteContainer = <TResItem extends Record<string, any>>({
  threshold,
  scrollData,
  fetchNextPage,
  children,
  className,
  listClassName,
  emptyContent
}: InfiniteContainerProps<TResItem>) => {
  const intersectionTarget = useRef<HTMLLIElement>(null)
  const hasNext = !!scrollData?.pages?.[0].next

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        entry.isIntersecting && hasNext && fetchNextPage()
      })
    },
    [scrollData]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: threshold
    })

    if (intersectionTarget.current) {
      observer.observe(intersectionTarget.current)
    }

    return () => {
      observer.disconnect()
      if (intersectionTarget.current) {
        observer.unobserve(intersectionTarget.current)
      }
    }
  }, [scrollData])

  if (isEmpty(scrollData?.pages) || scrollData?.pages?.[0]?.count === 0) {
    return <>{emptyContent}</>
  }

  return (
    <ul className={className}>
      {scrollData?.pages?.map((page, pageIndex) => {
        return page.results?.map((item, itemIndex) => {
          const isLast = scrollData?.pages.length === pageIndex + 1 && page.results?.length === itemIndex + 1
          return (
            <li className={listClassName} key={item.id} ref={isLast ? intersectionTarget : null}>
              {children({ itemRes: item })}
            </li>
          )
        })
      })}
    </ul>
  )
}

export default InfiniteContainer
