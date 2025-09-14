'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import BrandSelector from '@/src/components/forms/BrandSelector'
import CompanySelector from '@/src/components/forms/CompanySelector'
import SearchActions from '@/src/components/forms/SearchActions'
import SupplySelector from '@/src/components/forms/SupplySelector'
import { Button } from '@/src/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Input } from '@/src/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { type ProductSearchForm, getProductDisplayStatusLabel } from '@/src/types/product'
import { zodResolver } from '@hookform/resolvers/zod'
import { LuDownload } from 'react-icons/lu'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import * as z from 'zod'

const searchFormSchema = z.object({
  companyId: z.string().optional(),
  productCode: z.string().optional(),
  name: z.string().optional(),
  brandId: z.string().optional(),
  supplyId: z.string().optional(),
  display: z.string().optional(),
})

type SearchFormData = z.infer<typeof searchFormSchema>

interface ProductSearchFormProps {
  searchForm: ProductSearchForm
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void
  handleSearch: () => void
  loading: boolean
}

export default function ProductSearchForm({
  searchForm,
  updateSearchForm,
  handleSearch,
  loading: searchLoading,
}: ProductSearchFormProps) {
  const form = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      companyId: searchForm.companyId || '',
      productCode: searchForm.productCode || '',
      name: searchForm.name || '',
      brandId: searchForm.brandId || '',
      supplyId: searchForm.supplyId || '',
      display: searchForm.display || '',
    },
  })

  useEffect(() => {
    form.reset({
      companyId: searchForm.companyId || '',
      productCode: searchForm.productCode || '',
      name: searchForm.name || '',
      brandId: searchForm.brandId || '',
      supplyId: searchForm.supplyId || '',
      display: searchForm.display || '',
    })
  }, [searchForm, form])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      handleSearch()
    }
  }

  const handleSubmit = () => {
    handleSearch()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <BaseSearchForm
          actions={
            <SearchActions onSearch={form.handleSubmit(handleSubmit)} loading={searchLoading}>
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
            </SearchActions>
          }
        >
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">매체사</FormLabel>
                <FormControl>
                  <CompanySelector
                    label=""
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ companyId: value })
                    }}
                    loading={searchLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">상품코드</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e)
                      updateSearchForm({ productCode: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={searchLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">상품명</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e)
                      updateSearchForm({ name: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={searchLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">교환처</FormLabel>
                <FormControl>
                  <BrandSelector
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ brandId: value })
                    }}
                    loading={searchLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">공급사</FormLabel>
                <FormControl>
                  <SupplySelector
                    value={field.value || ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ supplyId: value })
                    }}
                    loading={searchLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="display"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">전시 여부</FormLabel>
                <FormControl>
                  <Select
                    value={field.value || ''}
                    defaultValue="all"
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ display: value })
                    }}
                    disabled={searchLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="true">{getProductDisplayStatusLabel(true)}</SelectItem>
                      <SelectItem value="false">{getProductDisplayStatusLabel(false)}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </BaseSearchForm>
      </form>
    </Form>
  )
}
