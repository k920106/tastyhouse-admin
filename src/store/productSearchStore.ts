import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'

const INITIAL_SEARCH_FORM: ProductSearchForm = {
  companyId: 'all',
  productCode: '',
  name: '',
  brandId: 'all',
  supplyId: 'all',
  display: 'all',
}

const INITIAL_PAGINATION = {
  products: [] as ProductListItem[],
  totalCount: 0,
  currentPage: 0,
  pageSize: 10,
}

interface ProductSearchState {
  searchForm: ProductSearchForm
  products: ProductListItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  setSearchForm: (form: ProductSearchForm) => void
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void
  setProductsData: (
    products: ProductListItem[],
    paginationInfo: { total: number },
    currentPage: number,
    pageSize: number,
  ) => void
  updatePagination: (currentPage: number, pageSize: number) => void
  resetProductsData: () => void
}

export const useProductSearchStore = create<ProductSearchState>()(
  persist(
    (set) => ({
      searchForm: INITIAL_SEARCH_FORM,
      ...INITIAL_PAGINATION,

      setSearchForm: (form) => set({ searchForm: form }),

      updateSearchForm: (updates) =>
        set((state) => ({
          searchForm: { ...state.searchForm, ...updates },
        })),

      setProductsData: (products, paginationInfo, currentPage, pageSize) =>
        set({
          products,
          totalCount: paginationInfo.total,
          currentPage,
          pageSize,
        }),

      updatePagination: (currentPage, pageSize) => set({ currentPage, pageSize }),

      resetProductsData: () => set(INITIAL_PAGINATION),
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
