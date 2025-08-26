import { CompanyListItem } from '@/src/types/company'
import ProductList from './_components/ProductList'
import { api } from '@/src/lib/api'
import { BrandListItem } from '@/src/types/brand'

export default async function ProductListPage() {
  let companies: CompanyListItem[] = []
  let brands: BrandListItem[] = []

  try {
    const [companiesResponse, brandsResponse] = await Promise.all([
      api.get<CompanyListItem[]>('/companies'),
      api.get<BrandListItem[]>('/brands'),
    ])

    companies = companiesResponse || []
    brands = brandsResponse || []
  } catch (error) {
    console.error('API ERROR: ', error)
  }

  return <ProductList companies={companies} brands={brands} />
}
