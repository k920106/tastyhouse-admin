import {
  DetailTableDoubleRow,
  DetailTableField,
  DetailTableRow,
} from '@/src/components/forms/DetailTable'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { buttonVariants } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { FAQ_DETAIL_BREADCRUMBS } from '@/src/constants/faq'
import { ROUTES } from '@/src/constants/routes'
import { cn } from '@/src/lib/class-utils'
import { Faq } from '@/src/types/faq'
import Link from 'next/link'

interface FaqDetailProps {
  faq: Faq
}

export default function FaqDetail({ faq }: FaqDetailProps) {
  return (
    <PageTemplate breadcrumbs={FAQ_DETAIL_BREADCRUMBS}>
      <Card className="w-full shadow-none">
        <CardContent>
          <table className="w-full border-collapse">
            <tbody className="border">
              <DetailTableDoubleRow>
                <DetailTableField label="매체사">{faq.companyName}</DetailTableField>
                <DetailTableField label="활성상태">
                  {faq.active ? '활성' : '비활성'}
                </DetailTableField>
              </DetailTableDoubleRow>
              <DetailTableDoubleRow>
                <DetailTableField label="우선순위">{faq.sort}</DetailTableField>
                <DetailTableField label="제목">{faq.title}</DetailTableField>
              </DetailTableDoubleRow>
              <DetailTableRow label="내용">
                <div className="whitespace-pre-wrap">{faq.content}</div>
              </DetailTableRow>
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Link
            href={ROUTES.FAQS.UPDATE(faq.id)}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            수정
          </Link>
        </CardFooter>
      </Card>
    </PageTemplate>
  )
}
