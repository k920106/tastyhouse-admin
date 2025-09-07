import PageHeader from '@/src/components/layout/PageHeader'
import PageContent from '@/src/components/layout/PageContent'
import ProductManagement from '@/src/components/features/products/ProductManagement'

export default function ProductList() {
  const breadcrumbs = [
    { label: '상품' },
    { label: '상품 관리' },
    { label: '상품 목록', href: '/products' },
  ]

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} />
      <PageContent>
        <ProductManagement />
      </PageContent>
    </>
  )
}
