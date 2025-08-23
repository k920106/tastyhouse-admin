import type { Metadata } from 'next'
import './globals.css'

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
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
