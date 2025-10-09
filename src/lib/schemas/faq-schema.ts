import { FaqFormInput, FaqSearchFormInput, FaqSearchQuery } from '@/src/types/faq'
import * as z from 'zod'

export const faqSearchFormSchema = z.object({
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
}) satisfies z.ZodType<FaqSearchFormInput>

export const faqSearchQuerySchema = faqSearchFormSchema.transform(
  (data): FaqSearchQuery => ({
    companyId: parseInt(data.companyId),
    title: data.title.trim() || null,
    startDate: data.startDate,
    endDate: data.endDate,
    active: data.active === 'all' ? null : data.active === 'true',
  }),
)

export const faqFormSchema = z.object({
  companyId: z
    .string()
    .min(1, '매체사를 선택해 주세요')
    .refine((value) => value !== 'all', {
      message: '매체사를 선택해 주세요',
    }),
  title: z.string().min(1, '제목을 입력해 주세요'),
  content: z.string().min(1, '내용을 입력해 주세요'),
  active: z.boolean(),
  sort: z.number().min(0, '우선순위는 0 이상이어야 합니다'),
}) satisfies z.ZodType<FaqFormInput>
