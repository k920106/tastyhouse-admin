export interface DataTablesResponse<T> {
  pagination: {
    draw: number
    total: number
    filtered: number
  }
  data: T[]
}
