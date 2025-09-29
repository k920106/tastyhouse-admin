/**
 * 애플리케이션에서 사용되는 경로 상수들
 */

// 공지사항 관련 경로
export const NOTICE_ROUTES = {
  // 공지사항 목록
  LIST: '/notices',
  // 공지사항 등록
  CREATE: '/notices/create',
  // 공지사항 상세 (동적 경로)
  DETAIL: (id: string | number) => `/notices/${id}`,
  // 공지사항 편집 (동적 경로)
  EDIT: (id: string | number) => `/notices/${id}/edit`,
} as const

// 상품 관련 경로
export const PRODUCT_ROUTES = {
  LIST: '/products',
  CREATE: '/products/create',
  DETAIL: (id: string | number) => `/products/${id}`,
  EDIT: (id: string | number) => `/products/${id}/edit`,
} as const

// 이벤트 관련 경로
export const EVENT_ROUTES = {
  ROULETTES: '/events/roulettes',
} as const

// 인증 관련 경로
export const AUTH_ROUTES = {
  LOGIN: '/login',
  LOGOUT: '/logout',
} as const

// 대시보드 경로
export const DASHBOARD_ROUTES = {
  HOME: '/',
} as const

// 모든 경로를 하나로 통합
export const ROUTES = {
  ...DASHBOARD_ROUTES,
  AUTH: AUTH_ROUTES,
  NOTICES: NOTICE_ROUTES,
  PRODUCTS: PRODUCT_ROUTES,
  EVENTS: EVENT_ROUTES,
} as const
