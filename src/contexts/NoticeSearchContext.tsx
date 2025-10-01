'use client'

import { NoticeSearchWithQueryHookResult } from '@/src/hooks/notice/useNoticeSearchWithQuery'
import { ReactNode, createContext, useContext } from 'react'

type NoticeSearchContextValue = NoticeSearchWithQueryHookResult

const NoticeSearchContext = createContext<NoticeSearchContextValue | null>(null)

interface NoticeSearchProviderProps {
  children: ReactNode
  value: NoticeSearchWithQueryHookResult
}

export function NoticeSearchProvider({ children, value }: NoticeSearchProviderProps) {
  return <NoticeSearchContext.Provider value={value}>{children}</NoticeSearchContext.Provider>
}

export function useNoticeSearchContext() {
  const context = useContext(NoticeSearchContext)
  if (!context) {
    throw new Error('useNoticeSearchContext must be used within NoticeSearchProvider')
  }
  return context
}
