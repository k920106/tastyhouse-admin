'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/src/components/ui/AlertDialog'
import { Button } from '@/src/components/ui/Button'
import { SpinnerWithText } from '@/src/components/ui/SpinnerWithText'
import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { ProductSyncRequest, ProductSyncResponse } from '@/src/types/product'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProductSyncAlertDialogProps {
  companyId: number | null
}

export function ProductSyncAlertDialog({ companyId }: ProductSyncAlertDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProduct = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!companyId) {
      toast.error('매체사를 선택해주세요.')
      return
    }

    try {
      setIsLoading(true)

      const request: ProductSyncRequest = {
        companyId,
      }
      const response = await api.post<ApiResponse<ProductSyncResponse>>('/products/sync', request)
      if (!response.success) {
        throw new Error(response.message || '')
      }

      toast.success('상품이 업데이트되었습니다.')

      setIsOpen(false)
    } catch (error) {
      console.error(error)
      toast.error(
        error instanceof Error ? error.message : '업데이트에 실패했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !isLoading && setIsOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={!companyId}>
          상품 업데이트
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>상품 업데이트</AlertDialogTitle>
          <AlertDialogDescription>상품을 업데이트하시겠습니까?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdateProduct} disabled={isLoading}>
            {isLoading ? <SpinnerWithText text="업데이트 중..." /> : '확인'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
