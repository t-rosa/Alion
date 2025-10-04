import { Loader } from "./loader";

export function PendingScreen() {
  return (
    <div className="isolate flex size-full items-center justify-center p-6 lg:p-8">
      <div className="bg-card/50 w-full max-w-xs rounded-lg border text-center shadow-md ring-1 ring-black/5">
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 text-base/6 font-medium">
            <span>Chargement en cours.</span>
            <Loader />
          </div>
          <p className="text-muted-foreground mt-2 text-sm/5">Veuillez patienter...</p>
        </div>
      </div>
    </div>
  );
}
