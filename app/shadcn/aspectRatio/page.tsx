import Image from 'next/image'

import { AspectRatio } from '@/components/ui/AspectRatio'

export default function Page() {
  return (
    <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
      <Image
        src="/images/tastyhouse_width.png"
        alt="Photo by Drew Beamer"
        fill
        className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </AspectRatio>
  )
}
