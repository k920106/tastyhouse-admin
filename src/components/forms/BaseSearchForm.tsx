'use client'

import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { SpinnerButton } from '../ui/SpinnerButton'

interface BaseSearchFormProps {
  className?: string
  children: React.ReactNode
  isLoading: boolean
}

export default function BaseSearchForm({
  className = '',
  children,
  isLoading,
}: BaseSearchFormProps) {
  return (
    <Card className={`w-full shadow-none ${className}`}>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {children}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <SpinnerButton
          type="submit"
          idleLabel="조회"
          loadingLabel="조회 중..."
          isLoading={isLoading}
        />
      </CardFooter>
    </Card>
  )
}
