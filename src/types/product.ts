export type ProductListItem = {
  id: number
  companyName: string
  productCode: string
  name: string
  brandName: string
  validityPeriod: number
  exhibitionPrice: number
  regularPrice: number
  supplier: number
  display: boolean
  sort: number
}

export interface ProductSearchForm {
  companyId?: string
  productCode?: string
  name?: string
  brandId?: string
  supplierId?: string
  display?: string
}
