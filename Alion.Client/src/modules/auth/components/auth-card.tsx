import { Link } from "@tanstack/react-router";
import { FrameIcon } from "lucide-react";

function _AuthCard(props: React.PropsWithChildren) {
  return (
    <div className="bg-card/50 ring-border w-full max-w-md rounded-xl shadow-md ring-1">
      {props.children}
    </div>
  );
}

function _AuthCardContent(props: React.PropsWithChildren) {
  return <div className="p-7 sm:p-11">{props.children}</div>;
}

function _AuthCardHeader(props: React.PropsWithChildren) {
  return (
    <div className="mb-8">
      <div className="flex items-start">
        <Link to="/" title="Accueil">
          <FrameIcon />
        </Link>
      </div>
      {props.children}
    </div>
  );
}

function _AuthCardTitle(props: React.PropsWithChildren) {
  return <h1 className="mt-8 text-base/6 font-medium">{props.children}</h1>;
}

function _AuthCardDescription(props: React.PropsWithChildren) {
  return <p className="text-muted-foreground mt-1 text-sm/5">{props.children}</p>;
}

function _AuthCardFooter(props: React.PropsWithChildren) {
  return (
    <div className="ring-border bg-card m-1.5 rounded-lg py-4 text-center text-sm/5 ring-1">
      {props.children}
    </div>
  );
}

export const AuthCard = Object.assign(_AuthCard, {
  Content: _AuthCardContent,
  Header: _AuthCardHeader,
  Title: _AuthCardTitle,
  Description: _AuthCardDescription,
  Footer: _AuthCardFooter,
});
