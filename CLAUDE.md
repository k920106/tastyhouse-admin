# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TastyHouse Admin** is a Next.js 15 admin dashboard for managing TastyHouse operations. Built with React 19, TypeScript, and Tailwind CSS.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture & Stack

**Framework**: Next.js 15 with App Router
- Route groups: `(auth)`, `(dashboard)` for logical organization
- Special files: `loading.tsx`, `error.tsx`, `not-found.tsx` for UX

**UI Framework**: 
- shadcn/ui components with Radix UI primitives
- Tailwind CSS v4 for styling
- Lucide React and Tabler Icons for icons
- Sonner for toast notifications

**State Management**: Zustand with persist middleware
- Store pattern: `src/store/[feature]Store.ts`
- Example: `productSearchStore.ts` handles product search state with localStorage persistence

**Data Fetching**: Custom API client (`src/lib/api.ts`)
- Centralized fetch wrapper with timeout, error handling
- TypeScript-first with generic responses
- Base URL: `process.env.NEXT_PUBLIC_API_URL` or localhost fallback

**Component Organization**:
- `components/ui/` - Reusable UI primitives (Button, Input, etc.)
- `components/features/` - Business logic components organized by feature
- `components/forms/` - Form-specific components
- `components/layout/` - Layout components (Header, Sidebar, Footer)

## Key Patterns

**Type Definitions**: Well-structured types in `src/types/`
- Separate files by domain: `product.ts`, `auth.ts`, `company.ts`, etc.
- Consistent naming: `[Entity]ListItem`, `[Entity]SearchForm`

**API Integration**: DataTables-style responses
- Standard pagination format with `draw`, `total`, `filtered` properties
- Error handling with toast notifications via Sonner

**Routing Structure**:
```
app/
├── (auth)/login/          # Authentication pages
├── (dashboard)/           # Main dashboard with sidebar layout
│   ├── products/          # Product management
│   └── events/roulettes/  # Event management
└── api/                   # API routes
```

**State Persistence**: Zustand stores use `persist` middleware
- Search forms and filters maintain state across page refreshes
- Partial state persistence for performance

## Component Development

**Import Paths**: 
- Components: `@/src/components/ui/[Component]`
- Types: `@/src/types/[domain]`
- Store: `@/src/store/[feature]Store`
- Utils: `@/src/lib/[utility]`

**Form Components**: Use forwardRef pattern for imperative APIs
- Example: `ProductSearchForm` exposes `refetch` method
- Integrate with Zustand stores for state management

**Data Tables**: 
- Use `@tanstack/react-table` for table functionality
- Separate `Columns.tsx` and `DataTable.tsx` components
- Integrate with search forms and pagination

## Environment & Configuration

- TypeScript strict mode enabled
- ESLint with Next.js config and Prettier integration
- Tailwind CSS with component-level styling
- shadcn/ui configuration in `components.json`

## Korean Language Support

The application supports Korean language:
- Page titles and descriptions in Korean
- Component labels and UI text in Korean
- API responses may contain Korean content

**IMPORTANT: Claude 응답 언어 정책**
- Claude는 이 프로젝트에서 **무조건 한국어로만** 답변해야 합니다
- 모든 설명, 오류 메시지, 코드 주석은 한국어로 작성
- 기술적 용어는 한국어로 번역하되, 필요시 영어 원문을 괄호 안에 병기
- 예외: 코드 자체, 변수명, 함수명, 라이브러리명은 영어 유지