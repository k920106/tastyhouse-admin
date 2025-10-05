export interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  message: string | null
}

export interface PagedApiResponse<T> {
  success: boolean
  data: T[] | null
  message: string | null
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  } | null
}
