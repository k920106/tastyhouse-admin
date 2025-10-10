'use client'

import { getInitialNoticeSearchForm } from '@/src/constants/notice'
import { NoticeSearchFormInput, isNoticeSearchKey } from '@/src/types/notice'
import { useSearchWithQuery, type SearchWithQueryHookResult } from '../useSearchWithQuery'
import { useNoticesQuery, type NoticeQueryData } from './useNoticeQueries'

export type NoticeSearchWithQueryHookResult = SearchWithQueryHookResult<
  NoticeSearchFormInput,
  NoticeQueryData
>

export const useNoticeSearchWithQuery = (): NoticeSearchWithQueryHookResult => {
  return useSearchWithQuery<NoticeSearchFormInput, NoticeQueryData>({
    getInitialForm: getInitialNoticeSearchForm,
    isSearchKey: isNoticeSearchKey,
    useQuery: useNoticesQuery,
    errorMessage: '공지사항 목록 조회 중 오류가 발생했습니다.',
  })
}
