import {
  DetailTableDoubleRow,
  DetailTableField,
  DetailTableRow,
} from '@/src/components/forms/DetailTable'
import PageTemplate from '@/src/components/layout/PageTemplate'
import { buttonVariants } from '@/src/components/ui/Button'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { NOTICE_DETAIL_BREADCRUMBS } from '@/src/constants/notice'
import { ROUTES } from '@/src/constants/routes'
import { cn } from '@/src/lib/class-utils'
import { formatToYYYYMMDDHHMMSS } from '@/src/lib/date-utils'
import { Notice, getNoticeTopStatusLabel } from '@/src/types/notice'
import Link from 'next/link'

interface NoticeDetailProps {
  notice: Notice
}

export default function NoticeDetail({ notice }: NoticeDetailProps) {
  return (
    <PageTemplate breadcrumbs={NOTICE_DETAIL_BREADCRUMBS}>
      <Card className="w-full shadow-none">
        <CardContent>
          <table className="w-full border-collapse">
            <tbody className="border">
              <DetailTableDoubleRow>
                <DetailTableField label="매체사">{notice.companyName}</DetailTableField>
                <DetailTableField label="등록일자">
                  {formatToYYYYMMDDHHMMSS(notice.createdAt)}
                </DetailTableField>
              </DetailTableDoubleRow>
              <DetailTableDoubleRow>
                <DetailTableField label="활성상태">
                  {notice.active ? '활성' : '비활성'}
                </DetailTableField>
                <DetailTableField label="상단 고정">
                  {getNoticeTopStatusLabel(notice.top)}
                </DetailTableField>
              </DetailTableDoubleRow>
              <DetailTableRow label="제목">{notice.title}</DetailTableRow>
              <DetailTableRow label="내용">
                <div className="whitespace-pre-wrap">{notice.content}</div>
              </DetailTableRow>
            </tbody>
          </table>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Link
            href={ROUTES.NOTICES.UPDATE(notice.id)}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            수정
          </Link>
        </CardFooter>
      </Card>
    </PageTemplate>
  )
}
