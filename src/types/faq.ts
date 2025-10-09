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

export interface FaqSearchFormInput extends Record<string, unknown> {
  companyId: string
  companyName?: string
  title: string
  active: ActiveFilter
}

export interface FaqFormInput {
  companyId: string
  title: string
  content: string
  active: boolean
  sort: number
}

export const isFaqSearchKey = (key: string): boolean => {
  return ['companyId', 'companyName', 'title', 'active'].includes(key)
}

export interface FaqSearchQuery {
  companyId: number
  title: string | null
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
