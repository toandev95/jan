import { ReactNode, useCallback, useEffect, useRef } from 'react'

import { ScrollArea } from '@janhq/joi'

type Props = {
  children: ReactNode
}

const ListContainer = ({ children }: Props) => {
  const listRef = useRef<HTMLDivElement>(null)
  const prevScrollTop = useRef(0)
  const isUserManuallyScrollingUp = useRef(false)

  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    const currentScrollTop = event.currentTarget.scrollTop

    if (prevScrollTop.current > currentScrollTop) {
      isUserManuallyScrollingUp.current = true
    } else {
      const currentScrollTop = event.currentTarget.scrollTop
      const scrollHeight = event.currentTarget.scrollHeight
      const clientHeight = event.currentTarget.clientHeight

      if (currentScrollTop + clientHeight >= scrollHeight) {
        isUserManuallyScrollingUp.current = false
      }
    }

    if (isUserManuallyScrollingUp.current === true) {
      event.preventDefault()
      event.stopPropagation()
    }
    prevScrollTop.current = currentScrollTop
  }, [])

  useEffect(() => {
    if (isUserManuallyScrollingUp.current === true || !listRef.current) return
    const scrollHeight = listRef.current?.scrollHeight ?? 0
    listRef.current?.scrollTo({
      top: scrollHeight,
      behavior: 'instant',
    })
  }, [listRef.current?.scrollHeight, isUserManuallyScrollingUp])

  return (
    <ScrollArea
      className="flex h-full w-full flex-col overflow-x-hidden"
      ref={listRef}
      onScroll={handleScroll}
    >
      {children}
    </ScrollArea>
  )
}

export default ListContainer
