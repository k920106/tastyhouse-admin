'use client'

import React, { useImperativeHandle, useCallback } from 'react'
import { useForm } from 'react-hook-form'
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
import { Loader2Icon } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/Form'

interface ProductSearchFormData {
  companyId?: string
  productCode?: string
  name?: string
  brandId?: string
  supplyId?: string
  display?: string
}

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
  const { searchForm, setProductsData, updateSearchForm, _hasHydrated } = useProductSearchStore()

  const form = useForm<ProductSearchFormData>({
    defaultValues: {
      companyId: 'all',
      productCode: '',
      name: '',
      brandId: 'all',
      supplyId: 'all',
      display: 'all',
    },
  })

  React.useEffect(() => {
    if (_hasHydrated) {
      const formValues = {
        companyId: searchForm.companyId || '',
        productCode: searchForm.productCode || '',
        name: searchForm.name || '',
        brandId: searchForm.brandId || '',
        supplyId: searchForm.supplyId || '',
        display: searchForm.display || 'all',
      }

      // Update form fields except display (handled separately)
      Object.entries(formValues).forEach(([key, value]) => {
        if (key !== 'display') {
          form.setValue(key as keyof ProductSearchFormData, value)
        }
      })
    }
  }, [_hasHydrated, form, searchForm])

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

  const onSubmit = useCallback(
    (data: ProductSearchFormData) => {
      updateSearchForm(data)
      fetchProducts(0, 10)
    },
    [updateSearchForm, fetchProducts],
  )

  const handleDisplayChange = useCallback(
    (value: string) => {
      updateSearchForm({ display: value })
      form.setValue('display', value, { shouldValidate: true })
    },
    [updateSearchForm, form],
  )

  useImperativeHandle(
    ref,
    () => ({
      refetch: fetchProducts,
    }),
    [fetchProducts],
  )

  if (!_hasHydrated) {
    return (
      <Card className="w-full shadow-none">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2Icon className="animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-none">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>매체사</FormLabel>
                    <FormControl>
                      <Combobox
                        options={companies}
                        valueKey="id"
                        labelKey="name"
                        placeholder="-"
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품코드</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="상품코드 입력" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상품명</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="상품명 입력" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>교환처</FormLabel>
                    <FormControl>
                      <Combobox
                        options={brands}
                        valueKey="id"
                        labelKey="name"
                        placeholder="전체"
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>공급사</FormLabel>
                    <FormControl>
                      <Combobox
                        options={supplies}
                        valueKey="id"
                        labelKey="name"
                        placeholder="전체"
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-2">
                <FormLabel>전시상태</FormLabel>
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
          </form>
        </Form>
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
        <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
          조회
        </Button>
      </CardFooter>
    </Card>
  )
})

ProductSearchForm.displayName = 'ProductSearchForm'
