'use client'

import { Combobox } from '@/src/components/ui/Combobox'
import { useCompaniesQuery } from '@/src/hooks/queries/useCompanyQueries'
import SearchField from './SearchField'

interface CompanySelectorProps {
  label: string
  value: string | undefined
  onValueChange: (value: string) => void
  loading: boolean
}

export default function CompanySelector({
  label = '매체사',
  value,
  onValueChange,
  loading = false,
}: CompanySelectorProps) {
  const { data: companies = [], isLoading } = useCompaniesQuery()

  return (
    <SearchField label={label}>
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
    </SearchField>
  )
}
