import { NotFoundScreen } from "@/components/not-found-screen";
import { PendingScreen } from "@/components/pending-screen";
import { ErrorView } from "@/modules/error/error.view";
import { routeTree } from "@/routeTree.gen";
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./query-client";

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundScreen,
  defaultPendingComponent: PendingScreen,
  defaultErrorComponent: ErrorView,
  defaultViewTransition: true,
  defaultPreloadStaleTime: 0,
  defaultPreload: "intent",
  defaultPendingMs: 150,
  defaultPendingMinMs: 150,
  scrollRestoration: true,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
