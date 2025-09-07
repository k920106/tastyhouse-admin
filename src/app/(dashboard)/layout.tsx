import { AppSidebar } from '@/src/components/layout/AppSidebar'
import { SidebarInset, SidebarProvider } from '@/src/components/ui/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
