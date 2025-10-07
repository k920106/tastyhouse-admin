import { ActiveFilter } from './common'

export interface Faq {
  id: number
  companyId: number
  companyName: string
  title: string
  content: string
  active: boolean
  sort: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface FaqSearchFormInput {
  companyId: string
  companyName?: string
  title: string
  startDate: string
  endDate: string
  active: ActiveFilter
}

export interface FaqFormInput {
  companyId: string
  title: string
  content: string
  active: boolean
  sort: number
}

export const isFaqSearchKey = (key: string): key is keyof FaqSearchFormInput => {
  return ['companyId', 'companyName', 'title', 'startDate', 'endDate', 'active'].includes(key)
}

export interface FaqSearchQuery {
  companyId: number
  title: string | null
  startDate: string
  endDate: string
  active: boolean | null
}

export interface FaqCreateRequest {
  companyId: number
  title: string
  content: string
  active: boolean
  sort: number
}

export interface FaqCreateResponse {
  id: number
}

export interface FaqUpdateRequest {
  companyId: number
  title: string
  content: string
  active: boolean
  sort: number
}

export type FaqCreateFormInput = FaqFormInput
export type FaqUpdateFormInput = FaqFormInput
