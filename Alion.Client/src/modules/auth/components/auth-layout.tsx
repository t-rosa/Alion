import * as React from "react";

export function AuthLayout(props: React.PropsWithChildren) {
  return (
    <div className="isolate flex items-center justify-center p-6 lg:p-8">{props.children}</div>
  );
}
