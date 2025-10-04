import { z } from "zod";

export const formSchema = z.object({
  email: z.email({
    error: "L'email est invalide",
  }),
});

export type ForgotPasswordFormSchema = z.infer<typeof formSchema>;
