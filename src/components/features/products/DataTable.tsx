'use client'

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import * as React from 'react'
import { z } from 'zod'

import { Button } from '@/src/components/ui/Button'

import { Label } from '@/src/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/Table'
import { Tabs, TabsContent } from '@/src/components/ui/Tabs'

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})

export function DataTable<T extends { id: number }>({
  columns,
  data: initialData,
}: {
  columns: ColumnDef<T>[]
  data: T[]
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    columns,
    data: initialData,
    // 이걸 넣어주면 테이블이 내부적으로 자동 관리하는 게 아니라, 외부 useState로 관리하는 상태랑 동기화돼요.
    state: {
      rowSelection, // 선택된 행(row)들을 관리하는 상태
      pagination, // 현재 페이지, 페이지 크기 등을 관리하는 상태
    },
    getCoreRowModel: getCoreRowModel(), // 테이블에서 기본 Row Model(행 구조) 을 생성하는 함수 -> 필수적으로 넣어줘야 테이블이 데이터를 읽어서 기본 행(row)을 만들 수 있어요.
    getRowId: (row: T) => row.id.toString(), // 각 데이터 행에 고유한 ID를 지정하는 방법. -> 기본값은 rowIndex, 하지만 보통 DB id 같은 걸 쓰는 게 좋아요.
    enableRowSelection: true, // 행 선택 기능을 켤지 여부. 체크박스 선택 같은 걸 쓸 때 필요해요.
    onRowSelectionChange: setRowSelection, // 행 선택이 바뀔 때 실행되는 콜백 함수. -> 보통 useState의 setter를 넣어 상태를 업데이트합니다.
    onPaginationChange: setPagination, // 페이지네이션 정보(현재 페이지, 페이지 크기 등)가 바뀔 때 호출되는 콜백 함수.
    // getFilteredRowModel: getFilteredRowModel(), // 필터링된 데이터 모델을 만드는 함수. -> filters 상태랑 같이 쓰여서 검색/필터 기능을 구현할 때 필요.
    // getPaginationRowModel: getPaginationRowModel(), // 페이지네이션 적용 후의 행 데이터 모델. -> "전체 데이터 중 현재 페이지에 보여줄 데이터"를 계산해줘요.
    // getSortedRowModel: getSortedRowModel(), // 정렬된 데이터를 만드는 Row Model. -> 컬럼 헤더 클릭하면 오름/내림차순 정렬 같은 걸 처리해줍니다.
    // getFacetedRowModel: getFacetedRowModel(), // Faceted Filtering 기능. -> 필터 UI에서 특정 컬럼 값들을 집계해서 보여줄 때 사용(예: "카테고리별 필터", "태그별 필터").
    // getFacetedUniqueValues: getFacetedUniqueValues(), // Faceted Filtering 기능. -> 필터 UI에서 특정 컬럼 값들을 집계해서 보여줄 때 사용(예: "카테고리별 필터", "태그별 필터").
  })

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"></div>
      </div>
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    조회 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="past-performance" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="focus-documents" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}
