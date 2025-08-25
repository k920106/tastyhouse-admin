'use client'

import * as React from 'react'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/src/components/ui/Sidebar'

import Image from 'next/image'

const data = {
  company: {
    image: '/images/logo.png',
  },
}

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
          <a>
            <div className="w-[20px] h-[20px] overflow-hidden rounded-full">
              <Image src={data.company.image} width={20} height={20} alt="로고" />
            </div>
            <span className="text-base font-semibold">테이스티하우스</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
