'use client'

import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import * as React from 'react'
import { useCallback } from 'react'

interface ColumnMeta {
  className?: string
}

import { Button } from '@/src/components/ui/Button'
import { Label } from '@/src/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { TableRowSkeleton } from '@/src/components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/Table'
interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  totalCount: number
  currentPage: number
  pageSize: number
  loading?: boolean
  handlePageChange: (pageIndex: number, pageSize: number) => void
  enableRowSelection?: boolean
  onRowSelectionChange?: (selectedRows: Record<string, boolean>) => void
  onRowClick?: (rowId: number | string) => void
}

export function CommonDataTable<T extends { id: number | string }>({
  columns,
  data,
  totalCount,
  currentPage,
  pageSize,
  loading = false,
  handlePageChange,
  enableRowSelection = false,
  onRowSelectionChange,
  onRowClick,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = React.useState({})

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  const handleRowSelectionChange = React.useCallback(
    (updater: React.SetStateAction<Record<string, boolean>>) => {
      setRowSelection((prev) => {
        const newSelection = typeof updater === 'function' ? updater(prev) : updater
        onRowSelectionChange?.(newSelection)
        return newSelection
      })
    },
    [onRowSelectionChange],
  )

  const table = useReactTable({
    columns,
    data,
    state: {
      rowSelection: enableRowSelection ? rowSelection : {},
      pagination: {
        pageIndex: currentPage,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row: T) => row.id.toString(),
    enableRowSelection: enableRowSelection && !loading,
    onRowSelectionChange: enableRowSelection ? handleRowSelectionChange : undefined,
    manualPagination: true,
    pageCount,
  })

  const canPreviousPage = currentPage > 0
  const canNextPage = currentPage < pageCount - 1

  const handlePageIndexChange = useCallback(
    (newPageIndex: number) => {
      if (newPageIndex >= 0 && newPageIndex < pageCount) {
        handlePageChange(newPageIndex, pageSize)
      }
    },
    [handlePageChange, pageCount, pageSize],
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      handlePageChange(0, newPageSize)
    },
    [handlePageChange],
  )

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4 overflow-auto">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={(header.column.columnDef.meta as ColumnMeta)?.className}
                      >
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
              {loading ? (
                <TableRowSkeleton columnCount={columns.length} />
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                    onClick={() => onRowClick?.(row.original.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={(cell.column.columnDef.meta as ColumnMeta)?.className}
                      >
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
          {enableRowSelection ? (
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          ) : (
            <div className="hidden flex-1 lg:flex" />
          )}
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${pageSize}`}
                disabled={loading}
                onValueChange={(value) => {
                  handlePageSizeChange(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {currentPage + 1} of {pageCount}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => handlePageIndexChange(0)}
                disabled={!canPreviousPage || loading}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => handlePageIndexChange(currentPage - 1)}
                disabled={!canPreviousPage || loading}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => handlePageIndexChange(currentPage + 1)}
                disabled={!canNextPage || loading}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => handlePageIndexChange(pageCount - 1)}
                disabled={!canNextPage || loading}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
