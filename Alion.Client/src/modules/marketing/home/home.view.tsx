import { Link } from "@tanstack/react-router";

export function HomeView() {
  return (
    <ul>
      <li>
        <Link to="/login">login</Link>
      </li>
      <li>
        <Link to="/register">register</Link>
      </li>
      <li>
        <Link to="/reset-password">reset-password</Link>
      </li>
      <li>
        <Link to="/forgot-password">forgot-password</Link>
      </li>
      <li>
        <Link to="/villages">villages</Link>
      </li>
    </ul>
  );
}
