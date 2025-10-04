import { useUser, type UserRole } from "../../../hooks/use-user";

interface AuthorizeProps extends React.PropsWithChildren {
  role: UserRole;
}

export function Authorize(props: AuthorizeProps) {
  const { hasRole } = useUser();

  if (hasRole(props.role)) {
    return props.children;
  }

  return null;
}
