'use client'

import BaseSearchForm from '@/src/components/forms/BaseSearchForm'
import CompanySelector from '@/src/components/forms/CompanySelector'
import DateRangePicker from '@/src/components/forms/DateRangePicker'
import SearchActions from '@/src/components/forms/SearchActions'
import StatusSelector from '@/src/components/forms/StatusSelector'
import TextSearchField from '@/src/components/forms/TextSearchField'
import {
  NoticeSearchForm as NoticeSearchFormType,
  getNoticeUseStatusLabel,
} from '@/src/types/notice'

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
  const handleDateRangeChange = (startDate?: string, endDate?: string) => {
    updateSearchForm({ startDate, endDate })
  }

  return (
    <BaseSearchForm actions={<SearchActions onSearch={handleSearch} loading={searchLoading} />}>
      <CompanySelector
        label="매체사"
        value={searchForm.companyId}
        onValueChange={(value) => updateSearchForm({ companyId: value })}
        disabledOptions={['all']}
        loading={searchLoading}
      />
      <TextSearchField
        label="제목"
        value={searchForm.title || ''}
        onChange={(value) => updateSearchForm({ title: value })}
        onSearch={handleSearch}
        loading={searchLoading}
      />
      <DateRangePicker
        label="등록일자"
        startDate={searchForm.startDate}
        endDate={searchForm.endDate}
        onDateRangeChange={handleDateRangeChange}
        loading={searchLoading}
      />
      <StatusSelector
        label="사용 여부"
        value={searchForm.active}
        onValueChange={(value) => updateSearchForm({ active: value })}
        getLabel={getNoticeUseStatusLabel}
        loading={searchLoading}
      />
    </BaseSearchForm>
  )
}

/*
  handleDateRangeChange 함수를 DateRangePicker 안에 넣으면 부적합합니다.

  현재 구조가 올바른 이유:

  1. 재사용성: DateRangePicker는 범용 컴포넌트로 설계되어 특정 폼의 상태 업데이트 로직을
  포함하면 안 됩니다
  2. 관심사 분리: 날짜 범위 선택 UI와 상태 관리는 별개 책임입니다
  3. 유연성: 다른 컴포넌트에서 DateRangePicker를 사용할 때 각각 다른 상태 업데이트 방식이
  필요할 수 있습니다

  현재처럼 DateRangePicker는 onDateRangeChange props로 콜백을 받고, 각 부모
  컴포넌트(NoticeSearchForm, ProductSearchForm 등)에서 해당 폼에 맞는 상태 업데이트 로직을
  구현하는 것이 적절한 설계입니다.
 */
