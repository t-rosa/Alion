import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import { AppLayout } from "./components/app-layout";
import { AppSidebar } from "./components/app-sidebar";

export function AppView() {
  return (
    <SidebarProvider>
      <AppSidebar>
        <AppSidebar.Header />
        <AppSidebar.Content />
        <AppSidebar.Footer />
      </AppSidebar>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </SidebarProvider>
  );
}
