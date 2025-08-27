import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductSearchForm, ProductListItem } from '@/src/types/product'

interface ProductSearchState {
  searchForm: ProductSearchForm
  products: ProductListItem[]
  totalCount: number
  currentPage: number
  pageSize: number
  setSearchForm: (form: ProductSearchForm) => void
  updateSearchForm: (updates: Partial<ProductSearchForm>) => void
  resetSearchForm: () => void
  setProductsData: (
    products: ProductListItem[],
    paginationInfo: { draw: number; total: number; filtered: number },
    currentPage: number,
    pageSize: number
  ) => void
  resetProductsData: () => void
}

const initialSearchForm: ProductSearchForm = {
  companyId: 'all',
  productCode: '',
  name: '',
  brandId: 'all',
  supplyId: 'all',
  display: 'all',
}

export const useProductSearchStore = create<ProductSearchState>()(
  persist(
    (set) => ({
      searchForm: initialSearchForm,
      products: [],
      totalCount: 0,
      currentPage: 0,
      pageSize: 10,

      setSearchForm: (form: ProductSearchForm) => {
        set({ searchForm: form })
      },

      updateSearchForm: (updates: Partial<ProductSearchForm>) => {
        set((state) => ({
          searchForm: { ...state.searchForm, ...updates },
        }))
      },

      resetSearchForm: () => {
        set({ searchForm: initialSearchForm })
      },

      setProductsData: (products, paginationInfo, currentPage, pageSize) => {
        set({
          products,
          totalCount: paginationInfo.total,
          currentPage,
          pageSize,
        })
      },

      resetProductsData: () => {
        set({
          products: [],
          totalCount: 0,
          currentPage: 0,
          pageSize: 10,
        })
      },
    }),
    {
      name: 'product-search-store',
      partialize: (state) => ({
        searchForm: state.searchForm,
        products: state.products,
        totalCount: state.totalCount,
        currentPage: state.currentPage,
        pageSize: state.pageSize,
      }),
    },
  ),
)
