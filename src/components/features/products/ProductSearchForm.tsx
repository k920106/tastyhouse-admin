'use client'

import { useCallback } from 'react'
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
import { ProductSearchForm as ProductSearchFormType } from '@/src/types/product'
import { useCompanyBrandSupply } from '@/src/hooks/useCompanyBrandSupply'
import { useProductSearch } from '@/src/hooks/useProductSearch'

interface ProductSearchFormProps {}

export default function ProductSearchForm({}: ProductSearchFormProps) {
  const { searchForm, updateSearchForm, handleSearch, loading: searchLoading } = useProductSearch()
  const { companies, brands, supplies, loading } = useCompanyBrandSupply()
  const handleDisplayChange = useCallback(
    (value: string) => {
      updateSearchForm({ display: value })
    },
    [updateSearchForm],
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
              placeholder={loading ? '로딩 중...' : '-'}
              value={searchForm.companyId || 'all'}
              onValueChange={(value) => updateSearchForm({ companyId: value })}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">상품코드</label>
            <Input
              type="text"
              value={searchForm.productCode || ''}
              onChange={(e) => updateSearchForm({ productCode: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">상품명</label>
            <Input
              type="text"
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
              placeholder={loading ? '로딩 중...' : '전체'}
              value={searchForm.brandId || 'all'}
              onValueChange={(value) => updateSearchForm({ brandId: value })}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">공급사</label>
            <Combobox
              options={supplies}
              valueKey="id"
              labelKey="name"
              placeholder={loading ? '로딩 중...' : '전체'}
              value={searchForm.supplyId || 'all'}
              onValueChange={(value) => updateSearchForm({ supplyId: value })}
              disabled={loading}
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
        <Button type="button" onClick={handleSearch} disabled={searchLoading}>
          {searchLoading ? '조회 중...' : '조회'}
        </Button>
      </CardFooter>
    </Card>
  )
}
