'use client'

import React, { useImperativeHandle, useCallback } from 'react'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
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

interface ProductSearchFormProps {
  onLoadingChange?: (loading: boolean) => void
  companies: CompanyListItem[]
  brands: BrandListItem[]
  supplies: SupplyListItem[]
}

export const ProductSearchForm = React.forwardRef<
  { refetch: (page?: number, size?: number) => void },
  ProductSearchFormProps
>(({ onLoadingChange, companies, brands, supplies }, ref) => {
  const { searchForm, setProductsData, updateSearchForm } = useProductSearchStore()

  const fetchProducts = useCallback(
    async (page: number = 0, size: number = 10) => {
      onLoadingChange?.(true)

      try {
        const requestData = {
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
          productCode: searchForm.productCode || undefined,
          name: searchForm.name || undefined,
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

        const endpoint = queryParams.toString()
          ? `/products?${queryParams.toString()}`
          : '/products'
        const response = await api.get<DataTablesResponse<ProductListItem>>(endpoint)

        setProductsData(response.data, response.pagination, page, size)
      } catch (error) {
        console.error('Failed to fetch products:', error)
        toast.error('오류가 발생하였습니다.')
      } finally {
        onLoadingChange?.(false)
      }
    },
    [searchForm, onLoadingChange, setProductsData],
  )

  const onSubmit = useCallback(() => {
    fetchProducts(0, 10)
  }, [fetchProducts])

  const handleDisplayChange = useCallback(
    (value: string) => {
      updateSearchForm({ display: value })
    },
    [updateSearchForm],
  )

  useImperativeHandle(
    ref,
    () => ({
      refetch: fetchProducts,
    }),
    [fetchProducts],
  )

  return (
    <Card className="w-full shadow-none">
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">매체사</label>
            <Combobox
              options={companies}
              valueKey="id"
              labelKey="name"
              placeholder="-"
              value={searchForm.companyId || 'all'}
              onValueChange={(value) => updateSearchForm({ companyId: value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">상품코드</label>
            <Input
              type="text"
              placeholder="상품코드 입력"
              value={searchForm.productCode || ''}
              onChange={(e) => updateSearchForm({ productCode: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">상품명</label>
            <Input
              type="text"
              placeholder="상품명 입력"
              value={searchForm.name || ''}
              onChange={(e) => updateSearchForm({ name: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">교환처</label>
            <Combobox
              options={brands}
              valueKey="id"
              labelKey="name"
              placeholder="전체"
              value={searchForm.brandId || 'all'}
              onValueChange={(value) => updateSearchForm({ brandId: value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">공급사</label>
            <Combobox
              options={supplies}
              valueKey="id"
              labelKey="name"
              placeholder="전체"
              value={searchForm.supplyId || 'all'}
              onValueChange={(value) => updateSearchForm({ supplyId: value })}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">전시상태</label>
            <Select value={searchForm.display || 'all'} onValueChange={handleDisplayChange}>
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
        <Button type="button" onClick={onSubmit}>
          조회
        </Button>
      </CardFooter>
    </Card>
  )
})

ProductSearchForm.displayName = 'ProductSearchForm'
