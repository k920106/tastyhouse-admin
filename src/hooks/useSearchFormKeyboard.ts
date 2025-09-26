'use client'

import { useCallback } from 'react'

/**
 * 검색 폼에서 키보드 이벤트를 처리하는 커스텀 훅
 * Enter 키 처리 시 자연스러운 UX를 제공
 */
export function useSearchFormKeyboard({
  onSubmit,
  isLoading,
}: {
  onSubmit: () => void
  isLoading: boolean
}) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Enter 키를 누르면 검색 실행
      if (event.key === 'Enter' && !isLoading) {
        event.preventDefault()
        onSubmit()
        // 포커스는 현재 입력 필드에 자연스럽게 유지됨
      }
    },
    [onSubmit, isLoading],
  )

  return { handleKeyDown }
}
