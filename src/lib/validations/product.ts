import { ValidationResult } from '@/src/types/common'
import { ProductSearchForm } from '@/src/types/product'

/**
 * 상품 검색 폼 검증
 */
export const validateProductSearchForm = (form: ProductSearchForm): ValidationResult => {
  // 매체사 필수 검증
  if (!form.companyId || form.companyId === 'all' || form.companyId === '') {
    return {
      isValid: false,
      error: '매체사를 선택해 주세요',
    }
  }

  return {
    isValid: true,
  }
}
