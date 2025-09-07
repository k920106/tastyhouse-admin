'use client'

import { Button } from '@/src/components/ui/Button'
import { Loader2Icon } from 'lucide-react'

interface SearchActionsProps {
  onSearch: () => void
  loading?: boolean
  children?: React.ReactNode
  searchText?: string
  className?: string
}

export default function SearchActions({
  onSearch,
  loading = false,
  children,
  searchText = '조회',
  className = '',
}: SearchActionsProps) {
  return (
    <div className={`flex justify-end gap-3 ${className}`}>
      {children}
      <Button type="button" onClick={onSearch} disabled={loading}>
        {loading ? <Loader2Icon className="animate-spin" /> : searchText}
      </Button>
    </div>
  )
}
