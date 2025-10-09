'use client'

import { ListPageLayout } from '@/src/components/shared/ListPageLayout'
import { ROUTES } from '@/src/constants/routes'
import { useProductSearchWithQuery } from '@/src/hooks/product/useProductSearchWithQuery'
import { getTableData } from '@/src/lib/table-utils'
import { PRODUCT_COLUMNS } from './ProductColumns'
import { ProductBulkUpdateDialog } from './dialog/ProductBulkUpdateDialog'
import { ProductSyncAlertDialog } from './dialog/ProductSyncAlertDialog'

export default function ProductList() {
  const { currentPage, pageSize, updateUrl, data, isLoading, urlSearchForm } =
    useProductSearchWithQuery()

  const companyId = urlSearchForm.companyId ? Number(urlSearchForm.companyId) : null

  return (
    <ListPageLayout
      columns={PRODUCT_COLUMNS}
      data={getTableData(isLoading, data?.products)}
      totalElements={data?.totalElements || 0}
      currentPage={currentPage}
      pageSize={pageSize}
      loading={isLoading}
      updateUrl={updateUrl}
      detailRoute={ROUTES.PRODUCTS.DETAIL}
      companyName={urlSearchForm.companyName}
    >
      <ProductSyncAlertDialog companyId={companyId} />
      <ProductBulkUpdateDialog companyId={companyId} />
    </ListPageLayout>
  )
}
