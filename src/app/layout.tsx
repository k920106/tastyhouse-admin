import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '../components/ui/Sonner'
import QueryProvider from '../providers/QueryProvider'

export const metadata: Metadata = {
  title: '테이스티하우스',
  description: '테이스티하우스 관리자',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <QueryProvider>
          <main>{children}</main>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
