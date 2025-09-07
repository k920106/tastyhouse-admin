'use client'

import { Button } from '@/src/components/ui/Button'
import { LuDownload } from 'react-icons/lu'
import { useBrandsQuery, useSuppliesQuery } from '@/src/hooks/queries/useCompanyBrandSupplyQueries'
import {
  ProductSearchForm as ProductSearchFormType,
  getProductDisplayStatusLabel,
} from '@/src/types/product'
import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import TextSearchField from '@/src/components/forms/TextSearchField'
import GenericSelector from '@/src/components/forms/GenericSelector'
import StatusSelector from '@/src/components/forms/StatusSelector'
import SearchActions from '@/src/components/forms/SearchActions'

interface ProductSearchFormProps {
  searchForm: ProductSearchFormType
  loading: boolean
  updateSearchForm: (updates: Partial<ProductSearchFormType>) => void
  handleSearch: () => void
}

export default function ProductSearchForm({
  searchForm,
  loading: searchLoading,
  updateSearchForm,
  handleSearch,
}: ProductSearchFormProps) {
  const { data: brands = [], isLoading: brandsLoading } = useBrandsQuery()
  const { data: supplies = [], isLoading: suppliesLoading } = useSuppliesQuery()
  const loading = brandsLoading || suppliesLoading

  return (
    <BaseSearchForm
      actions={
        <SearchActions onSearch={handleSearch} loading={searchLoading}>
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
      <CompanySelector
        label="매체사"
        value={searchForm.companyId}
        onValueChange={(value) => updateSearchForm({ companyId: value })}
        disabledOptions={['all']}
        loading={searchLoading}
      />
      <TextSearchField
        label="상품코드"
        value={searchForm.productCode || ''}
        onChange={(value) => updateSearchForm({ productCode: value })}
        onSearch={handleSearch}
        loading={searchLoading}
      />
      <TextSearchField
        label="상품명"
        value={searchForm.name || ''}
        onChange={(value) => updateSearchForm({ name: value })}
        onSearch={handleSearch}
        loading={searchLoading}
      />
      <GenericSelector
        label="교환처"
        value={searchForm.brandId}
        onValueChange={(value) => updateSearchForm({ brandId: value })}
        options={brands}
        loading={loading}
      />
      <GenericSelector
        label="공급사"
        value={searchForm.supplyId}
        onValueChange={(value) => updateSearchForm({ supplyId: value })}
        options={supplies}
        loading={loading}
      />
      <StatusSelector
        label="전시 여부"
        value={searchForm.display}
        onValueChange={(value) => updateSearchForm({ display: value })}
        getLabel={getProductDisplayStatusLabel}
        loading={searchLoading}
      />
    </BaseSearchForm>
  )
}
