'use client'

import * as React from 'react'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/src/components/ui/Sidebar'

import Image from 'next/image'

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
          <a>
            <div className="w-[20px] h-[20px] overflow-hidden rounded-full">
              <Image src="/images/logo.png" width={20} height={20} alt="로고" />
            </div>
            <span className="text-base font-semibold">테이스티하우스</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
