export const PRODUCT_BREADCRUMBS = [
  { label: '상품' },
  { label: '상품 관리' },
  { label: '상품 목록', href: '/products' },
]

export const INITIAL_PRODUCT_SEARCH_FORM = {
  companyId: 'all',
  productCode: '',
  name: '',
  brandId: 'all',
  supplyId: 'all',
  display: 'all',
} as const
