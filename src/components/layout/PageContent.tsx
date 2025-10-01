import { ReactNode, Suspense } from 'react'

interface PageContentProps {
  children: ReactNode
  fallback?: ReactNode
}

export default function PageContent({
  children,
  fallback = <div>로딩 중...</div>,
}: PageContentProps) {
  return (
    <div className="flex flex-1 flex-col gap-4 min-h-[100vh] md:min-h-min p-4 pt-0">
      <Suspense fallback={fallback}>{children}</Suspense>
    </div>
  )
}
