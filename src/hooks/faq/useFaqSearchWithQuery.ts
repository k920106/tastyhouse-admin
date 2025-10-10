'use client'

import { getInitialFaqSearchForm } from '@/src/constants/faq'
import { FaqSearchFormInput, isFaqSearchKey } from '@/src/types/faq'
import { useSearchWithQuery, type SearchWithQueryHookResult } from '../useSearchWithQuery'
import { useFaqsQuery, type FaqQueryData } from './useFaqQueries'

export type FaqSearchWithQueryHookResult = SearchWithQueryHookResult<
  FaqSearchFormInput,
  FaqQueryData
>

export const useFaqSearchWithQuery = (): FaqSearchWithQueryHookResult => {
  return useSearchWithQuery<FaqSearchFormInput, FaqQueryData>({
    getInitialForm: getInitialFaqSearchForm,
    isSearchKey: isFaqSearchKey,
    useQuery: useFaqsQuery,
    errorMessage: 'FAQ 목록 조회 중 오류가 발생했습니다.',
  })
}
