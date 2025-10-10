'use client'

import { getInitialProductSearchForm } from '@/src/constants/product'
import { ProductSearchFormInput, isProductSearchKey } from '@/src/types/product'
import { useSearchWithQuery, type SearchWithQueryHookResult } from '../useSearchWithQuery'
import { useProductsQuery, type ProductQueryData } from './useProductQueries'

export type ProductSearchWithQueryHookResult = SearchWithQueryHookResult<
  ProductSearchFormInput,
  ProductQueryData
>

export const useProductSearchWithQuery = (): ProductSearchWithQueryHookResult => {
  return useSearchWithQuery<ProductSearchFormInput, ProductQueryData>({
    getInitialForm: getInitialProductSearchForm,
    isSearchKey: isProductSearchKey,
    useQuery: useProductsQuery,
    errorMessage: '상품 목록 조회 중 오류가 발생했습니다.',
  })
}
