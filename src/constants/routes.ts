// FAQ
export const FAQ_ROUTES = {
  LIST: '/faqs', // 목록
  CREATE: '/faqs/create', // 등록
  DETAIL: (id: string | number) => `/faqs/${id}`, // 상세
  UPDATE: (id: string | number) => `/faqs/${id}/update`, // 수정
}

// 공지사항
export const NOTICE_ROUTES = {
  LIST: '/notices', // 목록
  CREATE: '/notices/create', // 등록
  DETAIL: (id: string | number) => `/notices/${id}`, // 상세
  UPDATE: (id: string | number) => `/notices/${id}/update`, // 수정
}

// 상품
export const PRODUCT_ROUTES = {
  LIST: '/products', // 목록
  CREATE: '/products/create', // 등록
  DETAIL: (id: string | number) => `/products/${id}`, // 상세
  UPDATE: (id: string | number) => `/products/${id}/update`, // 수정
}

// 이벤트
export const EVENT_ROUTES = {
  ROULETTES: '/events/roulettes', // 룰렛
}

// 인증
export const AUTH_ROUTES = {
  LOGIN: '/login', // 로그인
  LOGOUT: '/logout', // 로그아웃
}

// 대시보드
export const DASHBOARD_ROUTES = {
  HOME: '/', // 홈
}

export const ROUTES = {
  ...DASHBOARD_ROUTES,
  AUTH: AUTH_ROUTES, // 인증
  FAQS: FAQ_ROUTES, // FAQ
  NOTICES: NOTICE_ROUTES, // 공지사항
  PRODUCTS: PRODUCT_ROUTES, // 상품
  EVENTS: EVENT_ROUTES, // 이벤트
}
