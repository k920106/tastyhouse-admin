// 공지사항
export const NOTICE_ROUTES = {
  LIST: '/notices', // 목록
  CREATE: '/notices/create', // 등록
  DETAIL: (id: string | number) => `/notices/${id}`, // 상세
  EDIT: (id: string | number) => `/notices/${id}/edit`, // 수정
} as const

// 상품
export const PRODUCT_ROUTES = {
  LIST: '/products', // 목록
  CREATE: '/products/create', // 등록
  DETAIL: (id: string | number) => `/products/${id}`, // 상세
  EDIT: (id: string | number) => `/products/${id}/edit`, // 수정
} as const

// 이벤트
export const EVENT_ROUTES = {
  ROULETTES: '/events/roulettes', // 룰렛
} as const

// 인증
export const AUTH_ROUTES = {
  LOGIN: '/login', // 로그인
  LOGOUT: '/logout', // 로그아웃
} as const

// 대시보드
export const DASHBOARD_ROUTES = {
  HOME: '/', // 홈
} as const

export const ROUTES = {
  ...DASHBOARD_ROUTES,
  AUTH: AUTH_ROUTES, // 인증
  NOTICES: NOTICE_ROUTES, // 공지사항
  PRODUCTS: PRODUCT_ROUTES, // 상품
  EVENTS: EVENT_ROUTES, // 이벤트
} as const
