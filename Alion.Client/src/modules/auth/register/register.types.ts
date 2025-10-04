import { z } from "zod";

export const formSchema = z
  .object({
    email: z.email({
      error: "L'email est invalide",
    }),
    password: z
      .string({
        error: "Le mot de passe est invalide",
      })
      .min(6, "Le mot de passe doit contenir au moins 6 caractères.")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule.")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
    confirmPassword: z
      .string({
        error: "Le mot de passe est invalide",
      })
      .min(6, "Le mot de passe doit contenir au moins 6 caractères.")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule.")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une lettre minuscule.")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
      .regex(/[^a-zA-Z0-9]/, "Le mot de passe doit contenir au moins un caractère spécial."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

export type RegisterFormSchema = z.infer<typeof formSchema>;
