'use client'

import { useState, useRef, useEffect } from 'react'
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
import { ProductSearchForm } from '@/src/components/features/products/ProductSearchForm'
import { ProductListItem } from '@/src/types/product'
import { CompanyListItem } from '@/src/types/company'
import { BrandListItem } from '@/src/types/brand'
import { toast } from 'sonner'
import { SupplyListItem } from '@/src/types/supply'
import { useProductSearchStore } from '@/src/store/productSearchStore'

interface ProductListProps {
  companies: CompanyListItem[]
  brands: BrandListItem[]
  supplies: SupplyListItem[]
}

export default function ProductList({ companies, brands, supplies }: ProductListProps) {
  const [hasShownToast, setHasShownToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchFormRef = useRef<{ refetch: (page?: number, size?: number) => void }>(null)

  const { products, totalCount, currentPage, pageSize, setProductsData } = useProductSearchStore()

  useEffect(() => {
    if (companies.length === 0 && !hasShownToast) {
      toast('매체사를 조회할 수 없습니다.')
      setHasShownToast(true)
    }
  }, [companies, hasShownToast])

  useEffect(() => {
    if (brands.length === 0 && !hasShownToast) {
      toast('교환처를 조회할 수 없습니다.')
      setHasShownToast(true)
    }
  }, [brands, hasShownToast])

  useEffect(() => {
    if (supplies.length === 0 && !hasShownToast) {
      toast('공급사를 조회할 수 없습니다.')
      setHasShownToast(true)
    }
  }, [supplies, hasShownToast])

  const handleProductsChange = (
    _newProducts: ProductListItem[],
    _paginationInfo: { draw: number; total: number; filtered: number },
  ) => {
    // Data is already saved to store in ProductSearchForm, so this is just for compatibility
  }

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading)
  }

  const handlePaginationChange = (pageIndex: number, newPageSize: number) => {
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
          <ProductSearchForm
            onProductsChange={handleProductsChange}
            onLoadingChange={handleLoadingChange}
            ref={searchFormRef}
            companies={companies}
            brands={brands}
            supplies={supplies}
          />
          <DataTable
            columns={createColumns(currentPage, pageSize)}
            data={products}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            loading={loading}
            onPaginationChange={handlePaginationChange}
          />
        </div>
      </div>
    </>
  )
}
