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
import { ProductSearchForm as ProductSearchFormType, ProductListItem } from '@/src/types/product'
import { Company } from '@/src/types/company'
import { Brand } from '@/src/types/brand'
import { Supply } from '@/src/types/supply'
import { api } from '@/src/lib/api'
import { DataTablesResponse } from '@/src/types/api'

const companyData: Company[] = [
  {
    id: 1,
    name: '밴드 기프트샵',
  },
  {
    id: 2,
    name: 'IBK',
  },
  {
    id: 3,
    name: '아파트너',
  },
]

const brandData: Brand[] = [
  {
    id: 1,
    name: '스타벅스',
  },
  {
    id: 2,
    name: '투썸플레이스',
  },
  {
    id: 3,
    name: '메가커피',
  },
  {
    id: 4,
    name: '컴포즈커피',
  },
]

const supplyData: Supply[] = [
  {
    id: 1,
    name: '윈큐브마케팅',
  },
  {
    id: 2,
    name: '쿠프콘',
  },
  {
    id: 3,
    name: '슈퍼콘',
  },
  {
    id: 4,
    name: '스마트콘',
  },
]

interface ProductSearchFormProps {
  onProductsChange: (
    products: ProductListItem[],
    paginationInfo: { draw: number; total: number; filtered: number },
  ) => void
}

export const ProductSearchForm = React.forwardRef<
  { refetch: (page?: number, size?: number) => void },
  ProductSearchFormProps
>(({ onProductsChange }, ref) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductSearchFormType>({})
  const [currentSize, setCurrentSize] = useState(10)

  const fetchProducts = async (page: number = 0, size: number = 10) => {
    setLoading(true)
    setCurrentSize(size)

    try {
      const requestData = {
        ...formData,
        companyId:
          formData.companyId && formData.companyId !== 'all'
            ? Number(formData.companyId)
            : undefined,
        brandId:
          formData.brandId && formData.brandId !== 'all' ? Number(formData.brandId) : undefined,
        supplyId:
          formData.supplierId && formData.supplierId !== 'all'
            ? Number(formData.supplierId)
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

      // delete requestData.supplierId

      const endpoint = queryParams.toString() ? `/products?${queryParams.toString()}` : '/products'

      const response = await api.get<DataTablesResponse<ProductListItem>>(endpoint)
      console.log(response.data)
      console.log(response.pagination)
      onProductsChange(response.data, response.pagination)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
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
                options={companyData}
                valueKey="id"
                labelKey="name"
                placeholder="-"
                value={formData.companyId}
                onValueChange={(value) => {
                  console.log('Company selected:', value)
                  setFormData((prev) => ({ ...prev, companyId: value }))
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="productCode">상품코드</Label>
              <Input
                type="text"
                id="productCode"
                value={formData.productCode || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, productCode: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">상품명</Label>
              <Input
                type="text"
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brandName">교환처</Label>
              <Combobox
                options={brandData}
                valueKey="id"
                labelKey="name"
                placeholder="전체"
                value={formData.brandId}
                onValueChange={(value) => {
                  console.log('Brand selected:', value)
                  setFormData((prev) => ({ ...prev, brandId: value }))
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="supplier">공급사</Label>
              <Combobox
                options={supplyData}
                valueKey="id"
                labelKey="name"
                placeholder="전체"
                value={formData.supplierId}
                onValueChange={(value) => {
                  console.log('Supplier selected:', value)
                  setFormData((prev) => ({ ...prev, supplierId: value }))
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="display">전시상태</Label>
              <Select
                defaultValue="all"
                value={formData.display || 'all'}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, display: value }))}
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
          {loading ? '조회 중...' : '조회'}
        </Button>
      </CardFooter>
    </Card>
  )
})

ProductSearchForm.displayName = 'ProductSearchForm'
