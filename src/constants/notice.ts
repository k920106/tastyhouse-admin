import { getTodayYYYYMMDD } from '@/src/lib/date-utils'

export const INITIAL_NOTICE_SEARCH_FORM = {
  companyId: '',
  title: '',
  startDate: getTodayYYYYMMDD(),
  endDate: getTodayYYYYMMDD(),
  active: 'all',
} as const
