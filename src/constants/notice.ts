import { ROUTES } from '@/src/constants/routes'
import { getTodayYYYYMMDD } from '@/src/lib/date-utils'
import { NoticeSearchFormInput } from '@/src/types/notice'

export const NOTICE_LIST_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항', href: ROUTES.NOTICES.LIST },
]

export const NOTICE_CREATE_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항', href: ROUTES.NOTICES.LIST },
  { label: '등록' },
]

export const NOTICE_DETAIL_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항', href: ROUTES.NOTICES.LIST },
  { label: '상세' },
]

export const NOTICE_UPDATE_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: '공지사항', href: ROUTES.NOTICES.LIST },
  { label: '상세' },
  { label: '수정' },
]

export const INITIAL_NOTICE_SEARCH_FORM = {
  companyId: 'all',
  title: '',
  active: 'all' as const,
}

export const INITIAL_NOTICE_CREATE_FORM = {
  companyId: 'all',
  title: '',
  content: '',
  active: false,
  top: false,
}

export const getInitialNoticeSearchForm = (): NoticeSearchFormInput => {
  return {
    ...INITIAL_NOTICE_SEARCH_FORM,
    companyName: undefined,
    startDate: getTodayYYYYMMDD(),
    endDate: getTodayYYYYMMDD(),
  }
}
