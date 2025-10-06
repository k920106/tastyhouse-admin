'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'

interface CompanyComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled: boolean
}

export default function CompanyCombobox({
  value,
  onValueChange,
  disabled = false,
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
      disabled={disabled || isLoading}
      disabledOptions={['all']}
      allLabel="-"
    />
  )
}
