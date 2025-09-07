import { Suspense } from 'react'
import PageHeader from '@/src/components/layout/PageHeader'
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 min-h-[100vh] md:min-h-min">
          <Suspense fallback={<div>로딩 중...</div>}>
            <ProductManagement />
          </Suspense>
        </div>
      </div>
    </>
  )
}
