import React from 'react'

import { Spinner } from '@/src/components/ui/Spinner'
import { cn } from '@/src/lib/class-utils'

interface SpinnerWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: React.ReactNode
  spinnerClassName?: string
}

export function SpinnerWithText({
  text,
  spinnerClassName,
  className,
  ...props
}: SpinnerWithTextProps) {
  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <Spinner className={spinnerClassName} />
      {text}
    </div>
  )
}
