import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/ui/Breadcrumb'
import { DataTable } from '@/src/components/features/products/DataTable'
import { Input } from '@/src/components/ui/Input'
import { Label } from '@/src/components/ui/Label'
import { Separator } from '@/src/components/ui/Separator'
import { SidebarTrigger } from '@/src/components/ui/Sidebar'
import { columns } from '@/src/components/features/products/Columns'
import { Card, CardContent, CardFooter } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { LuDownload } from 'react-icons/lu'
import { ProductListItem } from '@/src/types/product'
import { Combobox } from '@/src/components/ui/Combobox'
import { Company } from '@/src/types/company'
import { Brand } from '@/src/types/brand'
import { Supply } from '@/src/types/\bsupply'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/Select'

const data: ProductListItem[] = [
  {
    id: 1,
    companyName: '테이스티하우스',
    productCode: 'G001',
    name: '한우 불고기 세트',
    brandName: '프리미엄한우',
    validityPeriod: 12,
    exhibitionPrice: 89000,
    regularPrice: 99000,
    supplier: 99000,
    display: true,
    sort: 1,
  },
  {
    id: 2,
    companyName: '테이스티하우스',
    productCode: 'G002',
    name: '유기농 쌀 10kg',
    brandName: '그린팜',
    validityPeriod: 6,
    exhibitionPrice: 35000,
    regularPrice: 42000,
    supplier: 42000,
    display: true,
    sort: 2,
  },
  {
    id: 3,
    companyName: '테이스티하우스',
    productCode: 'G003',
    name: '콜드브루 커피 1L',
    brandName: '커피마스터',
    validityPeriod: 3,
    exhibitionPrice: 12900,
    regularPrice: 15000,
    supplier: 15000,
    display: true,
    sort: 3,
  },
  {
    id: 4,
    companyName: '테이스티하우스',
    productCode: 'G004',
    name: '올리브 오일 500ml',
    brandName: '헬씨라이프',
    validityPeriod: 24,
    exhibitionPrice: 19500,
    regularPrice: 23000,
    supplier: 23000,
    display: true,
    sort: 4,
  },
  {
    id: 5,
    companyName: '테이스티하우스',
    productCode: 'G005',
    name: '캠핑 바비큐 세트',
    brandName: '캠프쿡',
    validityPeriod: 1,
    exhibitionPrice: 59000,
    regularPrice: 72000,
    supplier: 72000,
    display: true,
    sort: 5,
  },
  {
    id: 6,
    companyName: '테이스티하우스',
    productCode: 'G006',
    name: '프리미엄 김 세트',
    brandName: '청해수산',
    validityPeriod: 18,
    exhibitionPrice: 25000,
    regularPrice: 29000,
    supplier: 29000,
    display: true,
    sort: 6,
  },
  {
    id: 7,
    companyName: '테이스티하우스',
    productCode: 'G007',
    name: '천연 벌꿀 2kg',
    brandName: '허니팜',
    validityPeriod: 36,
    exhibitionPrice: 49000,
    regularPrice: 58000,
    supplier: 58000,
    display: true,
    sort: 7,
  },
  {
    id: 8,
    companyName: '테이스티하우스',
    productCode: 'G008',
    name: '홍삼 농축액 240g',
    brandName: '홍삼명가',
    validityPeriod: 24,
    exhibitionPrice: 89000,
    regularPrice: 110000,
    supplier: 110000,
    display: true,
    sort: 8,
  },
  {
    id: 9,
    companyName: '테이스티하우스',
    productCode: 'G009',
    name: '에어프라이어 전용 냉동만두',
    brandName: '맛집만두',
    validityPeriod: 12,
    exhibitionPrice: 9900,
    regularPrice: 12000,
    supplier: 12000,
    display: true,
    sort: 9,
  },
  {
    id: 10,
    companyName: '테이스티하우스',
    productCode: 'P010',
    name: '프리미엄 와인 세트',
    brandName: '비노클래식',
    validityPeriod: 60,
    exhibitionPrice: 129000,
    regularPrice: 159000,
    supplier: 159000,
    display: true,
    sort: 10,
  },
]

const companyData: Company[] = [
  {
    id: 1,
    name: '밴드 기프트샵',
  },
  {
    id: 2,
    name: 'IBK',
  },
  {
    id: 3,
    name: '아파트너',
  },
]

const brandData: Brand[] = [
  {
    id: 1,
    name: '스타벅스',
  },
  {
    id: 2,
    name: '투썸플레이스',
  },
  {
    id: 3,
    name: '메가커피',
  },
  {
    id: 4,
    name: '컴포즈커피',
  },
]

const supplyData: Supply[] = [
  {
    id: 1,
    name: '윈큐브마케팅',
  },
  {
    id: 2,
    name: '쿠프콘',
  },
  {
    id: 3,
    name: '슈퍼콘',
  },
  {
    id: 4,
    name: '스마트콘',
  },
]

export default function NoticePage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">상품</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>상품 관리</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>상품 목록</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex-1 min-h-[100vh] md:min-h-min">
          <Card className="w-full shadow-none">
            <CardContent>
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="companyName">매체사</Label>
                    <Combobox options={companyData} valueKey="id" labelKey="name" placeholder="-" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productCode">상품코드</Label>
                    <Input type="text" id="productCode" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">상품명</Label>
                    <Input type="text" id="name" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="brandName">교환처</Label>
                    <Combobox
                      options={brandData}
                      valueKey="id"
                      labelKey="name"
                      placeholder="전체"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">공급사</Label>
                    <Combobox
                      options={supplyData}
                      valueKey="id"
                      labelKey="name"
                      placeholder="전체"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="display">전시상태</Label>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="전체" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        <SelectItem value="true">전시</SelectItem>
                        <SelectItem value="false">미전시</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <Button type="button" variant="outline">
                상품 업데이트
              </Button>
              <Button type="button" variant="outline">
                전시상태 변경
              </Button>
              <Button type="button" variant="outline">
                상품 일괄 변경
              </Button>
              <Button type="button" variant="excel">
                엑셀 다운로드
                <LuDownload />
              </Button>
              <Button type="submit">조회</Button>
            </CardFooter>
          </Card>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  )
}
