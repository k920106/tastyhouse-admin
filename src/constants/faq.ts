import { ROUTES } from '@/src/constants/routes'
import { getTodayYYYYMMDD } from '@/src/lib/date-utils'
import { FaqSearchFormInput } from '@/src/types/faq'

export const FAQ_LIST_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: 'FAQ', href: ROUTES.FAQS.LIST },
]

export const FAQ_CREATE_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: 'FAQ', href: ROUTES.FAQS.LIST },
  { label: '등록' },
]

export const FAQ_DETAIL_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: 'FAQ', href: ROUTES.FAQS.LIST },
  { label: '상세' },
]

export const FAQ_UPDATE_BREADCRUMBS = [
  { label: '고객센터' },
  { label: '게시판' },
  { label: 'FAQ', href: ROUTES.FAQS.LIST },
  { label: '상세' },
  { label: '수정' },
]

export const INITIAL_FAQ_SEARCH_FORM = {
  companyId: 'all',
  title: '',
  active: 'all' as const,
}

export const INITIAL_FAQ_CREATE_FORM = {
  companyId: 'all',
  title: '',
  content: '',
  active: false,
  sort: 0,
}

export const getInitialFaqSearchForm = (): FaqSearchFormInput => {
  return {
    ...INITIAL_FAQ_SEARCH_FORM,
    companyName: undefined,
    startDate: getTodayYYYYMMDD(),
    endDate: getTodayYYYYMMDD(),
  }
}
