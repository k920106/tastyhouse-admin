'use client'

import * as React from 'react'
import { AudioWaveform, Bot, Command, GalleryVerticalEnd, SquareTerminal } from 'lucide-react'

import { NavMain } from '@/src/components/ui/NavMain'
import { NavUser } from '@/src/components/ui/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/src/components/ui/Sidebar'
import { TeamSwitcher } from '@/src/components/ui/TeamSwitcher'
import { NavOrders } from '@/src/components/ui/NavOrders'
import { NavPromotions } from '@/src/components/ui/NavPromotions'
import { NavCenters } from '@/src/components/ui/NavCenters'
import { NavAccounts } from '@/src/components/ui/NavAccounts'

const data = {
  user: {
    name: '강민성',
    email: 'kms0902@wincubemkt.com',
    avatar: '/images/profile.png',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  products: [
    {
      title: '상품 관리',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: '상품 목록',
          url: '/products',
        },
      ],
    },
    {
      title: '카테고리 관리',
      url: '#',
      icon: Bot,
      items: [
        {
          title: '테마관',
          url: '/',
        },
        {
          title: '추천 상품',
          url: '/',
        },
        {
          title: '추천 브랜드',
          url: '/',
        },
      ],
    },
    {
      title: '콘텐츠 관리',
      url: '#',
      icon: Bot,
      items: [
        {
          title: '메인배너',
          url: '/',
        },
        {
          title: '팝업',
          url: '/',
        },
        {
          title: '추천 키워드',
          url: '/',
        },
      ],
    },
  ],
  orders: [
    {
      title: '주문 관리',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: '주문 내역',
          url: '/',
        },
      ],
    },
  ],
  promotions: [
    {
      title: '이벤트 관리',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: '할인쿠폰 관리',
          url: '/',
        },
        {
          title: '기획전 관리',
          url: '/',
        },
        {
          title: '룰렛 이벤트 관리',
          url: '/',
        },
        {
          title: '럭키박스 이벤트 관리',
          url: '/',
        },
      ],
    },
  ],
  centers: [
    {
      title: '게시판 관리',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: '공지사항',
          url: '/notices',
        },
        {
          title: 'FAQ',
          url: '/',
        },
      ],
    },
    {
      title: '문의 관리',
      url: '#',
      icon: Bot,
      items: [
        {
          title: '1:1 문의',
          url: '/',
        },
        {
          title: '답변 템플릿',
          url: '/',
        },
        {
          title: '문의 유형',
          url: '/',
        },
      ],
    },
  ],
  accounts: [
    {
      title: '계정 관리',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: '어드민 계정 정보',
          url: '/',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.products} />
        <NavOrders items={data.orders} />
        <NavPromotions items={data.promotions} />
        <NavCenters items={data.centers} />
        <NavAccounts items={data.accounts} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
