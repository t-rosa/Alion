import { useTheme } from "@/components/theme-provider";
import * as React from "react";
import { ThemeSwitcherMenuItem } from "./theme-switcher.ui";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  function handleThemeChange() {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <ThemeSwitcherMenuItem
      mounted={mounted}
      isDark={theme === "dark"}
      onThemeChange={handleThemeChange}
    />
  );
}
