import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@tanstack/react-router";
import { CopyIcon, FrameIcon } from "lucide-react";
import * as React from "react";

export function ErrorLayout(props: React.PropsWithChildren) {
  return (
    <div className="isolate flex size-full items-center justify-center p-6 lg:p-8">
      {props.children}
    </div>
  );
}

export function ErrorCard(props: React.PropsWithChildren) {
  return (
    <div className="bg-card/50 w-full max-w-md rounded-lg border shadow-md ring-1 ring-black/5">
      {props.children}
    </div>
  );
}

function ErrorCardContainer(props: React.PropsWithChildren) {
  return <div className="p-7 sm:p-11">{props.children}</div>;
}

function ErrorCardHeader() {
  return (
    <div>
      <div className="flex items-start">
        <Link to="/" title="Accueil">
          <FrameIcon />
        </Link>
      </div>
      <h1 className="mt-4 text-base/6 font-medium">Oups.</h1>
      <p className="text-muted-foreground mt-1 text-sm/5">Il y a eu une érreur.</p>
    </div>
  );
}

interface ErrorCardContentProps {
  error: { message?: string };
  onReloadClick: () => void;
  onCopyClick: () => void;
}

function ErrorCardContent(props: ErrorCardContentProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  function handleShowDetailsClick() {
    setShowDetails(!showDetails);
  }

  return (
    <div className="mt-8 space-y-6">
      <p>Nous avons rencontré une erreur, veuillez nous excuser pour ce désagrément.</p>
      <div className="grid gap-2">
        <Button onClick={props.onReloadClick} className="cursor-pointer">
          Recharger la page
        </Button>
        <Button
          variant="outline"
          className="text-muted-foreground cursor-pointer text-xs"
          onClick={handleShowDetailsClick}
        >
          {showDetails ? "Masquer les détails" : "Afficher les détails"}
        </Button>
      </div>
      {showDetails && (
        <div>
          <Button variant="link" className="cursor-pointer" onClick={props.onCopyClick}>
            <CopyIcon /> Copier le message d&apos;erreur
          </Button>
          {props.error ?
            <ScrollArea className="max-h-32 overflow-auto">
              <pre className="bg-muted text-muted-foreground rounded p-2 text-xs">
                {props.error.message ?? JSON.stringify(props.error.message, null, 2)}
              </pre>
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          : <pre className="bg-muted text-muted-foreground rounded p-2 text-xs">
              Erreur inconnue.
            </pre>
          }
        </div>
      )}
    </div>
  );
}

ErrorCard.Container = ErrorCardContainer;
ErrorCard.Header = ErrorCardHeader;
ErrorCard.Content = ErrorCardContent;
