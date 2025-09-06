import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_SEARCH_FORM, ProductSearchForm } from '@/src/types/product'
import { INITIAL_PAGINATION } from '@/src/lib/constants'

interface ProductSearchState {
  searchForm: ProductSearchForm
  currentPage: number
  pageSize: number
  setSearchForm: (form: ProductSearchForm) => void
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
}

export const useProductSearchStore = create<ProductSearchState>()(
  persist(
    (set) => ({
      searchForm: INITIAL_SEARCH_FORM,
      ...INITIAL_PAGINATION,

      setSearchForm: (searchForm) => set({ searchForm }),
      setCurrentPage: (currentPage) => set({ currentPage }),
      setPageSize: (pageSize) => set({ pageSize }),
    }),
    {
      name: 'product-search-store',
      partialize: ({ searchForm, currentPage, pageSize }) => ({
        searchForm,
        currentPage,
        pageSize,
      }),
    },
  ),
)
