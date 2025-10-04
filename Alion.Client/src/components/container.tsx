import { cn } from "@/lib/utils";

export function Container(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn(props.className, "px-6 lg:px-8")}>
      <div className="mx-auto max-w-2xl lg:max-w-7xl">{props.children}</div>
    </div>
  );
}
