'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'

interface Company {
  id: number
  name: string
}

interface CompanyComboboxProps {
  value: string | undefined
  onValueChange: (value: string) => void
  onCompanySelect?: (company: Company | null) => void
  disabled: boolean
}

export default function CompanyCombobox({
  value,
  onValueChange,
  onCompanySelect,
  disabled = false,
}: CompanyComboboxProps) {
  const { data: companies = [], isLoading } = useCompaniesQuery()

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue)

    if (onCompanySelect) {
      const selectedCompany = companies.find((c) => c.id.toString() === newValue)
      onCompanySelect(selectedCompany || null)
    }
  }

  return (
    <Combobox
      width="w-full"
      options={companies}
      valueKey="id"
      labelKey="name"
      value={value || 'all'}
      onValueChange={handleValueChange}
      disabled={disabled || isLoading}
      disabledOptions={['all']}
      allLabel="-"
    />
  )
}
