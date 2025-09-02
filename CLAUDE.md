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

## Code Quality & ESLint Rules

**CRITICAL: 코드 작성 시 반드시 준수해야 할 ESLint 규칙**

### 필수 ESLint 규칙들:
1. **`eol-last: 'error'`** - 모든 파일은 반드시 마지막에 개행으로 끝나야 함
2. **`unused-imports/no-unused-imports: 'error'`** - 사용하지 않는 import 금지
3. **`unused-imports/no-unused-vars: 'warn'`** - 사용하지 않는 변수는 `_` prefix 필요
4. **`semi: ['error', 'never']`** - 세미콜론 사용 금지
5. **`quotes: ['error', 'single']`** - 문자열에 단일 따옴표 사용
6. **`jsx-quotes: ['error', 'prefer-double']`** - JSX에서는 더블 따옴표 사용
7. **`comma-dangle: ['error', 'always-multiline']`** - 다중행에서 마지막 쉼표 필수

### Prettier 자동 포맷팅:
- `semi: false` - 세미콜론 제거
- `singleQuote: true` - 단일 따옴표 사용
- `trailingComma: 'all'` - 마지막 쉼표 항상 추가
- `printWidth: 100` - 한 줄 최대 100자
- `tabWidth: 2` - 들여쓰기 2칸

### 파일 작성 시 체크리스트:
- [ ] **파일 끝에 개행 추가** (가장 자주 놓치는 규칙!)
- [ ] 사용하지 않는 변수는 `_` prefix 또는 제거
- [ ] `any` 타입 대신 구체적인 타입 사용
- [ ] 세미콜론 제거, 단일 따옴표 사용
- [ ] JSX에서는 더블 따옴표 사용

### 코드 품질 검사:
```bash
npm run lint    # ESLint 검사 (오류 시 반드시 수정 필요)
npm run build   # TypeScript + ESLint 통합 검사
```

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