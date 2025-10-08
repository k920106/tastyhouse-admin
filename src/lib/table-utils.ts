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
