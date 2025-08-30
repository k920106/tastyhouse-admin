## 패키지구조

[App Router 활용]  
app/ 디렉토리에서 파일 기반 라우팅 사용  
Route Groups (auth), (dashboard) 로 관련 페이지 그룹화  
loading.tsx, error.tsx 등 특수 파일들로 UX 개선

[컴포넌트 분류]  
ui/: 재사용 가능한 기본 UI 컴포넌트  
forms/: 폼 관련 컴포넌트  
layout/: 레이아웃 컴포넌트  
features/: 기능별 비즈니스 로직 컴포넌트

[유틸리티 및 설정]  
lib/: 공통 유틸리티 함수들  
hooks/: 커스텀 React 훅  
store/: 상태 관리 (Zustand 추천)  
types/: TypeScript 타입 정의

[_components, components 차이]  
\_components 폴더  
ㄴ 해당 라우트에서만 사용하는 단순한 UI 컴포넌트

components 폴더  
ㄴ 여러 곳에서 재사용될 수 있는 컴포넌트 (예시: src/components/features/products/components)  
ㄴ 도메인별 비즈니스 로직을 포함한 재사용 가능한 컴포넌트

```
tastyhouse-admin/
├── public/
│ ├── images/
│ ├── icons/
│ └── favicon.ico
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ └── signup/
│ │ │ └── page.tsx
│ │ ├── (dashboard)/
│ │ │ ├── dashboard/
│ │ │ │ ├── page.tsx
│ │ │ │ └── loading.tsx
│ │ │ └── settings/
│ │ │ └── page.tsx
│ │ ├── api/
│ │ │ ├── auth/
│ │ │ │ └── route.ts
│ │ │ └── users/
│ │ │ │ └── route.ts
│ │ ├── globals.css
│ │ ├── layout.tsx
│ │ ├── loading.tsx
│ │ ├── error.tsx
│ │ ├── not-found.tsx
│ │ └── page.tsx
│ ├── components/
│ │ ├── ui/
│ │ │ ├── button.tsx
│ │ │ ├── input.tsx
│ │ │ ├── modal.tsx
│ │ │ └── index.ts
│ │ ├── forms/
│ │ │ ├── LoginForm.tsx
│ │ │ └── ContactForm.tsx
│ │ ├── layout/
│ │ │ ├── Header.tsx
│ │ │ ├── Sidebar.tsx
│ │ │ └── Footer.tsx
│ │ └── features/
│ │ ├── auth/
│ │ │ ├── LoginButton.tsx
│ │ │ └── AuthProvider.tsx
│ │ └── dashboard/
│ │ ├── DashboardCard.tsx
│ │ └── UserProfile.tsx
│ ├── lib/
│ │ ├── utils.ts
│ │ ├── validations.ts
│ │ ├── constants.ts
│ │ ├── auth.ts
│ │ └── api.ts
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useLocalStorage.ts
│ │ └── useApi.ts
│ ├── store/
│ │ ├── authStore.ts
│ │ ├── userStore.ts
│ │ └── index.ts
│ ├── types/
│ │ ├── auth.ts
│ │ ├── user.ts
│ │ └── api.ts
│ └── styles/
│ ├── globals.css
│ └── components.css
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```
