'use client'

import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Separator } from '@/src/components/ui/Separator'
import { Skeleton } from '@/src/components/ui/Skeleton'

export default function NoticeFormLoading() {
  return (
    <>
      <div role="status" className="sr-only">
        공지사항 페이지를 불러오는 중입니다...
      </div>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <Skeleton className="h-4 w-4 -ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 hidden md:block" />
            <Skeleton className="h-4 w-1 hidden md:block" />
            <Skeleton className="h-4 w-16 hidden md:block" />
          </div>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 min-h-[100vh] md:min-h-min">
          <Card className="w-full shadow-none">
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Skeleton className="h-9 w-16" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}
