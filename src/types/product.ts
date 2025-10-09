// 전시상태
export const PRODUCT_DISPLAY_STATUS = {
  DISPLAY: { value: 'true', label: '전시' },
  NOT_DISPLAY: { value: 'false', label: '미전시' },
} as const

export const PROUDCT_DISPLAY_STATUS = [
  PRODUCT_DISPLAY_STATUS.DISPLAY,
  PRODUCT_DISPLAY_STATUS.NOT_DISPLAY,
]

export const getProductDisplayStatusLabel = (display: boolean): string => {
  return display ? PRODUCT_DISPLAY_STATUS.DISPLAY.label : PRODUCT_DISPLAY_STATUS.NOT_DISPLAY.label
}

// 상품상태
export const PRODUCT_STATUS = {
  ON_SALE: { value: 'on_sale', label: '판매중' },
  SALE_STOPPED: { value: 'sale_stopped', label: '판매중지' },
  DISCONTINUED: { value: 'discontinued', label: '단종' },
  FAULT_STOPPED: { value: 'fault_stopped', label: '장애중지' },
} as const

export const PRODUCT_STATUS_OPTIONS = [
  PRODUCT_STATUS.ON_SALE,
  PRODUCT_STATUS.SALE_STOPPED,
  PRODUCT_STATUS.DISCONTINUED,
  PRODUCT_STATUS.FAULT_STOPPED,
]

export type ProductStatusValue = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS]['value']

export interface Product {
  id: number
  companyId: number
  companyName: string
  productCode: string
  name: string
  brandId: number
  supplyId: number
  validityPeriod: number
  exhibitionPrice: number
  regularPrice: number
  supplyPrice: number
  display: boolean
  sort: number
  createdAt: string
  updatedAt: string
}

export interface ProductSearchFormInput extends Record<string, unknown> {
  companyId: string
  companyName?: string
  brandId: string
  supplyId: string
  productCode: string
  name: string
  display: 'all' | 'true' | 'false'
  status: 'all' | ProductStatusValue
  startDate: string
  endDate: string
}

export interface ProductFormInput {
  companyId: string
  productCode: string
  name: string
  brandId: string
  supplyId: string
  validityPeriod: number
  exhibitionPrice: number
  regularPrice: number
  supplyPrice: number
  display: boolean
  sort: number
}

export const isProductSearchKey = (key: string): boolean => {
  return [
    'companyId',
    'companyName',
    'brandId',
    'supplyId',
    'productCode',
    'name',
    'display',
    'status',
    'startDate',
    'endDate',
  ].includes(key)
}

export interface ProductSearchQuery {
  companyId: number | null
  brandId: number | null
  supplyId: number | null
  productCode: string | null
  name: string | null
  display: boolean | null
  startDate: string
  endDate: string
}

export interface ProductCreateRequest {
  companyId: number
  productCode: string
  name: string
  brandId: number
  supplyId: number
  validityPeriod: number
  exhibitionPrice: number
  regularPrice: number
  supplyPrice: number
  display: boolean
  sort: number
}

export interface ProductCreateResponse {
  id: number
}

export interface ProductUpdateRequest {
  companyId: number
  productCode: string
  name: string
  brandId: number
  supplyId: number
  validityPeriod: number
  exhibitionPrice: number
  regularPrice: number
  supplyPrice: number
  display: boolean
  sort: number
}

export interface ProductSyncRequest {
  companyId: number
}

export interface ProductBulkResponse {
  count: number
}

export type ProductCreateFormInput = ProductFormInput
export type ProductUpdateFormInput = ProductFormInput
