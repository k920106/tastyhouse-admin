/**
 * 브랜드 타입: URL 페이지 번호 (1-based)
 * 사용자에게 보여지는 페이지 번호 (1, 2, 3, ...)
 */
export type UrlPage = number & { readonly __brand: 'UrlPage' }

/**
 * 브랜드 타입: API 페이지 번호 (0-based)
 * 서버 API에 전달되는 페이지 번호 (0, 1, 2, ...)
 */
export type ApiPage = number & { readonly __brand: 'ApiPage' }

/**
 * URL 페이지 번호를 API 페이지 번호로 변환
 * @param urlPage URL 페이지 번호 (1-based)
 * @returns API 페이지 번호 (0-based)
 */
export const urlPageToApiPage = (urlPage: UrlPage): ApiPage => (urlPage - 1) as ApiPage

/**
 * API 페이지 번호를 URL 페이지 번호로 변환
 * @param apiPage API 페이지 번호 (0-based)
 * @returns URL 페이지 번호 (1-based)
 */
export const apiPageToUrlPage = (apiPage: ApiPage): UrlPage => (apiPage + 1) as UrlPage

/**
 * 일반 숫자를 UrlPage로 변환 (타입 캐스팅)
 */
export const toUrlPage = (page: number): UrlPage => page as UrlPage

/**
 * 일반 숫자를 ApiPage로 변환 (타입 캐스팅)
 */
export const toApiPage = (page: number): ApiPage => page as ApiPage
