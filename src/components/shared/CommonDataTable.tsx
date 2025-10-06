'use client'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import * as React from 'react'
import { useCallback } from 'react'

interface ColumnMeta {
  className?: string
}

import { TableRowSkeleton } from '@/src/components/ui/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/Table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/Pagination'
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

  // 현재 페이지가 속한 그룹의 시작 페이지 계산 (0-based)
  const currentGroup = Math.floor(currentPage / 5)
  const groupStartPage = currentGroup * 5
  const groupEndPage = Math.min(groupStartPage + 5, pageCount)

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
                        className={`text-center ${(header.column.columnDef.meta as ColumnMeta)?.className || ''}`}
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
                        className={`text-center ${(cell.column.columnDef.meta as ColumnMeta)?.className || ''}`}
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
        {totalCount > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (canPreviousPage && !loading) {
                    handlePageIndexChange(currentPage - 1)
                  }
                }}
                aria-disabled={!canPreviousPage || loading}
                className={!canPreviousPage || loading ? 'pointer-events-none opacity-50' : ''}
              />

              {groupStartPage > 0 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: groupEndPage - groupStartPage }, (_, i) => groupStartPage + i).map(
                (pageIndex) => (
                  <PaginationLink
                    key={pageIndex}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!loading && pageIndex !== currentPage) {
                        handlePageIndexChange(pageIndex)
                      }
                    }}
                    isActive={pageIndex === currentPage}
                    aria-disabled={loading || pageIndex === currentPage}
                    className={
                      loading || pageIndex === currentPage ? 'pointer-events-none opacity-50' : ''
                    }
                  >
                    {pageIndex + 1}
                  </PaginationLink>
                ),
              )}

              {groupEndPage < pageCount && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (canNextPage && !loading) {
                    handlePageIndexChange(currentPage + 1)
                  }
                }}
                aria-disabled={!canNextPage || loading}
                className={!canNextPage || loading ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
