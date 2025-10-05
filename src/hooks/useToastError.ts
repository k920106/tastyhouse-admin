import { getErrorMessage } from '@/src/types/error'
import { useEffect } from 'react'
import { toast } from 'sonner'

/**
 * 에러 발생 시 Toast 알림을 표시하는 훅
 * @param error 에러 객체
 * @param fallbackMessage 에러 타입을 파싱할 수 없을 때 사용할 기본 메시지
 */
export function useToastError(error: unknown, fallbackMessage?: string) {
  useEffect(() => {
    if (error) {
      const message = getErrorMessage(error, fallbackMessage)
      console.error('[Error]', message, error)
      toast.error(message)
    }
  }, [error, fallbackMessage])
}
