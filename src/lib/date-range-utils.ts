import { type DateRange } from 'react-day-picker'
import { formatToDisplayDate } from './date-utils'

/**
 * 날짜 범위 표시 텍스트 생성 유틸 함수 - 가독성 향상
 */
export const formatDateRangeDisplay = (range: DateRange | undefined): string => {
  if (!range?.from) return '날짜를 선택해주세요'
  if (!range.to) return formatToDisplayDate(range.from)
  return `${formatToDisplayDate(range.from)} - ${formatToDisplayDate(range.to)}`
}
