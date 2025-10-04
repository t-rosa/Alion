import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import type { UserRoleLabel } from "@/hooks/use-user";
import type { components } from "@/lib/api/schema";
import { MoreVerticalIcon } from "lucide-react";

interface UserMenuDropdownProps extends React.PropsWithChildren {
  user?: components["schemas"]["GetUserResponse"];
  role: UserRoleLabel;
  side: "bottom" | "right";
}

export function UserMenuDropdown(props: UserMenuDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          disabled={props.user === null}
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="size-8 rounded-lg grayscale">
            <AvatarFallback className="rounded-lg uppercase">
              {props.user?.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{props.user?.email}</span>
            <span className="text-muted-foreground truncate text-xs">{props.role}</span>
          </div>
          <MoreVerticalIcon />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={props.side}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg uppercase">
                {props.user?.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{props.user?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        {props.children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
