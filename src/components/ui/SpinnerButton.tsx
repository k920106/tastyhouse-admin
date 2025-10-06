import { Button, buttonVariants } from '@/src/components/ui/Button'
import { SpinnerWithText } from '@/src/components/ui/SpinnerWithText'
import { VariantProps } from 'class-variance-authority'
import React from 'react'

interface SpinnerButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  idleLabel: React.ReactNode
  loadingLabel: React.ReactNode
  isLoading: boolean
}

export function SpinnerButton({
  variant,
  idleLabel,
  loadingLabel,
  isLoading = false,
  ...props
}: SpinnerButtonProps) {
  return (
    <Button variant={variant} disabled={isLoading} {...props}>
      {isLoading ? <SpinnerWithText text={loadingLabel} /> : idleLabel}
    </Button>
  )
}
