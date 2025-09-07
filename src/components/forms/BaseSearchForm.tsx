'use client'

import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'

interface BaseSearchFormProps {
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function BaseSearchForm({
  children,
  actions,
  className = '',
}: BaseSearchFormProps) {
  return (
    <Card className={`w-full shadow-none ${className}`}>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {children}
        </div>
      </CardContent>
      {actions && (
        <CardFooter className="flex justify-end gap-3">
          {actions}
        </CardFooter>
      )}
    </Card>
  )
}
