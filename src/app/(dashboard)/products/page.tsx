'use client'

import { useState, useRef } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/ui/Breadcrumb'
import { DataTable } from '@/src/components/features/products/DataTable'
import { Separator } from '@/src/components/ui/Separator'
import { SidebarTrigger } from '@/src/components/ui/Sidebar'
import { columns } from '@/src/components/features/products/Columns'
import { ProductSearchForm } from '@/src/components/features/products/ProductSearchForm'
import { ProductListItem } from '@/src/types/product'

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const searchFormRef = useRef<{ refetch: (page?: number, size?: number) => void }>(null)

  const handleProductsChange = (
    newProducts: ProductListItem[],
    paginationInfo: { draw: number; total: number; filtered: number },
  ) => {
    setProducts(newProducts)
    setTotalCount(paginationInfo.total)
  }

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
    setCurrentPage(pageIndex)
    setPageSize(newPageSize)
    if (searchFormRef.current?.refetch) {
      searchFormRef.current.refetch(pageIndex, newPageSize)
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">상품</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>상품 관리</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>상품 목록</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 min-h-[100vh] md:min-h-min">
          <ProductSearchForm onProductsChange={handleProductsChange} ref={searchFormRef} />
          <DataTable
            columns={columns}
            data={products}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </>
  )
}
