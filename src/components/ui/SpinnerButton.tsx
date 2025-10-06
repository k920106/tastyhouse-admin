import { Button, buttonVariants } from '@/src/components/ui/Button'
import { Spinner } from '@/src/components/ui/Spinner'
import { VariantProps } from 'class-variance-authority'
import React from 'react'

interface SpinnerButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

export function SpinnerButton({
  isLoading = false,
  children,
  disabled,
  variant,
  size,
  className,
  asChild,
  ...props
}: SpinnerButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      asChild={asChild}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          {children} 중...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
