'use client'

import { Skeleton } from '@/src/components/ui/Skeleton'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Separator } from '@/src/components/ui/Separator'

export default function PageListSkeleton() {
  return (
    <>
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
          <div className="space-y-4">
            {' '}
            <Card className="w-full shadow-none">
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Skeleton className="h-9 w-16" />
              </CardFooter>
            </Card>
            <div className="w-full flex-col justify-start gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"></div>
              </div>
              <div className="relative flex flex-col gap-4 overflow-auto">
                <div className="overflow-hidden rounded-lg border">
                  <div className="bg-muted">
                    <div className="border-b">
                      <div className="grid grid-cols-6 gap-4 p-4">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </div>
                  </div>
                  <div className="h-24 flex items-center justify-center">
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex items-center justify-between px-4">
                  <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <div className="flex w-fit items-center justify-center">
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                      <Skeleton className="hidden h-8 w-8 lg:flex" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="hidden h-8 w-8 lg:flex" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
