'use client'

import { useState } from 'react'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { NOTICE_CREATE_BREADCRUMBS } from '@/src/constants/notice'
import { Button } from '@/src/components/ui/Button'

import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import CompanySelector from '@/src/components/forms/CompanySelector'
import BooleanRadioGroup from '@/src/components/forms/BooleanRadioGroup'
import TextSearchField from '@/src/components/forms/TextSearchField'
import TextareaField from '@/src/components/forms/TextareaField'

export default function NoticeCreate() {
  const [formData, setFormData] = useState({
    companyId: '',
    isActive: false,
    title: '',
    content: '',
    isPinned: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <PageTemplate breadcrumbs={NOTICE_CREATE_BREADCRUMBS}>
      <Card className={'w-full shadow-none'}>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <CompanySelector
              label="매체사"
              value={formData.companyId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, companyId: value }))}
              loading={false}
            />
            <BooleanRadioGroup
              label="사용 여부"
              trueLabel="사용"
              falseLabel="미사용"
              value={formData.isActive}
              onChange={(value) => setFormData((prev) => ({ ...prev, isActive: value }))}
            />
            <BooleanRadioGroup
              label="상단 고정"
              trueLabel="적용"
              falseLabel="미적용"
              value={formData.isPinned}
              onChange={(value) => setFormData((prev) => ({ ...prev, isPinned: value }))}
            />
            <TextSearchField
              label="제목"
              value={formData.title}
              onChange={(value) => setFormData((prev) => ({ ...prev, title: value }))}
              loading={false}
            />
            <TextareaField
              label="내용"
              value={formData.content}
              onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              rows={15}
              id="content"
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="submit">등록</Button>
        </CardFooter>
      </Card>
    </PageTemplate>
  )
}
