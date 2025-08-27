'use client'

import React, { useState, useImperativeHandle } from 'react'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Label } from '@/src/components/ui/Label'
import { Combobox } from '@/src/components/ui/Combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { LuDownload } from 'react-icons/lu'
import { ProductListItem } from '@/src/types/product'
import { BrandListItem } from '@/src/types/brand'
import { SupplyListItem } from '@/src/types/supply'
import { CompanyListItem } from '@/src/types/company'
import { api } from '@/src/lib/api'
import { DataTablesResponse } from '@/src/types/api'
import { toast } from 'sonner'
import { useProductSearchStore } from '@/src/store/productSearchStore'
import { Loader2Icon } from 'lucide-react'

interface ProductSearchFormProps {
  onProductsChange: (
    products: ProductListItem[],
    paginationInfo: { draw: number; total: number; filtered: number },
  ) => void
  onLoadingChange?: (loading: boolean) => void
  companies: CompanyListItem[]
  brands: BrandListItem[]
  supplies: SupplyListItem[]
}

export const ProductSearchForm = React.forwardRef<
  { refetch: (page?: number, size?: number) => void },
  ProductSearchFormProps
>(({ onProductsChange, onLoadingChange, companies, brands, supplies }, ref) => {
  const [loading, setLoading] = useState(false)
  const [currentSize, setCurrentSize] = useState(10)
  const { searchForm, updateSearchForm, setProductsData } = useProductSearchStore()

  const fetchProducts = async (page: number = 0, size: number = 10) => {
    setLoading(true)
    onLoadingChange?.(true)
    setCurrentSize(size)

    try {
      const requestData = {
        ...searchForm,
        companyId:
          searchForm.companyId && searchForm.companyId !== 'all'
            ? Number(searchForm.companyId)
            : undefined,
        brandId:
          searchForm.brandId && searchForm.brandId !== 'all'
            ? Number(searchForm.brandId)
            : undefined,
        supplyId:
          searchForm.supplyId && searchForm.supplyId !== 'all'
            ? Number(searchForm.supplyId)
            : undefined,
        display:
          searchForm.display && searchForm.display !== 'all'
            ? searchForm.display === 'true'
            : undefined,
        page,
        size,
        draw: 1,
      }

      const queryParams = new URLSearchParams()
      Object.entries(requestData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })

      const endpoint = queryParams.toString() ? `/products?${queryParams.toString()}` : '/products'

      const response = await api.get<DataTablesResponse<ProductListItem>>(endpoint)

      onProductsChange(response.data, response.pagination)
      setProductsData(response.data, response.pagination, page, size)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('오류가 발생하였습니다.')
    } finally {
      setLoading(false)
      onLoadingChange?.(false)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetchProducts(0, currentSize)
  }

  useImperativeHandle(ref, () => ({
    refetch: fetchProducts,
  }))

  return (
    <Card className="w-full shadow-none">
      <CardContent>
        <form id="productSearchForm" onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="companyName">매체사</Label>
              <Combobox
                options={companies}
                valueKey="id"
                labelKey="name"
                placeholder="-"
                value={searchForm.companyId}
                onValueChange={(value) => {
                  updateSearchForm({ companyId: value })
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productCode">상품코드</Label>
              <Input
                type="text"
                id="productCode"
                value={searchForm.productCode || ''}
                onChange={(e) => updateSearchForm({ productCode: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">상품명</Label>
              <Input
                type="text"
                id="name"
                value={searchForm.name || ''}
                onChange={(e) => updateSearchForm({ name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brandName">교환처</Label>
              <Combobox
                options={brands}
                valueKey="id"
                labelKey="name"
                placeholder="전체"
                value={searchForm.brandId}
                onValueChange={(value) => {
                  updateSearchForm({ brandId: value })
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">공급사</Label>
              <Combobox
                options={supplies}
                valueKey="id"
                labelKey="name"
                placeholder="전체"
                value={searchForm.supplyId}
                onValueChange={(value) => {
                  updateSearchForm({ supplyId: value })
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display">전시상태</Label>
              <Select
                defaultValue="all"
                value={searchForm.display || 'all'}
                onValueChange={(value) => updateSearchForm({ display: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="전체" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="true">전시</SelectItem>
                  <SelectItem value="false">미전시</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          상품 업데이트
        </Button>
        <Button type="button" variant="outline">
          전시상태 변경
        </Button>
        <Button type="button" variant="outline">
          상품 일괄 변경
        </Button>
        <Button type="button" variant="excel">
          엑셀 다운로드
          <LuDownload />
        </Button>
        <Button type="submit" form="productSearchForm" disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="animate-spin" />
              조회 중...
            </>
          ) : (
            '조회'
          )}
        </Button>
      </CardFooter>
    </Card>
  )
})

ProductSearchForm.displayName = 'ProductSearchForm'
