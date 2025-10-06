'use client'

import * as React from 'react'
import { SquareTerminal, ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/ui/Collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/src/components/ui/Sidebar'
import { TeamSwitcher } from '@/src/components/ui/TeamSwitcher'
import { NavUser } from '@/src/components/ui/NavUser'

const data = {
  user: {
    name: '강민성',
    email: 'kms0902@wincubemkt.com',
    avatar: '/images/profile.png',
  },
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
    // {
    //   title: '카테고리 관리',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: '테마관',
    //       url: '/',
    //     },
    //     {
    //       title: '추천 상품',
    //       url: '/',
    //     },
    //     {
    //       title: '추천 브랜드',
    //       url: '/',
    //     },
    //   ],
    // },
    // {
    //   title: '콘텐츠 관리',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: '메인배너',
    //       url: '/',
    //     },
    //     {
    //       title: '팝업',
    //       url: '/',
    //     },
    //     {
    //       title: '추천 키워드',
    //       url: '/',
    //     },
    //   ],
    // },
  ],
  // orders: [
  //   {
  //     title: '주문 관리',
  //     url: '#',
  //     icon: SquareTerminal,
  //     isActive: true,
  //     items: [
  //       {
  //         title: '주문 내역',
  //         url: '/',
  //       },
  //     ],
  //   },
  // ],
  // promotions: [
  //   {
  //     title: '이벤트 관리',
  //     url: '#',
  //     icon: SquareTerminal,
  //     isActive: true,
  //     items: [
  //       {
  //         title: '할인쿠폰 관리',
  //         url: '/events/coupons',
  //       },
  //       {
  //         title: '기획전 관리',
  //         url: '/',
  //       },
  //       {
  //         title: '룰렛 이벤트 관리',
  //         url: '/events/roulettes',
  //       },
  //       {
  //         title: '럭키박스 이벤트 관리',
  //         url: '/',
  //       },
  //     ],
  //   },
  // ],
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
          url: '/faqs',
        },
      ],
    },
    // {
    //   title: '문의 관리',
    //   url: '#',
    //   icon: Bot,
    //   items: [
    //     {
    //       title: '1:1 문의',
    //       url: '/',
    //     },
    //     {
    //       title: '답변 템플릿',
    //       url: '/',
    //     },
    //     {
    //       title: '문의 유형',
    //       url: '/',
    //     },
    //   ],
    // },
  ],
  // accounts: [
  //   {
  //     title: '계정 관리',
  //     url: '#',
  //     icon: SquareTerminal,
  //     isActive: true,
  //     items: [
  //       {
  //         title: '어드민 계정 정보',
  //         url: '/',
  //       },
  //     ],
  //   },
  // ],
}

function NavSection({
  items,
  title,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
  title: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavSection items={data.products} title="상품" />
        {/* <NavSection items={data.orders} title="주문" /> */}
        {/* <NavSection items={data.promotions} title="프로모션" /> */}
        <NavSection items={data.centers} title="고객센터" />
        {/* <NavSection items={data.accounts} title="계정" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
