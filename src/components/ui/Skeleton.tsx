import { cn } from '@/src/lib/class-utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

function TableRowSkeleton({ columnCount = 6 }: { columnCount?: number }) {
  return (
    <>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b">
          <td colSpan={columnCount} className="p-2">
            <Skeleton className="h-[20px] w-full" />
          </td>
        </tr>
      ))}
    </>
  )
}

export { Skeleton, TableRowSkeleton }
