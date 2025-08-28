'use client'

import React, { useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

const productSearchSchema = z.object({
  companyId: z.string().optional(),
  productCode: z.string().optional(),
  name: z.string().optional(),
  brandId: z.string().optional(),
  supplyId: z.string().optional(),
  display: z.string().optional(),
})

type ProductSearchFormData = z.infer<typeof productSearchSchema>

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
  // Hydration 완료 후에만 폼 초기화
  const form = useForm<ProductSearchFormData>({
    resolver: zodResolver(productSearchSchema),
    defaultValues: {
      companyId: '',
      productCode: '',
      name: '',
      brandId: '',
      supplyId: '',
      display: 'all',
    },
    mode: 'onChange',
  })

  // 디버그용 로그
  React.useEffect(() => {
    console.log('Component state:', {
      _hasHydrated,
      'searchForm.display': searchForm.display,
      'searchForm full': searchForm,
    })
  }, [_hasHydrated, searchForm])

  // Hydration 완료 시 한 번만 실행
  const hasHydratedRef = React.useRef(false)
  React.useEffect(() => {
    if (_hasHydrated && !hasHydratedRef.current) {
      hasHydratedRef.current = true
      console.log('🔄 Hydration completed, setting form values:')
      console.log('  - searchForm.display:', searchForm.display)
      console.log('  - full searchForm:', searchForm)
      const newValues = {
        companyId: searchForm.companyId || '',
        productCode: searchForm.productCode || '',
        name: searchForm.name || '',
        brandId: searchForm.brandId || '',
        supplyId: searchForm.supplyId || '',
        display: searchForm.display || 'all',
      }
      console.log('🔄 New form values:')
      console.log('  - newValues.display:', newValues.display)
      console.log('  - full newValues:', newValues)
      // display 필드 제외하고 나머지만 form.setValue 사용
      Object.entries(newValues).forEach(([key, value]) => {
        if (key !== 'display') { // display는 직접 제어하므로 제외
          console.log(`🔧 Setting field ${key}:`, value)
          form.setValue(key as keyof ProductSearchFormData, value)
        }
      })
      console.log('🔄 Display field handled separately via Zustand')

      // reset 후 실제 값 확인
      setTimeout(() => {
        const formValues = form.getValues()
        console.log('📋 Form values after reset:')
        console.log('  - formValues.display:', formValues.display)
        console.log('  - full formValues:', formValues)
      }, 100)
    }
  }, [_hasHydrated, searchForm]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async (page: number = 0, size: number = 10) => {
    onLoadingChange?.(true)

    try {
      const formData = form.getValues()
      const requestData = {
        ...formData,
        companyId:
          formData.companyId && formData.companyId !== 'all'
            ? Number(formData.companyId)
            : undefined,
        brandId:
          formData.brandId && formData.brandId !== 'all'
            ? Number(formData.brandId)
            : undefined,
        supplyId:
          formData.supplyId && formData.supplyId !== 'all'
            ? Number(formData.supplyId)
            : undefined,
        display:
          formData.display && formData.display !== 'all'
            ? formData.display === 'true'
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

      setProductsData(response.data, response.pagination, page, size)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('오류가 발생하였습니다.')
    } finally {
      onLoadingChange?.(false)
    }
  }

  const onSubmit = (data: ProductSearchFormData) => {
    // Zustand 스토어 업데이트
    updateSearchForm(data)
    // API 호출
    fetchProducts(0, 10)
  }

  useImperativeHandle(ref, () => ({
    refetch: fetchProducts,
  }))

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
                      <Input
                        type="text"
                        placeholder="상품코드 입력"
                        {...field}
                      />
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
                      <Input
                        type="text"
                        placeholder="상품명 입력"
                        {...field}
                      />
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
                <Select
                  value={_hasHydrated ? searchForm.display || 'all' : 'all'}
                  onValueChange={(value) => {
                    console.log('🔍 Direct Select onValueChange:', value)
                    updateSearchForm({ display: value })
                    form.setValue('display', value, { shouldValidate: true })
                  }}
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
