import { NextResponse } from 'next/server'
import { CompanyListItem } from '@/src/types/company'

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/companies`, {
      next: { revalidate: 3600 }, // 1시간 캐싱
    })

    if (!res.ok) {
      throw new Error('매체사 데이터 조회 오류 발생')
    }

    const companies: CompanyListItem[] = await res.json()
    return NextResponse.json(companies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json([], { status: 500 })
  }
}
