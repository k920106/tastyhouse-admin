import { ROUTES } from '@/src/constants/routes'
import { getTodayYYYYMMDD } from '@/src/lib/date-utils'
import { ProductSearchFormInput } from '@/src/types/product'

export const PRODUCT_LIST_BREADCRUMBS = [
  { label: '상품' },
  { label: '상품관리' },
  { label: '상품목록', href: ROUTES.PRODUCTS.LIST },
]

export const PRODUCT_CREATE_BREADCRUMBS = [
  { label: '상품' },
  { label: '상품관리' },
  { label: '상품목록', href: ROUTES.PRODUCTS.LIST },
  { label: '등록' },
]

export const PRODUCT_DETAIL_BREADCRUMBS = [
  { label: '상품' },
  { label: '상품관리' },
  { label: '상품목록', href: ROUTES.PRODUCTS.LIST },
  { label: '상세' },
]

export const PRODUCT_UPDATE_BREADCRUMBS = [
  { label: '상품' },
  { label: '상품관리' },
  { label: '상품목록', href: ROUTES.PRODUCTS.LIST },
  { label: '상세' },
  { label: '수정' },
]

export const INITIAL_PRODUCT_SEARCH_FORM = {
  companyId: 'all',
  brandId: 'all',
  supplyId: 'all',
  productCode: '',
  name: '',
  display: 'all' as const,
  status: 'all' as const,
}

export const INITIAL_PRODUCT_CREATE_FORM = {
  companyId: 'all',
  productCode: '',
  name: '',
  brandId: 'all',
  supplyId: 'all',
  validityPeriod: 0,
  exhibitionPrice: 0,
  regularPrice: 0,
  supplyPrice: 0,
  display: false,
  sort: 0,
}

export const getInitialProductSearchForm = (): ProductSearchFormInput => {
  return {
    ...INITIAL_PRODUCT_SEARCH_FORM,
    companyName: undefined,
    startDate: getTodayYYYYMMDD(),
    endDate: getTodayYYYYMMDD(),
  }
}
