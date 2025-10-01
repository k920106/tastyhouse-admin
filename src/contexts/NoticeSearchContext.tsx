'use client'

import { createContext, useContext, ReactNode } from 'react'

interface NoticeSearchContextValue {
  isLoading: boolean
}

const NoticeSearchContext = createContext<NoticeSearchContextValue | null>(null)

interface NoticeSearchProviderProps {
  children: ReactNode
  isLoading: boolean
}

export function NoticeSearchProvider({ children, isLoading }: NoticeSearchProviderProps) {
  return (
    <NoticeSearchContext.Provider value={{ isLoading }}>
      {children}
    </NoticeSearchContext.Provider>
  )
}

export function useNoticeSearchContext() {
  const context = useContext(NoticeSearchContext)
  if (!context) {
    throw new Error('useNoticeSearchContext must be used within NoticeSearchProvider')
  }
  return context
}
