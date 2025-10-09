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
import { Input } from '@/src/components/ui/Input'
import { SpinnerWithText } from '@/src/components/ui/SpinnerWithText'
import { api } from '@/src/lib/api'
import { ApiResponse } from '@/src/types/api'
import { ProductBulkResponse } from '@/src/types/product'
import { IconDownload } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface ProductBulkUpdateDialogProps {
  companyId: number | null
}

export function ProductBulkUpdateDialog({ companyId }: ProductBulkUpdateDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!selectedFile) return

    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await api.patch<ApiResponse<ProductBulkResponse>>(
        '/products/bulk/update',
        formData,
      )

      if (!response.success || !response.data) {
        throw new Error(response.message || '변경에 실패했습니다.')
      }

      toast.success(`${response.data.count}건의 상품이 업데이트되었습니다.`)

      setSelectedFile(null)
      setOpen(false)
    } catch (error) {
      console.error('상품 정보 일괄 변경 오류:', error)
      toast.error(
        error instanceof Error ? error.message : '변경에 실패했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadTemplate = async () => {
    try {
      setIsLoading(true)

      const response = await api.download<ApiResponse>(
        '/products/bulk/template/download',
        'template.xlsx',
      )
      if (!response.success) {
        throw new Error(response.message || '파일 양식 다운로드에 실패했습니다.')
      }

      setOpen(false)
    } catch (error) {
      console.error('파일 양식 다운로드 오류:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : '파일 양식 다운로드에 실패했습니다. 다시 시도해 주세요.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={!companyId}>
          상품 정보 일괄 변경
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>상품 일괄 변경</AlertDialogTitle>
          <AlertDialogDescription>
            파일에 포함된 상품코드만 수정 대상에 포함됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="flex-1 cursor-pointer">
              <Input
                type="file"
                accept=".xlsx,.xls"
                className="file:hidden"
                onChange={handleFileChange}
              />
            </label>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleDownloadTemplate}
              disabled={isLoading}
              title="파일 양식 다운로드"
            >
              <IconDownload className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setSelectedFile(null)} disabled={isLoading}>
            취소
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} disabled={isLoading || !selectedFile}>
            {isLoading ? <SpinnerWithText text="변경 중..." /> : '변경'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
