'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import SearchField from './SearchField'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'

interface CompanySelectorProps {
  label?: string
  value: string | undefined
  onValueChange: (value: string) => void
  disabledOptions?: string[]
  loading: boolean
}

export default function CompanySelector({
  label = '매체사',
  value,
  onValueChange,
  disabledOptions,
  loading = false,
}: CompanySelectorProps) {
  const { data: companies = [], isLoading } = useCompaniesQuery()

  return (
    <SearchField label={label}>
      <Combobox
        options={companies}
        valueKey="id"
        labelKey="name"
        value={value || 'all'}
        onValueChange={onValueChange}
        disabled={loading || isLoading}
        disabledOptions={disabledOptions}
      />
    </SearchField>
  )
}
