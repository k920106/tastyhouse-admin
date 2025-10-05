import { FieldErrors, FieldValues } from 'react-hook-form'
import { toast } from 'sonner'

/**
 * 폼 검증 에러를 처리하여 첫 번째 에러 메시지를 토스트로 표시합니다.
 * @param errors - react-hook-form의 FieldErrors 객체
 */
export const handleFormError = <T extends FieldValues>(errors: FieldErrors<T>) => {
  const firstError = Object.values(errors)[0]
  if (firstError?.message) {
    toast.error(firstError.message as string)
  }
}
