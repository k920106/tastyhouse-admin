import { Suspense } from 'react'
import ProductList from './_components/ProductList'

export default function ProductListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList />
    </Suspense>
  )
}
