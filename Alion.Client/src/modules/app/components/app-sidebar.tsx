import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/modules/app/user-menu/user-menu.view";
import { Link } from "@tanstack/react-router";
import { FrameIcon, LayoutDashboardIcon } from "lucide-react";
import { ThemeSwitcher } from "../theme-switcher/theme-switcher.view";

function _AppSidebar(props: React.PropsWithChildren) {
  return (
    <div className="pattern hidden sm:block">
      <Sidebar variant="floating" collapsible="icon">
        {props.children}
      </Sidebar>
    </div>
  );
}

function _AppSidebarHeader() {
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="hover:bg-card">
            <Link to="/home">
              <FrameIcon />
              <span>Alion</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function _AppSidebarContent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Mes Villages" asChild>
                <Link
                  to="/villages"
                  activeProps={{
                    className: "bg-muted",
                  }}
                >
                  <LayoutDashboardIcon />
                  <span>Mes Villages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu>
            <ThemeSwitcher />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function _AppSidebarFooter() {
  return (
    <SidebarFooter className="border-t">
      <UserMenu />
    </SidebarFooter>
  );
}

export const AppSidebar = Object.assign(_AppSidebar, {
  Content: _AppSidebarContent,
  Header: _AppSidebarHeader,
  Footer: _AppSidebarFooter,
});
