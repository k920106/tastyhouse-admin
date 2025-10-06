import { FaqFormInput } from '@/src/types/faq'
import * as z from 'zod'

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
