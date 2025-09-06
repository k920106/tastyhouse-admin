import { ProductSearchForm } from '@/src/types/product'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * 상품 검색 폼 검증
 */
export const validateProductSearchForm = (form: ProductSearchForm): ValidationResult => {
  const errors: string[] = []

  // 매체사 필수 검증
  if (!form.companyId || form.companyId === 'all' || form.companyId === '') {
    errors.push('매체사를 선택해 주세요')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 빈 값 검증 유틸
 */
export const isEmptyValue = (value: string | undefined | null): boolean => {
  return !value || value === 'all' || value === ''
}
