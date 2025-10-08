/**
 * 테이블 행 번호 계산 유틸리티 함수
 *
 * @param pageIndex - 현재 페이지 인덱스 (0부터 시작)
 * @param pageSize - 페이지당 행 개수
 * @param rowIndex - 현재 행의 인덱스 (0부터 시작)
 * @returns 실제 행 번호 (1부터 시작)
 */
export const getRowNumber = (pageIndex: number, pageSize: number, rowIndex: number): number =>
  pageIndex * pageSize + rowIndex + 1

/**
 * 테이블 데이터 로딩 상태를 고려한 안전한 데이터 반환 함수
 *
 * @param isLoading - 로딩 상태
 * @param data - 데이터 배열 (undefined 가능)
 * @returns 로딩 중이거나 데이터가 없으면 빈 배열, 그 외에는 데이터 반환
 *
 * @example
 * const safeData = getTableData(isLoading, data?.notices)
 * // 로딩 중: []
 * // 데이터 없음: []
 * // 데이터 있음: data.notices
 */
export const getTableData = <T>(isLoading: boolean, data: T[] | undefined): T[] => {
  if (isLoading) return []
  return data || []
}
