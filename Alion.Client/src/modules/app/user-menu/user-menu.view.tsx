import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/use-user";
import { Authorize } from "@/modules/auth/components/authorize";
import { LogoutView } from "@/modules/auth/logout/logout.view";
import { Link } from "@tanstack/react-router";
import { ShieldIcon, UserCircleIcon } from "lucide-react";
import { UserMenuDropdown } from "./user-menu.ui";

export function UserMenu() {
  const { isMobile } = useSidebar();
  const { user, roleLabel } = useUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenuDropdown user={user} role={roleLabel} side={isMobile ? "bottom" : "right"}>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem disabled asChild>
              <div>
                <UserCircleIcon />
                Profil
              </div>
            </DropdownMenuItem>
            <Authorize role="Admin">
              <DropdownMenuItem asChild>
                <Link to="/admin">
                  <ShieldIcon />
                  Administration
                </Link>
              </DropdownMenuItem>
            </Authorize>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <LogoutView />
        </UserMenuDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
