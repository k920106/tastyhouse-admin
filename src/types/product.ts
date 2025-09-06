export type ProductListItem = {
  id: number
  companyName: string
  productCode: string
  name: string
  brandName: string
  validityPeriod: number
  exhibitionPrice: number
  regularPrice: number
  supplyPrice: number
  display: boolean
  sort: number
}

export interface ProductSearchForm extends Record<string, string> {
  companyId: string
  productCode: string
  name: string
  brandId: string
  supplyId: string
  display: string
}

// 상품 전시 상태 관리
export const PRODUCT_DISPLAY_STATUS = {
  DISPLAY: { value: true, label: '전시' },
  NOT_DISPLAY: { value: false, label: '미전시' },
} as const

export type ProductDisplayStatus =
  (typeof PRODUCT_DISPLAY_STATUS)[keyof typeof PRODUCT_DISPLAY_STATUS]

// 유틸리티 함수
export const getProductDisplayStatusLabel = (display: boolean): string => {
  return display ? PRODUCT_DISPLAY_STATUS.DISPLAY.label : PRODUCT_DISPLAY_STATUS.NOT_DISPLAY.label
}
