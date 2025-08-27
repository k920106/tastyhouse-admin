import { CompanyListItem } from '@/src/types/company'
import ProductList from './_components/ProductList'
import { api } from '@/src/lib/api'
import { BrandListItem } from '@/src/types/brand'
import { SupplyListItem } from '@/src/types/supply'

export default async function ProductListPage() {
  let companies: CompanyListItem[] = []
  let brands: BrandListItem[] = []
  let supplies: SupplyListItem[] = []

  try {
    const [companiesResponse, brandsResponse, suppliesResponse] = await Promise.all([
      api.get<CompanyListItem[]>('/companies'),
      api.get<BrandListItem[]>('/brands'),
      api.get<SupplyListItem[]>('/supplies'),
    ])

    companies = companiesResponse || []
    brands = brandsResponse || []
    supplies = suppliesResponse || []
  } catch (error) {
    console.error('API ERROR: ', error)
  }

  return <ProductList companies={companies} brands={brands} supplies={supplies} />
}
