/**
 * API 에러 코드 타입
 */
export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL_SERVER_ERROR'
  | 'UNKNOWN_ERROR'

/**
 * 커스텀 API 에러 클래스
 */
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * 에러 타입별 메시지 맵
 */
export const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  NETWORK_ERROR: '네트워크 연결을 확인해 주세요.',
  TIMEOUT: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  BAD_REQUEST: '잘못된 요청입니다. 입력 내용을 확인해 주세요.',
  INTERNAL_SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
}

/**
 * HTTP 상태 코드를 ApiErrorCode로 변환
 */
export function statusToErrorCode(status: number): ApiErrorCode {
  switch (status) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'
    case 404:
      return 'NOT_FOUND'
    case 500:
    case 502:
    case 503:
      return 'INTERNAL_SERVER_ERROR'
    default:
      return 'UNKNOWN_ERROR'
  }
}

/**
 * Error 객체를 ApiError로 변환
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    // Timeout 에러
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return new ApiError('TIMEOUT', ERROR_MESSAGES.TIMEOUT)
    }

    // Network 에러
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new ApiError('NETWORK_ERROR', ERROR_MESSAGES.NETWORK_ERROR)
    }

    // HTTP 상태 코드가 포함된 에러 메시지 파싱
    const statusMatch = error.message.match(/API Error: (\d{3})/)
    if (statusMatch) {
      const status = parseInt(statusMatch[1], 10)
      const code = statusToErrorCode(status)
      return new ApiError(code, ERROR_MESSAGES[code], status)
    }

    // 기타 에러
    return new ApiError('UNKNOWN_ERROR', error.message)
  }

  return new ApiError('UNKNOWN_ERROR', ERROR_MESSAGES.UNKNOWN_ERROR)
}

/**
 * ApiError에서 사용자 친화적인 메시지 추출
 */
export function getErrorMessage(error: unknown, fallbackMessage?: string): string {
  const apiError = toApiError(error)
  return ERROR_MESSAGES[apiError.code] ?? fallbackMessage ?? ERROR_MESSAGES.UNKNOWN_ERROR
}
