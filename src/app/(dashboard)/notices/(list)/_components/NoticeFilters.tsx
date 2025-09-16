'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import { Button } from '@/src/components/ui/Button'
import { Calendar } from '@/src/components/ui/Calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/Form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { Input } from '@/src/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { Loader2Icon } from 'lucide-react'
import { LuCalendar } from 'react-icons/lu'
import Link from 'next/link'

import { getNoticeUseStatusLabel } from '@/src/types/notice'
import { useNoticeFilters } from '@/src/hooks/notice/useNoticeFilters'
import { formatDateRangeDisplay } from '@/src/lib/date-range-utils'
import { cn } from '@/src/lib/class-utils'

// TODO
/**
 *
 * ⏺ 공지사항 리스트 페이지 개선점 분석

  🎯 주요 개선 영역

  1. 성능 최적화

  - NoticeFilters:167: 불필요한 리렌더링 발생
    - updateSearchForm 호출 시마다 로컬 상태 업데이트로 인한 과도한 렌더링
    - 디바운싱 없는 실시간 입력 처리로 성능 저하
  - 해결책: useDeferredValue 적용, 입력 디바운싱 구현

  2. 사용자 경험 (UX) 개선

  - page.tsx:9: 로딩 폴백이 너무 단순함
    - 현재: <div>Loading...</div>
    - 개선: 스켈레톤 UI로 더 나은 로딩 경험 제공
  - NoticeFilters.tsx:46-55: 버튼 상태 관리 미흡
    - 조회 중일 때 다른 액션 버튼들도 비활성화 필요

  3. 접근성 (Accessibility) 강화

  - NoticeFilters.tsx:109-111: 날짜 선택 버튼의 접근성 부족
    - aria-label은 있지만 aria-expanded 속성 누락
  - NoticeColumns.tsx:17: 테이블 셀에 aria-label 추가 필요

  4. 타입 안전성 개선

  - useNoticeFilters.ts:93-98: 타입 단언 사용으로 안전성 위험
    - as NoticeSearchForm 대신 명시적 타입 검증 필요
  - NoticeSearchForm: 옵셔널 필드 처리 불일치

  5. 코드 구조 최적화

  - useNoticeFilters.ts:32-36: 의존성 배열 주석 처리는 안티패턴
    - ESLint 규칙 우회보다는 올바른 의존성 관리 필요
  - NoticeList.tsx:13-19: 콜백 함수의 과도한 의존성

  6. 에러 처리 강화

  - 전체적: 네트워크 오류 시 재시도 메커니즘 부재
  - useNoticeSearchWithQuery.ts:85: 에러 토스트만으로는 부족
    - 에러 복구 액션 버튼 추가 필요

  7. 상태 관리 일관성

  - 이중 상태 관리: localSearchForm과 urlSearchForm 동기화 복잡성
  - 해결책: 단일 상태 소스로 단순화

  🚀 우선순위별 개선 권장사항

  High Priority:
  1. 성능 최적화 (디바운싱, 메모이제이션)
  2. 타입 안전성 강화
  3. 에러 처리 개선

  Medium Priority:
  1. UX 개선 (스켈레톤 UI, 버튼 상태)
  2. 접근성 강화
  3. 상태 관리 단순화

  Low Priority:
  1. 코드 구조 리팩토링
  2. 주석 및 문서화 개선
 */

export default function NoticeFilters() {
  const {
    form,
    dateRange,
    handleDateRangeSelect,
    handleSubmit,
    handleKeyDown,
    updateSearchForm,
    isLoading,
  } = useNoticeFilters()

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <BaseSearchForm
          actions={
            <>
              <Button type="button" variant="outline" asChild>
                <Link href="/notices/create">등록</Link>
              </Button>
              <Button type="button" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    조회 중...
                  </>
                ) : (
                  '조회'
                )}
              </Button>
            </>
          }
        >
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">매체사</FormLabel>
                <FormControl>
                  <CompanySelector
                    label=""
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ companyId: value })
                    }}
                    loading={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">제목</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value ?? ''}
                    onChange={(e) => {
                      field.onChange(e)
                      updateSearchForm({ title: e.target.value })
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel className="font-semibold">등록일자</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    disabled={isLoading}
                    aria-label={dateRange?.from ? '선택된 날짜 범위 수정' : '날짜 범위 선택'}
                    aria-describedby="date-range-description"
                    aria-haspopup="dialog"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateRange && 'text-muted-foreground',
                    )}
                  >
                    <LuCalendar className="h-4 w-4" />
                    {formatDateRangeDisplay(dateRange)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={2}
                    aria-label="날짜 범위 달력"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">사용 여부</FormLabel>
                <FormControl>
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(value) => {
                      field.onChange(value)
                      updateSearchForm({ active: value })
                    }}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="true">{getNoticeUseStatusLabel(true)}</SelectItem>
                      <SelectItem value="false">{getNoticeUseStatusLabel(false)}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </BaseSearchForm>
      </form>
    </Form>
  )
}
