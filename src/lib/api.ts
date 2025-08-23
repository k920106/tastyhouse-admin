interface apiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: unknown
  headers?: Record<string, string>
  timeout?: number
}

export class api {
  private static baseUrl =
    process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_API_URL || '/api' : '/api'

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
        let errorMessage = `API Error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // JSON 파싱 실패 시 기본 에러 메시지 사용
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return (await response.text()) as T
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout}ms`)
        }
        console.error('API Request failed:', error)
        throw error
      }

      throw new Error('Unknown API error occurred')
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
}
