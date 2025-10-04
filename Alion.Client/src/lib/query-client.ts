import type { QueryKey } from "@tanstack/react-query";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError() {
      toast.error("Une erreur inattendue est survenue. Veuillez réessayer dans quelques instants.");
    },
  }),
  mutationCache: new MutationCache({
    onSuccess(_data, _variables, _context, mutation) {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
    },
    onError(data, _variable, _context, mutation) {
      if (mutation.meta?.errorMessage) {
        toast.error(mutation.meta.errorMessage);
        console.error(data);
      }
    },
    async onSettled(_data, _error, _variable, _context, mutation) {
      if (mutation.meta?.invalidatesQuery) {
        await queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidatesQuery,
        });
      }
    },
  }),
});

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidatesQuery?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}
