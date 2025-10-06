'use client'

import React from 'react'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import BrandField from '@/src/components/forms/BrandField'
import CompanyField from '@/src/components/forms/CompanyField'
import SelectField from '@/src/components/forms/SelectField'
import SupplyField from '@/src/components/forms/SupplyField'
import TextField from '@/src/components/forms/TextField'
import { Form } from '@/src/components/ui/Form'
import { useProductSearchForm } from '@/src/hooks/product/useProductSearchForm'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'
import { useSearchFormKeyboard } from '@/src/hooks/useSearchFormKeyboard'
import { handleFormError } from '@/src/lib/form-utils'
import { PRODUCT_STATUS_OPTIONS, PROUDCT_DISPLAY_STATUS } from '@/src/types/product'

const ProductFilters = React.memo(function ProductFilters() {
  const { form, onSubmit, isLoading } = useProductSearchForm()
  const { data: companies = [] } = useCompaniesQuery()

  const { handleKeyDown } = useSearchFormKeyboard({
    onSubmit,
    isLoading,
  })

  const handleCompanyChange = (value: string) => {
    form.setValue('companyId', value)
    const selectedCompany = companies.find((c) => c.id.toString() === value)
    form.setValue('companyName', selectedCompany?.name)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, handleFormError)} onKeyDown={handleKeyDown}>
        <BaseSearchForm isLoading={isLoading}>
          <CompanyField
            control={form.control}
            name="companyId"
            disabled={isLoading}
            onValueChange={handleCompanyChange}
          />
          <TextField
            name="productCode"
            label="상품코드"
            control={form.control}
            disabled={isLoading}
          />
          <TextField name="name" label="상품명" control={form.control} disabled={isLoading} />
          <BrandField control={form.control} name="brandId" disabled={isLoading} />
          <SupplyField control={form.control} name="supplyId" disabled={isLoading} />
          <SelectField
            control={form.control}
            name="display"
            label="전시상태"
            options={PROUDCT_DISPLAY_STATUS}
            disabled={isLoading}
          />
          <SelectField
            control={form.control}
            name="status"
            label="상품상태"
            options={PRODUCT_STATUS_OPTIONS}
            disabled={isLoading}
          />
        </BaseSearchForm>
      </form>
    </Form>
  )
})

export default ProductFilters
