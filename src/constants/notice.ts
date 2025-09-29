import { getTodayYYYYMMDD } from '@/src/lib/date-utils'
import { ROUTES } from '@/src/constants/routes'

export const NOTICE_LIST_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항', href: ROUTES.NOTICES.LIST },
]

export const NOTICE_CREATE_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항' },
  { label: '공지사항 등록', href: ROUTES.NOTICES.CREATE },
]

export const INITIAL_NOTICE_SEARCH_FORM = {
  companyId: '',
  title: '',
  startDate: getTodayYYYYMMDD(),
  endDate: getTodayYYYYMMDD(),
  active: 'all',
} as const
