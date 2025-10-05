'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'

interface CompanyComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  loading: boolean
}

export default function CompanyCombobox({
  value,
  onValueChange,
  loading = false,
}: CompanyComboboxProps) {
  const { data: companies = [], isLoading } = useCompaniesQuery()

  return (
    <Combobox
      width="w-full"
      options={companies}
      valueKey="id"
      labelKey="name"
      value={value || 'all'}
      onValueChange={onValueChange}
      disabled={loading || isLoading}
      disabledOptions={['all']}
    />
  )
}
