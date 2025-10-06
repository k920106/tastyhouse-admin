'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateFaqPaths(faqId: number) {
  revalidatePath(`/faqs/${faqId}`)
  revalidatePath('/faqs')
}
