'use client'

import ProductSearchForm from '@/src/components/features/products/ProductSearchForm'
import ProductDataTable from '@/src/components/features/products/ProductDataTable'
import { useProductSearchWithQuery } from '@/src/hooks/useProductSearchWithQuery'

export default function ProductManagement() {
  const productSearchHook = useProductSearchWithQuery()

  return (
    <>
      <ProductSearchForm
        searchForm={productSearchHook.searchForm}
        loading={productSearchHook.loading}
        updateSearchForm={productSearchHook.updateSearchForm}
        handleSearch={productSearchHook.handleSearch}
      />
      <ProductDataTable
        products={productSearchHook.products}
        totalCount={productSearchHook.totalCount}
        currentPage={productSearchHook.currentPage}
        pageSize={productSearchHook.pageSize}
        loading={productSearchHook.loading}
        handlePageChange={productSearchHook.handlePageChange}
      />
    </>
  )
}

/*
  사용자가 useProductSearch.ts 훅의 loading 상태를 ProductManagement.tsx 컴포넌트에서 관리하는 것에 대한 의견을 묻고
  있습니다.

  현재 구조를 보면:
  1. useProductSearch 훅 내부에서 useState(false)로 loading 상태를 관리하고 있음
  2. ProductManagement 컴포넌트에서는 이 loading 상태를 받아서 자식 컴포넌트들(ProductSearchForm, ProductDataTable)에
   전달하고 있음

  사용자가 묻는 것은 이 loading 상태 관리를 훅에서 하지 않고 ProductManagement 컴포넌트에서 직접 관리하는 것이
  어떤지에 대한 의견인 것 같습니다.

  이에 대한 장단점을 생각해보면:

  현재 구조 (훅에서 loading 관리)의 장점:
  - 관련 로직이 한 곳에 응집되어 있음
  - 재사용성이 좋음 (다른 컴포넌트에서도 사용 가능)
  - 컴포넌트는 UI 렌더링에만 집중할 수 있음

  컴포넌트에서 loading 관리하는 구조의 장점:
  - 컴포넌트가 더 많은 제어권을 가질 수 있음
  - loading 상태에 대한 더 복잡한 로직이 필요할 때 유연함

  프로젝트의 맥락과 요구사항에 따라 최적의 접근 방식이 달라질 수 있습니다. 대부분의 경우 현재 구조가 더 깔끔하고
  모듈화된 접근 방식을 제공합니다. 상태 관리의 일관성과 재사용성을 고려할 때 훅에서 loading 상태를 관리하는 것이
  선호됩니다.

⏺ 현재 구조가 더 적절하다고 생각합니다.

  현재 구조의 장점:
  - 데이터 페칭과 관련된 로딩 상태가 비즈니스 로직과 함께 훅에서 관리되어 응집도가 높음
  - ProductManagement 컴포넌트는 UI 조합에만 집중할 수 있음
  - 다른 컴포넌트에서 useProductSearch 훅을 재사용할 때도 일관된 로딩 상태 제공

  컴포넌트에서 관리할 경우의 단점:
  - 컴포넌트가 데이터 로딩 상태까지 관리하게 되어 책임이 증가
  - 훅의 재사용성이 떨어짐
  - fetchProducts 함수와 로딩 상태가 분리되어 동기화 이슈 가능성

  다만, 만약 ProductManagement 컴포넌트에서 추가적인 로딩 상태 제어가 필요하다면 (예: 초기 로딩과 검색 로딩을
  구분해야 하는 경우) 컴포넌트 레벨에서 관리하는 것도 고려해볼 수 있습니다.

  현재 코드는 단일 책임 원칙을 잘 지키고 있어 유지하는 것을 권장합니다.
 */
