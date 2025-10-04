/**
 * URL 페이지 번호를 API 페이지 번호로 변환
 * @param urlPage URL 페이지 번호 (1-based)
 * @returns API 페이지 번호 (0-based)
 */
export const urlPageToApiPage = (urlPage: number): number => urlPage - 1

/**
 * API 페이지 번호를 URL 페이지 번호로 변환
 * @param apiPage API 페이지 번호 (0-based)
 * @returns URL 페이지 번호 (1-based)
 */
export const apiPageToUrlPage = (apiPage: number): number => apiPage + 1
