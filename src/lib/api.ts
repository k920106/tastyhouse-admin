import { ApiResponse } from '@/src/types/api'
import { ApiError, statusToErrorCode } from '@/src/types/error'

interface apiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  timeout?: number
}

export class api {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

  static async request<T = unknown>(endpoint: string, options: apiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, timeout = 10000 } = options

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      } as HeadersInit,
      signal: controller.signal,
    }

    if (body) {
      if (body instanceof FormData) {
        const configHeaders = config.headers as Record<string, string>
        delete configHeaders['Content-Type']
        config.body = body
      } else {
        config.body = JSON.stringify(body)
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config)

      // 타임아웃 클리어
      clearTimeout(timeoutId)

      if (!response.ok) {
        const status = response.status
        const errorCode = statusToErrorCode(status)

        let errorMessage = `API Error: ${status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // JSON 파싱 실패 시 기본 에러 메시지 사용
        }

        throw new ApiError(errorCode, errorMessage, status)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return (await response.text()) as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError('TIMEOUT', `Request timeout after ${timeout}ms`)
        }
        console.error('API Request failed:', error)
        throw error
      }

      throw new ApiError('UNKNOWN_ERROR', 'Unknown API error occurred')
    }
  }

  static async get<T = unknown>(
    endpoint: string,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers, timeout })
  }

  static async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, headers, timeout })
  }

  static async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, headers, timeout })
  }

  static async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, headers, timeout })
  }

  static async delete<T = unknown>(
    endpoint: string,
    headers?: Record<string, string>,
    timeout?: number,
  ): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers, timeout })
  }

  static async download<T = unknown>(
    endpoint: string,
    filename: string,
    headers?: Record<string, string>,
    timeout = 30000,
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: headers as HeadersInit,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const status = response.status
        const errorMessage = `파일 다운로드 실패: ${status} ${response.statusText}`
        return {
          success: false,
          data: null,
          message: errorMessage,
        }
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return {
        success: true,
        data: null,
        message: '파일 다운로드 성공',
      }
    } catch (error) {
      clearTimeout(timeoutId)

      let errorMessage = '파일 다운로드 중 오류가 발생했습니다.'

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = `Request timeout after ${timeout}ms`
        } else {
          errorMessage = error.message
        }
      }

      return {
        success: false,
        data: null,
        message: errorMessage,
      }
    }
  }
}
