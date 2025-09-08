import { useEffect } from 'react'
import { toast } from 'sonner'

export function useToastError(error: unknown, message: string) {
  useEffect(() => {
    if (error) {
      console.error(message, error)
      toast.error(message)
    }
  }, [error, message])
}
