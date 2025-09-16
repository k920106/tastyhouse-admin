'use client'

import { useCallback, useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import * as z from 'zod'
import { type DateRange } from 'react-day-picker'

import { type NoticeSearchForm } from '@/src/types/notice'
import { formatToAPIDate } from '@/src/lib/date-utils'
import { validateNoticeSearchForm } from '@/src/lib/validations/notice'
import { parseSearchParamsToForm } from '@/src/lib/url-utils'
import { INITIAL_NOTICE_SEARCH_FORM } from '@/src/constants/notice'
import { useNoticeSearchWithQuery } from './useNoticeSearchWithQuery'

// Zod 스키마와 타입 통합 - 타입 안정성 향상
const searchFormSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.string(),
}) satisfies z.ZodType<NoticeSearchForm>

export const useNoticeFilters = () => {
  const { updateUrl, isLoading } = useNoticeSearchWithQuery()
  const searchParams = useSearchParams()

  // URL에서 초기 검색 조건 파싱 (페이지 로드 시 한 번만)
  const initialSearchForm = useMemo(
    () => parseSearchParamsToForm(searchParams, INITIAL_NOTICE_SEARCH_FORM),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // 로컬 검색 폼 상태 (검색 버튼 클릭 전까지 URL에 반영되지 않음)
  const [localSearchForm, setLocalSearchForm] = useState<NoticeSearchForm>(initialSearchForm)

  // 날짜 변환 로직 분리 - 성능 최적화
  const parseDateSafely = useCallback((dateString: string) => {
    if (!dateString) return undefined
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? undefined : date
  }, [])

  // 날짜 범위 생성 유틸 함수 - 복잡도 감소
  const createDateRange = useCallback(
    (startDate: string, endDate: string): DateRange | undefined => {
      const to = parseDateSafely(endDate)
      const from = parseDateSafely(startDate)
      return from || to ? { from, to } : undefined
    },
    [parseDateSafely],
  )

  // 기본값을 일관성 있게 처리하는 헬퍼 함수 - 타입 안정성 향상
  const getFormValues = useCallback(
    (searchForm: NoticeSearchForm): NoticeSearchForm => ({
      companyId: searchForm.companyId ?? '',
      title: searchForm.title ?? '',
      startDate: searchForm.startDate ?? '',
      endDate: searchForm.endDate ?? '',
      active: searchForm.active ?? '',
    }),
    [],
  )

  // 폼 값 메모이제이션으로 성능 최적화
  const formValues = useMemo(() => getFormValues(localSearchForm), [localSearchForm, getFormValues])

  // 날짜 범위 메모이제이션 - 단순화된 로직
  const dateRange = useMemo(
    () => createDateRange(formValues.startDate, formValues.endDate),
    [formValues.startDate, formValues.endDate, createDateRange],
  )

  // React Hook Form 설정
  const form = useForm<NoticeSearchForm>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: formValues,
  })

  // 폼 리셋 로직 최적화
  useEffect(() => {
    form.reset(formValues)
  }, [form, formValues])

  // 검색 폼 업데이트
  const updateSearchForm = useCallback((updates: Partial<NoticeSearchForm>) => {
    setLocalSearchForm(
      (prev) =>
        ({
          ...prev,
          ...Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined)),
        }) as NoticeSearchForm,
    )
  }, [])

  // 날짜 범위 선택 핸들러
  const handleDateRangeSelect = useCallback(
    (range: DateRange | undefined) => {
      const newStartDate = range?.from ? formatToAPIDate(range.from) : ''
      const newEndDate = range?.to ? formatToAPIDate(range.to) : ''

      form.setValue('startDate', newStartDate)
      form.setValue('endDate', newEndDate)

      updateSearchForm({
        startDate: newStartDate,
        endDate: newEndDate,
      })
    },
    [form, updateSearchForm],
  )

  // 검색 실행
  const handleSearch = useCallback(() => {
    const validation = validateNoticeSearchForm(localSearchForm)

    if (!validation.isValid) {
      validation.errors.forEach((error) => toast.error(error))
      return
    }

    // 검색 조건을 URL에 반영하여 쿼리 실행 (페이지는 0으로 리셋)
    updateUrl(localSearchForm, 0)
  }, [localSearchForm, updateUrl])

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch()
      }
    },
    [handleSearch],
  )

  // 폼 제출 핸들러
  const handleSubmit = useCallback(() => {
    handleSearch()
  }, [handleSearch])

  return {
    // Form 관련
    form,
    formValues,

    // 날짜 관련
    dateRange,
    handleDateRangeSelect,

    // 검색 관련
    handleSearch,
    handleSubmit,
    handleKeyDown,
    updateSearchForm,

    // 상태
    isLoading,
  }
}
