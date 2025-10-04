import { FormField } from "@/components/ui/form";
import { $api } from "@/lib/api/client";
import { AuthCard } from "@/modules/auth/components/auth-card";
import { AuthLayout } from "@/modules/auth/components/auth-layout";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { formSchema, type LoginFormSchema } from "./login.types";
import { LoginForm } from "./login.ui";

export function LoginView() {
  const navigate = useNavigate();

  const { mutate, status } = $api.useMutation("post", "/api/auth/login", {
    meta: {
      successMessage: "Connecté",
      errorMessage: "Il y a eu une érreur.",
      invalidatesQuery: ["get", "manage/info"],
    },
    async onSuccess() {
      await navigate({ to: "/villages" });
    },
  });

  const form = useForm<LoginFormSchema>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: LoginFormSchema) {
    mutate({
      body: values,
      params: {
        query: {
          useCookies: true,
        },
      },
    });
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthCard.Content>
          <AuthCard.Header>
            <AuthCard.Title>Bienvenue !</AuthCard.Title>
            <AuthCard.Description>Connectez-vous pour continuer.</AuthCard.Description>
          </AuthCard.Header>
          <LoginForm form={form} onSubmit={handleSubmit}>
            <FormField control={form.control} name="email" render={LoginForm.Email} />
            <FormField control={form.control} name="password" render={LoginForm.Password} />
            <LoginForm.Submit isPending={status === "pending"} />
          </LoginForm>
        </AuthCard.Content>
        <AuthCard.Footer>
          <Link to="/register">Créer un compte</Link>
        </AuthCard.Footer>
      </AuthCard>
    </AuthLayout>
  );
}
