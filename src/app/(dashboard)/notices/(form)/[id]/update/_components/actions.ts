'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateNoticePaths(noticeId: number) {
  revalidatePath(`/notices/${noticeId}`)
}
