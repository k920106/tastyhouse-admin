'use client'

import { ReactNode, createContext, useContext } from 'react'
import {
  useNoticeSearchWithQuery,
  NoticeSearchWithQueryHookResult,
} from '@/src/hooks/notice/useNoticeSearchWithQuery'

type NoticeSearchContextValue = NoticeSearchWithQueryHookResult

const NoticeSearchContext = createContext<NoticeSearchContextValue | null>(null)

interface NoticeSearchProviderProps {
  children: ReactNode
}

export function NoticeSearchProvider({ children }: NoticeSearchProviderProps) {
  const value = useNoticeSearchWithQuery()

  return <NoticeSearchContext.Provider value={value}>{children}</NoticeSearchContext.Provider>
}

export function useNoticeSearchContext() {
  const context = useContext(NoticeSearchContext)
  if (!context) {
    throw new Error('useNoticeSearchContext must be used within NoticeSearchProvider')
  }
  return context
}
