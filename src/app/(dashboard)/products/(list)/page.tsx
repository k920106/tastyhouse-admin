import ProductFilters from '@/src/app/(dashboard)/products/(list)/_components/ProductFilters'
import ProductList from '@/src/app/(dashboard)/products/(list)/_components/ProductList'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { PRODUCT_LIST_BREADCRUMBS } from '@/src/constants/product'

export default function ProductListPage() {
  return (
    <PageTemplate breadcrumbs={PRODUCT_LIST_BREADCRUMBS}>
      <ProductFilters />
      <ProductList />
    </PageTemplate>
  )
}
