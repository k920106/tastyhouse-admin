'use client'

import { Button } from '@/src/components/ui/Button'
import { Loader2Icon } from 'lucide-react'

interface SearchActionsProps {
  children?: React.ReactNode
  onSearch: () => void
  loading: boolean
}

export default function SearchActions({ children, onSearch, loading = false }: SearchActionsProps) {
  return (
    <>
      {children}
      <Button type="button" onClick={onSearch} disabled={loading}>
        {loading ? <Loader2Icon className="animate-spin" /> : '조회'}
      </Button>
    </>
  )
}
