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

export interface ProductSearchForm {
  companyId?: string
  productCode?: string
  name?: string
  brandId?: string
  supplyId?: string
  display?: string
}

export const INITIAL_SEARCH_FORM: ProductSearchForm = {
  companyId: 'all',
  productCode: '',
  name: '',
  brandId: 'all',
  supplyId: 'all',
  display: 'all',
}
