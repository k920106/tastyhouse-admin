'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/Input'
import { Calendar } from '@/src/components/ui/Calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/Popover'
import { Combobox } from '@/src/components/ui/Combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'
import { LuCalendar } from 'react-icons/lu'
import { useCompanyBrandSupplyQueries } from '@/src/hooks/queries/useCompanyBrandSupplyQueries'
import { Loader2Icon } from 'lucide-react'
import {
  NoticeSearchForm as NoticeSearchFormType,
  getNoticeUseStatusLabel,
} from '@/src/types/notice'
import { type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/src/lib/class-utils'

interface NoticeSearchFormProps {
  searchForm: NoticeSearchFormType
  loading: boolean
  updateSearchForm: (updates: Partial<NoticeSearchFormType>) => void
  handleSearch: () => void
}

export default function NoticeSearchForm({
  searchForm,
  loading: searchLoading,
  updateSearchForm,
  handleSearch,
}: NoticeSearchFormProps) {
  const { companies, loading } = useCompanyBrandSupplyQueries()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // searchForm의 startDate, endDate를 DateRange로 초기화
  useEffect(() => {
    if (searchForm.startDate || searchForm.endDate) {
      setDateRange({
        from: searchForm.startDate ? new Date(searchForm.startDate) : undefined,
        to: searchForm.endDate ? new Date(searchForm.endDate) : undefined,
      })
    }
  }, [searchForm.startDate, searchForm.endDate])

  // DateRange 변경 시 searchForm 업데이트
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)

    const updates: Partial<NoticeSearchFormType> = {}

    if (range?.from) {
      updates.startDate = format(range.from, 'yyyy-MM-dd')
    }

    if (range?.to) {
      updates.endDate = format(range.to, 'yyyy-MM-dd')
    }

    // 날짜가 선택되지 않았을 때는 기존 값을 제거
    if (!range?.from) {
      updates.startDate = undefined
    }

    if (!range?.to) {
      updates.endDate = undefined
    }

    updateSearchForm(updates)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      handleSearch()
    }
  }

  return (
    <Card className="w-full shadow-none">
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-medium">매체사</label>
            <Combobox
              options={companies}
              valueKey="id"
              labelKey="name"
              placeholder={loading ? '로딩 중...' : '-'}
              value={searchForm.companyId || 'all'}
              onValueChange={(value) => updateSearchForm({ companyId: value })}
              disabled={loading}
              disabledOptions={['all']}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">제목</label>
            <Input
              type="text"
              value={searchForm.title || ''}
              onChange={(e) => updateSearchForm({ title: e.target.value })}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">등록일자</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !dateRange && 'text-muted-foreground',
                  )}
                >
                  <LuCalendar className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'yyyy.MM.dd', { locale: ko })} -{' '}
                        {format(dateRange.to, 'yyyy.MM.dd', { locale: ko })}
                      </>
                    ) : (
                      format(dateRange.from, 'yyyy.MM.dd', { locale: ko })
                    )
                  ) : (
                    <span>-</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">사용 여부</label>
            <Select
              value={searchForm.active || 'all'}
              onValueChange={(value) => updateSearchForm({ active: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="true">{getNoticeUseStatusLabel(true)}</SelectItem>
                <SelectItem value="false">{getNoticeUseStatusLabel(false)}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button type="button" onClick={handleSearch} disabled={searchLoading}>
          {searchLoading ? <Loader2Icon className="animate-spin" /> : '조회'}
        </Button>
      </CardFooter>
    </Card>
  )
}
