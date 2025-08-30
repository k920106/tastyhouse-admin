'use client'

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
import { createColumns } from '@/src/components/features/products/Columns'
import ProductSearchForm from '@/src/components/features/products/ProductSearchForm'
import { useProductSearch } from '@/src/hooks/useProductSearch'

export default function ProductList() {
  const { products, totalCount, currentPage, pageSize, handlePageChange, loading } =
    useProductSearch()

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
          <ProductSearchForm />
          <DataTable
            columns={createColumns(currentPage, pageSize)}
            data={products}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  )
}
