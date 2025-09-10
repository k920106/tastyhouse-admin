export interface DataTablesResponse<T> {
  pagination: {
    draw: number
    total: number
    filtered: number
  }
  data: T[]
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T | null
  message: string | null
}

export interface PagedApiResponse<T> {
  success: boolean
  data: T[] | null
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  } | null
  message: string | null
}
