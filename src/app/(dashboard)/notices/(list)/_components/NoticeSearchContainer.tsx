'use client'

import { NoticeSearchProvider } from '@/src/contexts/NoticeSearchContext'
import { useNoticeSearchWithQuery } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { ReactNode } from 'react'

interface NoticeSearchContainerProps {
  children: ReactNode
}

export default function NoticeSearchContainer({ children }: NoticeSearchContainerProps) {
  const hookResult = useNoticeSearchWithQuery()

  return <NoticeSearchProvider value={hookResult}>{children}</NoticeSearchProvider>
}
