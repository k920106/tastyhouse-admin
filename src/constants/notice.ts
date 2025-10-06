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

/**
 * 공지사항 검색 폼 초기값 (날짜 제외)
 * URL이 비어있을 때 기본값으로 사용
 */
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

/**
 * 공지사항 검색 폼 초기값을 생성하는 팩토리 함수
 * 날짜 값이 동적으로 생성되므로 함수로 제공
 */
export const getInitialNoticeSearchForm = (): NoticeSearchFormInput => {
  return {
    ...INITIAL_NOTICE_SEARCH_FORM,
    companyName: undefined,
    startDate: getTodayYYYYMMDD(),
    endDate: getTodayYYYYMMDD(),
  }
}
