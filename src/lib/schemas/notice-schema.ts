import { NoticeFormInput, NoticeSearchFormInput, NoticeSearchQuery } from '@/src/types/notice'
import * as z from 'zod'

export const noticeSearchFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  companyName: z.string().optional(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.enum(['all', 'true', 'false']),
}) satisfies z.ZodType<NoticeSearchFormInput>

export const noticeSearchQuerySchema = noticeSearchFormSchema.transform(
  (data): NoticeSearchQuery => ({
    companyId: parseInt(data.companyId),
    title: data.title.trim() || null,
    startDate: data.startDate,
    endDate: data.endDate,
    active: data.active === 'all' ? null : data.active === 'true',
  }),
)

export const noticeFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  title: z.string().min(1, '제목을 입력해 주세요'),
  content: z.string().min(1, '내용을 입력해 주세요'),
  active: z.boolean(),
  top: z.boolean(),
}) satisfies z.ZodType<NoticeFormInput>
