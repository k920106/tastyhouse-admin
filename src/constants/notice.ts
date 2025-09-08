import { getTodayYYYYMMDD } from '@/src/lib/date-utils'

export const NOTICE_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항', href: '/notices' },
]

export const INITIAL_NOTICE_SEARCH_FORM = {
  companyId: '',
  title: '',
  startDate: getTodayYYYYMMDD(),
  endDate: getTodayYYYYMMDD(),
  active: 'all',
} as const
