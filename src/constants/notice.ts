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
  { label: '공지사항' },
  { label: '공지사항 등록', href: ROUTES.NOTICES.CREATE },
]

/**
 * 공지사항 검색 폼 초기값을 생성하는 팩토리 함수
 * 날짜 값이 동적으로 생성되므로 함수로 제공
 */
export const getInitialNoticeSearchForm = (): NoticeSearchFormInput => ({
  companyId: '',
  title: '',
  startDate: getTodayYYYYMMDD(),
  endDate: getTodayYYYYMMDD(),
  active: 'all',
})
