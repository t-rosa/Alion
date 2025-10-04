import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

interface SidebarThemeToggleProps {
  mounted: boolean;
  isDark: boolean;
  onThemeChange: () => void;
}

export function ThemeSwitcherMenuItem(props: SidebarThemeToggleProps) {
  return (
    <>
      <SidebarMenuItem className="hidden group-data-[collapsible=icon]:block">
        <SidebarMenuButton onClick={props.onThemeChange}>
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-9v18m0-12l4.65-4.65M12 14.3l7.37-7.37M12 19.6l8.85-8.85"
            ></path>
          </svg>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
        <SidebarMenuButton asChild>
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0m9-9v18m0-12l4.65-4.65M12 14.3l7.37-7.37M12 19.6l8.85-8.85"
              ></path>
            </svg>
            <span>Changer le thème</span>
            {props.mounted ?
              <Switch
                className="ml-auto"
                checked={props.isDark}
                onCheckedChange={props.onThemeChange}
              />
            : <Skeleton className="ml-auto h-4 w-8 rounded-full" />}
          </label>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
